import { db } from "@/lib/db";
import { subjects, chapters, topics } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { ChapterDetail, ChapterWithTopics, TopicDetail } from "./types";

/**
 * Fetches all published chapters for a given subject.
 */
export async function getSubjectChapters(
  subjectSlug: string
): Promise<ChapterDetail[]> {
  try {
    const [subject] = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.slug, subjectSlug), eq(subjects.isPublished, true)))
      .limit(1);

    if (!subject) return [];

    return await db
      .select({
        id: chapters.id,
        subjectId: chapters.subjectId,
        name: chapters.name,
        slug: chapters.slug,
        description: chapters.description,
        displayOrder: chapters.displayOrder,
        isPublished: chapters.isPublished,
      })
      .from(chapters)
      .where(and(eq(chapters.subjectId, subject.id), eq(chapters.isPublished, true)))
      .orderBy(asc(chapters.displayOrder));
  } catch (err) {
    console.error("Error fetching subject chapters:", err);
    return [];
  }
}

/**
 * Fetches a chapter and all its published topics in display_order.
 */
export async function getChapterWithTopics(
  subjectSlug: string,
  chapterSlug: string
): Promise<ChapterWithTopics | null> {
  try {
    // 1. Fetch Subject
    const [subject] = await db
      .select()
      .from(subjects)
      .where(and(eq(subjects.slug, subjectSlug), eq(subjects.isPublished, true)))
      .limit(1);

    if (!subject) {
      return null;
    }

    // 2. Fetch Chapter
    const [chapter] = await db
      .select()
      .from(chapters)
      .where(
        and(
          eq(chapters.subjectId, subject.id),
          eq(chapters.slug, chapterSlug),
          eq(chapters.isPublished, true)
        )
      )
      .limit(1);

    if (!chapter) {
      return null;
    }

    // 3. Fetch Published Topics ordered by display_order
    const topicRecords = await db
      .select()
      .from(topics)
      .where(and(eq(topics.chapterId, chapter.id), eq(topics.isPublished, true)))
      .orderBy(asc(topics.displayOrder));

    return {
      id: chapter.id,
      subjectId: chapter.subjectId,
      name: chapter.name,
      slug: chapter.slug,
      description: chapter.description,
      displayOrder: chapter.displayOrder,
      isPublished: chapter.isPublished,
      subjectName: subject.name,
      subjectSlug: subject.slug,
      topics: topicRecords,
    };
  } catch (err) {
    console.error("Error fetching chapter with topics:", err);
    return null;
  }
}

/**
 * Fetches a specific topic by slug within a chapter and subject.
 */
export async function getTopicBySlug(
  subjectSlug: string,
  chapterSlug: string,
  topicSlug: string
): Promise<TopicDetail | null> {
  try {
    const chapterData = await getChapterWithTopics(subjectSlug, chapterSlug);
    if (!chapterData) {
      return null;
    }

    const topic = chapterData.topics.find((t) => t.slug === topicSlug);
    if (!topic || !topic.isPublished) {
      return null;
    }

    return {
      ...topic,
      chapterName: chapterData.name,
      chapterSlug: chapterData.slug,
      subjectName: chapterData.subjectName,
      subjectSlug: chapterData.subjectSlug,
    };
  } catch (err) {
    console.error("Error fetching topic by slug:", err);
    return null;
  }
}
