import { db } from "@/lib/db";
import { subjects, chapters, topics } from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import { ChapterWithTopics, TopicDetail } from "./types";
import {
  getFallbackChapterWithTopics,
  getFallbackTopic,
} from "./data";

/**
 * Fetches a chapter and all its published topics in display_order.
 * Includes graceful fallback to canonical data if database connection is pending.
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
      return getFallbackChapterWithTopics(subjectSlug, chapterSlug);
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
      return getFallbackChapterWithTopics(subjectSlug, chapterSlug);
    }

    // 3. Fetch Published Topics ordered by display_order
    const topicRecords = await db
      .select()
      .from(topics)
      .where(and(eq(topics.chapterId, chapter.id), eq(topics.isPublished, true)))
      .orderBy(asc(topics.displayOrder));

    if (topicRecords.length === 0) {
      return getFallbackChapterWithTopics(subjectSlug, chapterSlug);
    }

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
  } catch {
    // Graceful fallback for local development before Supabase DB connection is live
    return getFallbackChapterWithTopics(subjectSlug, chapterSlug);
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
      return getFallbackTopic(subjectSlug, chapterSlug, topicSlug);
    }

    const topic = chapterData.topics.find((t) => t.slug === topicSlug);
    if (!topic || !topic.isPublished) {
      return getFallbackTopic(subjectSlug, chapterSlug, topicSlug);
    }

    return {
      ...topic,
      chapterName: chapterData.name,
      chapterSlug: chapterData.slug,
      subjectName: chapterData.subjectName,
      subjectSlug: chapterData.subjectSlug,
    };
  } catch {
    return getFallbackTopic(subjectSlug, chapterSlug, topicSlug);
  }
}
