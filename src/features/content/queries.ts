import { db } from "@/lib/db";
import {
  contentBlocks,
  questions,
  questionOptions,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import {
  ContentBlockWithDetails,
  QuestionItem,
  QuestionOptionItem,
  TheoryBlockContent,
} from "./types";
import {
  ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID,
} from "./data";

/**
 * Fetches all published content blocks and associated questions for a topic.
 * Falls back to canonical topic fixtures if database connection is pending.
 */
export async function getTopicContentBlocks(
  topicId: string
): Promise<ContentBlockWithDetails[]> {
  try {
    // 1. Fetch content blocks ordered by display_order
    const blocks = await db
      .select()
      .from(contentBlocks)
      .where(
        and(
          eq(contentBlocks.topicId, topicId),
          eq(contentBlocks.isPublished, true)
        )
      )
      .orderBy(asc(contentBlocks.displayOrder));

    if (!blocks || blocks.length === 0) {
      return ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID[topicId] || [];
    }

    // 2. Hydrate questions for QUESTIONS blocks
    const results: ContentBlockWithDetails[] = [];

    for (const block of blocks) {
      const typedContent = block.content as
        | TheoryBlockContent
        | Record<string, unknown>
        | null;

      if (block.type === "QUESTIONS") {
        const questionRows = await db
          .select()
          .from(questions)
          .where(eq(questions.contentBlockId, block.id))
          .orderBy(asc(questions.displayOrder));

        const hydratedQuestions: QuestionItem[] = [];

        for (const q of questionRows) {
          const optionRows = await db
            .select()
            .from(questionOptions)
            .where(eq(questionOptions.questionId, q.id))
            .orderBy(asc(questionOptions.displayOrder));

          hydratedQuestions.push({
            id: q.id,
            questionText: q.questionText,
            questionType: q.questionType,
            difficulty: q.difficulty || "MEDIUM",
            marks: q.marks,
            explanation: q.explanation || "",
            displayOrder: q.displayOrder,
            options: optionRows.map(
              (opt): QuestionOptionItem => ({
                id: opt.id,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder,
              })
            ),
          });
        }

        results.push({
          id: block.id,
          topicId: block.topicId,
          type: block.type,
          title: block.title,
          description: block.description,
          content: typedContent,
          displayOrder: block.displayOrder,
          isPublished: block.isPublished,
          questions: hydratedQuestions,
        });
      } else {
        results.push({
          id: block.id,
          topicId: block.topicId,
          type: block.type,
          title: block.title,
          description: block.description,
          content: typedContent,
          displayOrder: block.displayOrder,
          isPublished: block.isPublished,
        });
      }
    }

    return results;
  } catch {
    // Graceful fallback for local development or during static site generation
    return ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID[topicId] || [];
  }
}
