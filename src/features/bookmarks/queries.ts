import { db } from "@/lib/db";
import { topicBookmarks } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { contentRegistry } from "@/content/registry";

/**
 * Checks if a topic is bookmarked by a student.
 */
export async function isTopicBookmarked(
  studentId: string,
  topicId: string
): Promise<boolean> {
  try {
    const [bookmark] = await db
      .select({ topicId: topicBookmarks.topicId })
      .from(topicBookmarks)
      .where(
        and(
          eq(topicBookmarks.studentId, studentId),
          eq(topicBookmarks.topicId, topicId)
        )
      )
      .limit(1);

    return Boolean(bookmark);
  } catch (error) {
    console.error(`Error checking bookmark for topic ${topicId}:`, error);
    return false;
  }
}

/**
 * Toggles a bookmark for a code-defined topic ID.
 * Topic existence is verified in the application ContentRegistry.
 * Returns true if bookmarked, false if unbookmarked.
 */
export async function toggleTopicBookmark(
  studentId: string,
  topicId: string
): Promise<boolean> {
  if (!contentRegistry.hasTopic(topicId)) {
    throw new Error(`Topic "${topicId}" does not exist in ContentRegistry.`);
  }

  const currentlyBookmarked = await isTopicBookmarked(studentId, topicId);

  if (currentlyBookmarked) {
    await db
      .delete(topicBookmarks)
      .where(
        and(
          eq(topicBookmarks.studentId, studentId),
          eq(topicBookmarks.topicId, topicId)
        )
      );
    return false;
  } else {
    await db.insert(topicBookmarks).values({
      studentId,
      topicId,
    });
    return true;
  }
}

/**
 * Lists all bookmarked topic IDs for a student.
 */
export async function getStudentBookmarks(studentId: string): Promise<string[]> {
  try {
    const bookmarks = await db
      .select({ topicId: topicBookmarks.topicId })
      .from(topicBookmarks)
      .where(eq(topicBookmarks.studentId, studentId))
      .orderBy(topicBookmarks.createdAt);

    return bookmarks.map((b) => b.topicId);
  } catch (error) {
    console.error(`Error fetching bookmarks for student ${studentId}:`, error);
    return [];
  }
}
