import { db } from "@/lib/db";
import { subjects } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { contentRegistry } from "@/content/registry";
import { ChapterDetail, ChapterWithTopics, TopicDetail, TopicListItem } from "./types";

/**
 * Fetches all published chapters for a given subject.
 * Subject publication status is verified against the database catalog when available,
 * while chapters and topics are resolved strictly from the static ContentRegistry.
 */
export async function getSubjectChapters(
  subjectSlug: string
): Promise<ChapterDetail[]> {
  try {
    const regSubject = contentRegistry.getSubject(subjectSlug);
    if (!regSubject) {
      return [];
    }

    // Verify against DB subject catalog if record exists
    try {
      const [dbSubject] = await db
        .select({ isPublished: subjects.isPublished })
        .from(subjects)
        .where(eq(subjects.slug, subjectSlug))
        .limit(1);

      if (dbSubject && !dbSubject.isPublished) {
        return [];
      }
    } catch {
      // If DB is offline/unseeded in dev/test, fallback cleanly to code registry
    }

    const regChapters = contentRegistry.getChaptersBySubject(regSubject.id);

    return regChapters.map((c) => ({
      id: c.id,
      subjectId: c.subjectId,
      name: c.title,
      slug: c.slug,
      description: c.description ?? null,
      displayOrder: c.order,
      isPublished: true,
    }));
  } catch (err) {
    console.error("Error fetching subject chapters:", err);
    return [];
  }
}

/**
 * Fetches a chapter and all its topics in display_order.
 * Resolves curriculum structures strictly from ContentRegistry.
 */
export async function getChapterWithTopics(
  subjectSlug: string,
  chapterSlug: string
): Promise<ChapterWithTopics | null> {
  try {
    const regSubject = contentRegistry.getSubject(subjectSlug);
    if (!regSubject) {
      return null;
    }

    const regChapter = contentRegistry.getChapter(subjectSlug, chapterSlug);
    if (!regChapter) {
      return null;
    }

    // Verify against DB subject catalog if record exists
    try {
      const [dbSubject] = await db
        .select({ isPublished: subjects.isPublished })
        .from(subjects)
        .where(eq(subjects.slug, subjectSlug))
        .limit(1);

      if (dbSubject && !dbSubject.isPublished) {
        return null;
      }
    } catch {
      // DB check optional in offline environments
    }

    const regTopics = contentRegistry.getTopicsByChapter(regChapter.id);
    const topicsList: TopicListItem[] = regTopics.map((t) => ({
      id: t.id,
      chapterId: t.chapterId,
      name: t.title,
      slug: t.slug,
      description: t.description ?? null,
      displayOrder: t.order,
      isPublished: true,
      createdAt: null,
      updatedAt: null,
    }));

    return {
      id: regChapter.id,
      subjectId: regChapter.subjectId,
      name: regChapter.title,
      slug: regChapter.slug,
      description: regChapter.description ?? null,
      displayOrder: regChapter.order,
      isPublished: true,
      subjectName: regSubject.title,
      subjectSlug: regSubject.slug,
      topics: topicsList,
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
