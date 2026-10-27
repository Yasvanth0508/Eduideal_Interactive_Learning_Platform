import { db } from "@/lib/db";
import {
  contentBlocks,
  questions,
  questionOptions,
  formulaConfigs,
  formulaVariables,
} from "@/lib/db/schema";
import { eq, and, asc } from "drizzle-orm";
import {
  ContentBlockWithDetails,
  ContentBlock,
  SubjectMetadata,
  ChapterMetadata,
  TopicMetadata,
  TopicContent,
  QuestionItem,
  QuestionOptionItem,
  FormulaConfigItem,
  TheoryBlockContent,
} from "@/types/content";
import { topicContentSchema } from "@/lib/validation/content-schema";
import { contentRegistry } from "@/content/registry";

/**
 * Service for resolving curriculum metadata, topic documents, and content blocks.
 * Separates data resolution and validation from rendering logic.
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
 * Fetches all published content blocks and associated details for a topic.
 * Checks the ContentRegistry first; if empty, queries the database.
 * Never silently returns hardcoded mock or fixture data.
 */
export async function getTopicContentBlocks(
  topicId: string
): Promise<ContentBlockWithDetails[]> {
  try {
    // 1. Check in-memory ContentRegistry first
    const registryBlocks = await ContentService.resolveContentBlocks(topicId);
    if (registryBlocks.length > 0) {
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
    }

    // 2. Query persistent database if not found in registry
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
      return [];
    }

    // 3. Populate relational details (questions, formulas) for database blocks
    const populatedBlocks = await Promise.all(
      blocks.map(async (block): Promise<ContentBlockWithDetails> => {
        const baseBlock: ContentBlockWithDetails = {
          id: block.id,
          topicId: block.topicId,
          type: block.type as ContentBlockWithDetails["type"],
          title: block.title,
          description: block.description,
          content: block.content as TheoryBlockContent | null,
          displayOrder: block.displayOrder,
          isPublished: block.isPublished,
        };

        if (block.type === "QUESTIONS") {
          const qs = await db
            .select()
            .from(questions)
            .where(eq(questions.contentBlockId, block.id))
            .orderBy(asc(questions.displayOrder));

          const questionsWithOptions: QuestionItem[] = await Promise.all(
            qs.map(async (q) => {
              const opts = await db
                .select()
                .from(questionOptions)
                .where(eq(questionOptions.questionId, q.id))
                .orderBy(asc(questionOptions.displayOrder));

              const mappedOptions: QuestionOptionItem[] = opts.map((opt) => ({
                id: opt.id,
                optionText: opt.optionText,
                isCorrect: opt.isCorrect,
                displayOrder: opt.displayOrder,
              }));

              return {
                id: q.id,
                questionText: q.questionText,
                questionType: q.questionType as QuestionItem["questionType"],
                difficulty: q.difficulty as QuestionItem["difficulty"],
                marks: q.marks,
                explanation: q.explanation || "",
                displayOrder: q.displayOrder,
                options: mappedOptions,
              };
            })
          );

          baseBlock.questions = questionsWithOptions;
        } else if (block.type === "FORMULA") {
          const configs = await db
            .select()
            .from(formulaConfigs)
            .where(eq(formulaConfigs.contentBlockId, block.id));

          if (configs.length > 0) {
            const config = configs[0];
            const vars = await db
              .select()
              .from(formulaVariables)
              .where(eq(formulaVariables.formulaId, config.id))
              .orderBy(asc(formulaVariables.displayOrder));

            const formulaConfigData: FormulaConfigItem = {
              id: config.id,
              name: config.name,
              formulaExpression: config.formulaExpression,
              resultUnit: config.resultUnit,
              description: config.description,
              variables: vars.map((v) => ({
                id: v.id,
                symbol: v.symbol,
                label: v.label,
                unit: v.unit,
                dataType: v.dataType,
                defaultValue: Number(v.defaultValue),
                minValue: v.minValue ? Number(v.minValue) : null,
                maxValue: v.maxValue ? Number(v.maxValue) : null,
                displayOrder: v.displayOrder,
              })),
            };

            baseBlock.formulaConfig = formulaConfigData;
          }
        }

        return baseBlock;
      })
    );

    return populatedBlocks;
  } catch (error) {
    console.error(`Error resolving content blocks for topic "${topicId}":`, error);
    return [];
  }
}
