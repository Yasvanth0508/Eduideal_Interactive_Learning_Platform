import { db } from "@/lib/db";
import { topicNotes } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { contentRegistry } from "@/content/registry";

/**
 * Retrieves a student's note for a specific code-defined topic ID.
 */
export async function getTopicNote(studentId: string, topicId: string) {
  try {
    const [note] = await db
      .select()
      .from(topicNotes)
      .where(
        and(
          eq(topicNotes.studentId, studentId),
          eq(topicNotes.topicId, topicId)
        )
      )
      .limit(1);

    return note || null;
  } catch (error) {
    console.error(`Error fetching note for topic ${topicId}:`, error);
    return null;
  }
}

/**
 * Saves (inserts or updates) a student's note for a code-defined topic ID.
 * Topic existence is verified in the application ContentRegistry.
 */
export async function saveTopicNote(
  studentId: string,
  topicId: string,
  content: string
) {
  if (!contentRegistry.hasTopic(topicId)) {
    throw new Error(`Topic "${topicId}" does not exist in ContentRegistry.`);
  }

  const trimmed = content.trim();

  const [saved] = await db
    .insert(topicNotes)
    .values({
      studentId,
      topicId,
      content: trimmed,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [topicNotes.studentId, topicNotes.topicId],
      set: {
        content: trimmed,
        updatedAt: new Date(),
      },
    })
    .returning();

  return saved;
}

/**
 * Deletes a student's note for a specific topic ID.
 */
export async function deleteTopicNote(studentId: string, topicId: string) {
  try {
    await db
      .delete(topicNotes)
      .where(
        and(
          eq(topicNotes.studentId, studentId),
          eq(topicNotes.topicId, topicId)
        )
      );
    return true;
  } catch (error) {
    console.error(`Error deleting note for topic ${topicId}:`, error);
    return false;
  }
}

/**
 * Lists all topic notes created by a student.
 */
export async function getStudentNotes(studentId: string) {
  try {
    return await db
      .select()
      .from(topicNotes)
      .where(eq(topicNotes.studentId, studentId))
      .orderBy(topicNotes.updatedAt);
  } catch (error) {
    console.error(`Error fetching notes for student ${studentId}:`, error);
    return [];
  }
}
