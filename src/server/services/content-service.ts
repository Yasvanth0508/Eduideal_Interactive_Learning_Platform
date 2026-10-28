import {
  ContentBlockWithDetails,
  ContentBlock,
  SubjectMetadata,
  ChapterMetadata,
  TopicMetadata,
  TopicContent,
} from "@/types/content";
import { topicContentSchema } from "@/lib/validation/content-schema";
import { contentRegistry } from "@/content/registry";

/**
 * Service for resolving curriculum metadata, topic documents, and content blocks.
 * Static educational content is strictly resolved from code via ContentRegistry.
 */
export class ContentService {
  /**
   * Resolves a subject by ID or slug.
   */
  public static async resolveSubject(
    idOrSlug: string
  ): Promise<SubjectMetadata | null> {
    return contentRegistry.getSubject(idOrSlug);
  }

  /**
   * Resolves a chapter by subject slug and chapter slug.
   */
  public static async resolveChapter(
    subjectSlug: string,
    chapterSlug: string
  ): Promise<ChapterMetadata | null> {
    return contentRegistry.getChapter(subjectSlug, chapterSlug);
  }

  /**
   * Resolves a chapter by chapter ID.
   */
  public static async resolveChapterById(
    chapterId: string
  ): Promise<ChapterMetadata | null> {
    return contentRegistry.getChapterById(chapterId);
  }

  /**
   * Resolves full topic content by URL slugs.
   */
  public static async resolveTopic(
    subjectSlug: string,
    chapterSlug: string,
    topicSlug: string
  ): Promise<TopicContent | null> {
    return contentRegistry.getTopicContentBySlug(subjectSlug, chapterSlug, topicSlug);
  }

  /**
   * Resolves full topic content by topic ID.
   */
  public static async resolveTopicById(
    topicId: string
  ): Promise<TopicContent | null> {
    return contentRegistry.getTopicContent(topicId);
  }

  /**
   * Resolves topic metadata by ID.
   */
  public static async resolveTopicMetadata(
    topicId: string
  ): Promise<TopicMetadata | null> {
    return contentRegistry.getTopicMetadata(topicId);
  }

  /**
   * Checks if a topic has authored content blocks.
   */
  public static async isTopicAuthored(topicId: string): Promise<boolean> {
    return contentRegistry.isTopicAuthored(topicId);
  }

  /**
   * Checks if a chapter has any authored topics.
   */
  public static async isChapterAuthored(chapterId: string): Promise<boolean> {
    return contentRegistry.isChapterAuthored(chapterId);
  }

  /**
   * Resolves ordered content blocks for a topic.
   */
  public static async resolveContentBlocks(
    topicId: string
  ): Promise<ContentBlock[]> {
    const topic = await contentRegistry.getTopicContent(topicId);
    if (topic && topic.blocks) {
      return [...topic.blocks].sort((a, b) => a.displayOrder - b.displayOrder);
    }
    return [];
  }

  /**
   * Validates a raw topic document against the strict Zod schema.
   */
  public static validateTopicContent(rawContent: unknown) {
    return topicContentSchema.safeParse(rawContent);
  }
}

/**
 * Resolves all published content blocks and associated details for a topic.
 * Content blocks are defined strictly in code via ContentRegistry.
 * Never queries the database for static lesson content, formulas, or questions.
 * Returns an empty array if the topic has no authored content blocks.
 */
export async function getTopicContentBlocks(
  topicId: string
): Promise<ContentBlockWithDetails[]> {
  try {
    const registryBlocks = await ContentService.resolveContentBlocks(topicId);
    if (!registryBlocks || registryBlocks.length === 0) {
      return [];
    }

    return registryBlocks.map((b) => ({
      id: b.id,
      type: b.type,
      title: b.title ?? null,
      description: b.description ?? null,
      displayOrder: b.displayOrder,
      content: b.type === "THEORY" ? (b.data ?? b.content ?? null) : null,
      formulaConfig: b.type === "FORMULA" ? (b.data ?? b.formulaConfig ?? null) : null,
      questions: b.type === "QUESTIONS" ? (b.data?.questions ?? b.questions ?? []) : undefined,
      data: "data" in b ? b.data : undefined,
      image: b.type === "IMAGE" ? (b.data ?? b.image) : undefined,
      graphConfig: b.type === "GRAPH" ? (b.data ?? b.graphConfig) : undefined,
      threeDConfig: b.type === "THREE_D" ? (b.data ?? b.threeDConfig) : undefined,
      videoConfig: b.type === "VIDEO" ? (b.data ?? b.videoConfig) : undefined,
    }));
  } catch (error) {
    console.error(`Error resolving content blocks for topic "${topicId}":`, error);
    return [];
  }
}
