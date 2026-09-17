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
  QuestionItem,
  QuestionOptionItem,
  TheoryBlockContent,
  FormulaConfigItem,
} from "./types";
import {
  ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID,
} from "./data";
import { FORMULA_CONFIGS_BY_BLOCK_ID } from "./data/formulas-data";

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
      return getEnrichedFallbackBlocks(topicId);
    }

    // 2. Hydrate questions and formulas
    const results: ContentBlockWithDetails[] = [];

    for (const block of blocks) {
      const typedContent = block.content as
        | TheoryBlockContent
        | Record<string, unknown>
        | null;

      // Check for associated formula config
      let hydratedFormulaConfig: FormulaConfigItem | undefined = undefined;
      const formulaRows = await db
        .select()
        .from(formulaConfigs)
        .where(eq(formulaConfigs.contentBlockId, block.id));

      if (formulaRows && formulaRows.length > 0) {
        const fc = formulaRows[0];
        const variableRows = await db
          .select()
          .from(formulaVariables)
          .where(eq(formulaVariables.formulaId, fc.id))
          .orderBy(asc(formulaVariables.displayOrder));

        hydratedFormulaConfig = {
          id: fc.id,
          name: fc.name,
          formulaExpression: fc.formulaExpression,
          resultUnit: fc.resultUnit,
          description: fc.description,
          variables: variableRows.map((v) => ({
            id: v.id,
            symbol: v.symbol,
            label: v.label,
            unit: v.unit,
            dataType: v.dataType,
            defaultValue: parseFloat(v.defaultValue || "0"),
            minValue: v.minValue ? parseFloat(v.minValue) : null,
            maxValue: v.maxValue ? parseFloat(v.maxValue) : null,
            displayOrder: v.displayOrder,
          })),
        };
      }

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
          formulaConfig: hydratedFormulaConfig,
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
          formulaConfig: hydratedFormulaConfig,
        });
      }
    }

    return results;
  } catch {
    // Graceful fallback for local development or during static site generation
    return getEnrichedFallbackBlocks(topicId);
  }
}

function getEnrichedFallbackBlocks(topicId: string): ContentBlockWithDetails[] {
  const fallbackBlocks = ALL_TOPIC_CONTENT_BLOCKS_BY_TOPIC_ID[topicId] || [];
  return fallbackBlocks.map((block) => {
    const rawFormula = FORMULA_CONFIGS_BY_BLOCK_ID[block.id];
    if (!rawFormula) return block;

    const formulaConfig: FormulaConfigItem = {
      id: rawFormula.id,
      name: rawFormula.name,
      formulaExpression: rawFormula.formulaExpression,
      resultUnit: rawFormula.resultUnit,
      description: rawFormula.description,
      variables: rawFormula.variables.map((v) => ({
        id: v.id,
        symbol: v.symbol,
        label: v.label,
        unit: v.unit,
        dataType: v.dataType,
        defaultValue: parseFloat(v.defaultValue || "0"),
        minValue: v.minValue ? parseFloat(v.minValue) : null,
        maxValue: v.maxValue ? parseFloat(v.maxValue) : null,
        displayOrder: v.displayOrder,
      })),
    };

    return {
      ...block,
      formulaConfig,
    };
  });
}
