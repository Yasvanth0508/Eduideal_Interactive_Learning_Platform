import { z } from "zod";

// ==========================================
// 1. Subject, Chapter, and Topic Metadata
// ==========================================

export const subjectMetadataSchema = z.object({
  id: z.string().trim().min(1, "Subject ID is required."),
  slug: z.string().trim().min(1, "Subject slug is required."),
  title: z.string().trim().min(1, "Subject title is required."),
  description: z.string().trim().optional(),
  grade: z.number().int().positive().default(12),
  chapterIds: z.array(z.string().trim().min(1)).default([]),
});

export const chapterMetadataSchema = z.object({
  id: z.string().trim().min(1, "Chapter ID is required."),
  subjectId: z.string().trim().min(1, "Subject ID is required."),
  slug: z.string().trim().min(1, "Chapter slug is required."),
  title: z.string().trim().min(1, "Chapter title is required."),
  order: z.number().int().nonnegative("Order must be a non-negative integer."),
  description: z.string().trim().optional(),
  topicIds: z.array(z.string().trim().min(1)).default([]),
});

export const topicMetadataSchema = z.object({
  id: z.string().trim().min(1, "Topic ID is required."),
  chapterId: z.string().trim().min(1, "Chapter ID is required."),
  subjectId: z.string().trim().min(1, "Subject ID is required."),
  slug: z.string().trim().min(1, "Topic slug is required."),
  title: z.string().trim().min(1, "Topic title is required."),
  order: z.number().int().nonnegative("Order must be a non-negative integer."),
  description: z.string().trim().optional(),
  estimatedMinutes: z.number().int().positive().optional(),
});

// ==========================================
// 2. Block Specific Payload Schemas
// ==========================================

// THEORY
export const keyTermSchema = z.object({
  term: z.string().trim().min(1),
  definition: z.string().trim().min(1),
});

export const calloutBoxSchema = z.object({
  type: z.enum(["tip", "info", "warning", "ncert"]),
  title: z.string().trim().min(1),
  text: z.string().trim().min(1),
});

export const theorySectionSchema = z.object({
  id: z.string().trim().min(1),
  badge: z.string().trim().optional(),
  heading: z.string().trim().optional(),
  subheading: z.string().trim().optional(),
  paragraphs: z.array(z.string()),
  bulletPoints: z.array(z.string()).optional(),
  keyTerms: z.array(keyTermSchema).optional(),
  callout: calloutBoxSchema.optional(),
  interactiveWidget: z.string().trim().optional(),
});

export const theoryBlockDataSchema = z.object({
  introduction: z.string().trim().optional(),
  sections: z.array(theorySectionSchema).default([]),
});

// IMAGE
export const imageBlockDataSchema = z.object({
  url: z.string().trim().min(1, "Image URL is required."),
  altText: z.string().trim().min(1, "Alt text is required for accessibility."),
  caption: z.string().trim().optional(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  aspectRatio: z.string().trim().optional(),
});

// FORMULA
export const formulaVariableSchema = z.object({
  id: z.string().trim().min(1),
  symbol: z.string().trim().min(1),
  label: z.string().trim().min(1),
  unit: z.string().trim().nullable().optional(),
  dataType: z.string().trim().optional(),
  defaultValue: z.number(),
  minValue: z.number().nullable().optional(),
  maxValue: z.number().nullable().optional(),
  step: z.number().positive().optional(),
  description: z.string().trim().optional(),
  displayOrder: z.number().int().optional(),
});

export const formulaBlockDataSchema = z.object({
  id: z.string().trim().optional(),
  formulaId: z.string().trim().optional(),
  name: z.string().trim().optional(),
  formulaName: z.string().trim().optional(),
  formulaExpression: z.string().trim().min(1),
  resultUnit: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  variables: z.array(formulaVariableSchema).default([]),
});

// GRAPH
export const graphParameterSchema = z.object({
  key: z.string().trim().min(1),
  label: z.string().trim().min(1),
  min: z.number(),
  max: z.number(),
  step: z.number().positive(),
  defaultValue: z.number(),
  unit: z.string().trim().optional(),
});

export const graphAxisSchema = z.object({
  label: z.string().trim().min(1),
  min: z.number().optional(),
  max: z.number().optional(),
  unit: z.string().trim().optional(),
});

export const graphSeriesSchema = z.object({
  name: z.string().trim().min(1),
  data: z.array(z.union([z.tuple([z.number(), z.number()]), z.number()])),
  type: z.string().trim().optional(),
});

export const graphBlockDataSchema = z.object({
  graphId: z.string().trim().optional(),
  graphType: z.enum(["2d", "function", "scatter", "bar"]).default("2d"),
  title: z.string().trim().min(1),
  description: z.string().trim().optional(),
  xAxis: graphAxisSchema,
  yAxis: graphAxisSchema,
  series: z.array(graphSeriesSchema).optional(),
  parameters: z.array(graphParameterSchema).optional(),
});

// THREE_D
export const threeDBlockDataSchema = z.object({
  modelId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  subtitle: z.string().trim().optional(),
  badge: z.string().trim().optional(),
  cameraPosition: z.tuple([z.number(), z.number(), z.number()]).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

// VIDEO
export const videoBlockDataSchema = z.object({
  url: z.string().trim().min(1, "Video URL is required."),
  provider: z.enum(["youtube", "vimeo", "custom"]),
  title: z.string().trim().optional(),
  durationSeconds: z.number().int().positive().optional(),
  thumbnailUrl: z.string().trim().optional(),
  caption: z.string().trim().optional(),
});

// QUESTIONS
export const questionOptionSchema = z.object({
  id: z.string().trim().min(1),
  optionText: z.string().trim().min(1),
  isCorrect: z.boolean(),
  displayOrder: z.number().int().nonnegative(),
});

export const questionItemSchema = z.object({
  id: z.string().trim().min(1),
  questionText: z.string().trim().min(1),
  questionType: z.enum(["MCQ", "TRUE_FALSE", "NUMERICAL", "SHORT_ANSWER"]),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  marks: z.number().int().nonnegative(),
  explanation: z.string().trim(),
  displayOrder: z.number().int().nonnegative(),
  options: z.array(questionOptionSchema).optional(),
  expectedAnswer: z.string().trim().optional(),
  hint: z.string().trim().optional(),
});

export const questionsBlockDataSchema = z.object({
  questions: z.array(questionItemSchema).default([]),
});

// ==========================================
// 3. Discriminated Union ContentBlock Schemas
// ==========================================

export const theoryBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("THEORY"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: theoryBlockDataSchema.optional(),
  content: theoryBlockDataSchema.optional(), // backward compatibility
});

export const imageBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("IMAGE"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: imageBlockDataSchema.optional(),
  image: imageBlockDataSchema.optional(), // convenience alias
});

export const formulaBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("FORMULA"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: formulaBlockDataSchema.optional(),
  formulaConfig: formulaBlockDataSchema.optional(), // backward compatibility
});

export const graphBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("GRAPH"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: graphBlockDataSchema.optional(),
  graphConfig: graphBlockDataSchema.optional(), // convenience alias
});

export const threeDBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("THREE_D"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: threeDBlockDataSchema.optional(),
  threeDConfig: threeDBlockDataSchema.optional(), // convenience alias
});

export const videoBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("VIDEO"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: videoBlockDataSchema.optional(),
  videoConfig: videoBlockDataSchema.optional(), // convenience alias
});

export const questionsBlockSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("QUESTIONS"),
  displayOrder: z.number().int().nonnegative(),
  title: z.string().trim().nullable().optional(),
  description: z.string().trim().nullable().optional(),
  data: questionsBlockDataSchema.optional(),
  questions: z.array(questionItemSchema).optional(), // backward compatibility
});

export const contentBlockSchema = z.discriminatedUnion("type", [
  theoryBlockSchema,
  imageBlockSchema,
  formulaBlockSchema,
  graphBlockSchema,
  threeDBlockSchema,
  videoBlockSchema,
  questionsBlockSchema,
]);

// Full Topic Content Document
export const topicContentSchema = z.object({
  metadata: topicMetadataSchema,
  blocks: z.array(contentBlockSchema).default([]),
});
