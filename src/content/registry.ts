import {
  SubjectMetadata,
  ChapterMetadata,
  TopicMetadata,
  TopicContent,
} from "@/types/content";
import {
  subjectMetadataSchema,
  chapterMetadataSchema,
  topicMetadataSchema,
  topicContentSchema,
} from "@/lib/validation/content-schema";
import { chemistryChapter01 } from "./class-12/chemistry/chapter-01/chapter";
import { topic01Content } from "./class-12/chemistry/chapter-01/topics/topic-01";

export type TopicLoader = () => Promise<TopicContent> | TopicContent;

export class ContentRegistry {
  private subjectsById = new Map<string, SubjectMetadata>();
  private subjectsBySlug = new Map<string, string>(); // slug -> id

  private chaptersById = new Map<string, ChapterMetadata>();
  private chaptersBySlug = new Map<string, string>(); // "subjectSlug/chapterSlug" -> id

  private topicsById = new Map<string, TopicMetadata>();
  private topicsBySlug = new Map<string, string>(); // "subjectSlug/chapterSlug/topicSlug" -> id

  private topicLoaders = new Map<string, TopicLoader>();

  /**
   * Registers a subject in the registry after validating against the schema.
   */
  public registerSubject(subject: SubjectMetadata): void {
    const validated = subjectMetadataSchema.parse(subject);
    this.subjectsById.set(validated.id, validated);
    this.subjectsBySlug.set(validated.slug.toLowerCase(), validated.id);
  }

  /**
   * Registers a chapter in the registry after validating against the schema.
   */
  public registerChapter(chapter: ChapterMetadata): void {
    const validated = chapterMetadataSchema.parse(chapter);
    this.chaptersById.set(validated.id, validated);

    const subject = this.subjectsById.get(validated.subjectId);
    const subjectSlug = subject ? subject.slug.toLowerCase() : validated.subjectId.toLowerCase();
    const key = `${subjectSlug}/${validated.slug.toLowerCase()}`;
    this.chaptersBySlug.set(key, validated.id);

    // Support chapter slug aliases (e.g. "solutions" <-> "chapter-01")
    if (validated.slug === "solutions") {
      this.chaptersBySlug.set(`${subjectSlug}/chapter-01`, validated.id);
    } else if (validated.slug === "chapter-01" && validated.id === "chem-c01") {
      this.chaptersBySlug.set(`${subjectSlug}/solutions`, validated.id);
    }
  }

  /**
   * Registers a topic and its content loader module into the registry.
   */
  public registerTopic(
    metadata: TopicMetadata,
    loader?: TopicLoader
  ): void {
    const validatedMeta = topicMetadataSchema.parse(metadata);
    this.topicsById.set(validatedMeta.id, validatedMeta);

    const subject = this.subjectsById.get(validatedMeta.subjectId);
    const chapter = this.chaptersById.get(validatedMeta.chapterId);

    const subjectSlug = subject ? subject.slug.toLowerCase() : validatedMeta.subjectId.toLowerCase();
    const chapterSlug = chapter ? chapter.slug.toLowerCase() : validatedMeta.chapterId.toLowerCase();
    const key = `${subjectSlug}/${chapterSlug}/${validatedMeta.slug.toLowerCase()}`;
    this.topicsBySlug.set(key, validatedMeta.id);

    if (chapterSlug === "solutions") {
      this.topicsBySlug.set(
        `${subjectSlug}/chapter-01/${validatedMeta.slug.toLowerCase()}`,
        validatedMeta.id
      );
    } else if (chapterSlug === "chapter-01" && validatedMeta.chapterId === "chem-c01") {
      this.topicsBySlug.set(
        `${subjectSlug}/solutions/${validatedMeta.slug.toLowerCase()}`,
        validatedMeta.id
      );
    }

    if (loader) {
      this.topicLoaders.set(validatedMeta.id, loader);
    }
  }

  // --- Lookups ---

  public getSubject(idOrSlug: string): SubjectMetadata | null {
    if (!idOrSlug) return null;
    const direct = this.subjectsById.get(idOrSlug);
    if (direct) return direct;

    const bySlugId = this.subjectsBySlug.get(idOrSlug.toLowerCase());
    if (bySlugId) return this.subjectsById.get(bySlugId) || null;

    return null;
  }

  public getAllSubjects(): SubjectMetadata[] {
    return Array.from(this.subjectsById.values());
  }

  public getChapterById(chapterId: string): ChapterMetadata | null {
    if (!chapterId) return null;
    return this.chaptersById.get(chapterId) || null;
  }

  public getChapter(subjectSlug: string, chapterSlug: string): ChapterMetadata | null {
    if (!subjectSlug || !chapterSlug) return null;
    const key = `${subjectSlug.toLowerCase()}/${chapterSlug.toLowerCase()}`;
    const chapterId = this.chaptersBySlug.get(key);
    if (!chapterId) return null;
    return this.chaptersById.get(chapterId) || null;
  }

  public getChaptersBySubject(subjectIdOrSlug: string): ChapterMetadata[] {
    const subject = this.getSubject(subjectIdOrSlug);
    if (!subject) return [];
    return Array.from(this.chaptersById.values())
      .filter((c) => c.subjectId === subject.id)
      .sort((a, b) => a.order - b.order);
  }

  public getTopicMetadata(topicId: string): TopicMetadata | null {
    if (!topicId) return null;
    return this.topicsById.get(topicId) || null;
  }

  public getTopicMetadataBySlug(
    subjectSlug: string,
    chapterSlug: string,
    topicSlug: string
  ): TopicMetadata | null {
    if (!subjectSlug || !chapterSlug || !topicSlug) return null;
    const key = `${subjectSlug.toLowerCase()}/${chapterSlug.toLowerCase()}/${topicSlug.toLowerCase()}`;
    const topicId = this.topicsBySlug.get(key);
    if (!topicId) return null;
    return this.topicsById.get(topicId) || null;
  }

  public getTopicsByChapter(chapterId: string): TopicMetadata[] {
    if (!chapterId) return [];
    return Array.from(this.topicsById.values())
      .filter((t) => t.chapterId === chapterId)
      .sort((a, b) => a.order - b.order);
  }

  public hasTopic(topicId: string): boolean {
    return this.topicsById.has(topicId);
  }

  public hasChapter(chapterId: string): boolean {
    return this.chaptersById.has(chapterId);
  }

  /**
   * Resolves full topic content document by stable topic ID.
   * Validates the loaded content against the topicContentSchema.
   * Returns null if unauthored or not found.
   */
  public async getTopicContent(topicId: string): Promise<TopicContent | null> {
    if (!topicId) return null;
    const loader = this.topicLoaders.get(topicId);
    if (!loader) {
      // If metadata exists but no loader/blocks authored, return topic content with empty blocks
      const meta = this.topicsById.get(topicId);
      if (meta) {
        return {
          metadata: meta,
          blocks: [],
        };
      }
      return null;
    }

    const raw = await loader();
    const validated = topicContentSchema.parse(raw);
    return validated;
  }

  /**
   * Resolves full topic content document by URL slugs.
   */
  public async getTopicContentBySlug(
    subjectSlug: string,
    chapterSlug: string,
    topicSlug: string
  ): Promise<TopicContent | null> {
    const meta = this.getTopicMetadataBySlug(subjectSlug, chapterSlug, topicSlug);
    if (!meta) return null;
    return this.getTopicContent(meta.id);
  }

  /**
   * Checks if a topic has authored content blocks (is not empty).
   */
  public async isTopicAuthored(topicId: string): Promise<boolean> {
    const content = await this.getTopicContent(topicId);
    return Boolean(content && content.blocks && content.blocks.length > 0);
  }

  /**
   * Checks if a chapter has any authored topics.
   */
  public async isChapterAuthored(chapterId: string): Promise<boolean> {
    const chapter = this.getChapterById(chapterId);
    if (!chapter || !chapter.topicIds || chapter.topicIds.length === 0) {
      return false;
    }
    const authoredChecks = await Promise.all(
      chapter.topicIds.map((id) => this.isTopicAuthored(id))
    );
    return authoredChecks.some(Boolean);
  }

  /**
   * Reset registry (used primarily in test suites).
   */
  public clear(): void {
    this.subjectsById.clear();
    this.subjectsBySlug.clear();
    this.chaptersById.clear();
    this.chaptersBySlug.clear();
    this.topicsById.clear();
    this.topicsBySlug.clear();
    this.topicLoaders.clear();
  }
}

// Global singleton instance with default curriculum registered
export const contentRegistry = new ContentRegistry();

// Initialize default subjects and chapters (with empty topicIds)
contentRegistry.registerSubject({
  id: "physics",
  slug: "physics",
  title: "Class 12 Physics",
  description: "Senior secondary Physics covering electrostatics, magnetism, optics, and modern physics.",
  grade: 12,
  chapterIds: ["phy-c01"],
});

contentRegistry.registerChapter({
  id: "phy-c01",
  subjectId: "physics",
  slug: "chapter-01",
  title: "Electric Charges and Fields",
  order: 1,
  description: "Study of electric charges, Coulomb's law, electric field lines, and Gauss's law.",
  topicIds: [], // Empty: unauthored
});

contentRegistry.registerSubject({
  id: "chemistry",
  slug: "chemistry",
  title: "Class 12 Chemistry",
  description: "Senior secondary Chemistry covering physical, organic, and inorganic chemistry.",
  grade: 12,
  chapterIds: ["chem-c01"],
});

contentRegistry.registerChapter(chemistryChapter01);

// Register Demo Topic for Chemistry (Solutions)
contentRegistry.registerTopic(
  topic01Content.metadata,
  () => topic01Content
);

contentRegistry.registerSubject({
  id: "mathematics",
  slug: "mathematics",
  title: "Class 12 Mathematics",
  description: "Senior secondary Mathematics covering calculus, algebra, vectors, and probability.",
  grade: 12,
  chapterIds: ["math-c01"],
});

contentRegistry.registerChapter({
  id: "math-c01",
  subjectId: "mathematics",
  slug: "chapter-01",
  title: "Relations and Functions",
  order: 1,
  description: "Types of relations, one-one and onto functions, and inverse trigonometric functions.",
  topicIds: [], // Empty: unauthored
});
