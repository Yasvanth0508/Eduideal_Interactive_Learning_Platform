import { z } from "zod";
import {
  subjectMetadataSchema,
  chapterMetadataSchema,
  topicMetadataSchema,
  theoryBlockSchema,
  imageBlockSchema,
  formulaBlockSchema,
  graphBlockSchema,
  threeDBlockSchema,
  videoBlockSchema,
  questionsBlockSchema,
  contentBlockSchema,
  topicContentSchema,
  theoryBlockDataSchema,
  imageBlockDataSchema,
  formulaBlockDataSchema,
  graphBlockDataSchema,
  threeDBlockDataSchema,
  videoBlockDataSchema,
  questionsBlockDataSchema,
  questionItemSchema,
  questionOptionSchema,
  formulaVariableSchema,
  theorySectionSchema,
  keyTermSchema,
  calloutBoxSchema,
} from "@/lib/validation/content-schema";

// ==========================================
// 1. Core Metadata Types
// ==========================================

export type SubjectMetadata = z.infer<typeof subjectMetadataSchema>;
export type ChapterMetadata = z.infer<typeof chapterMetadataSchema>;
export type TopicMetadata = z.infer<typeof topicMetadataSchema>;

// ==========================================
// 2. Content Block Payloads
// ==========================================

export type KeyTerm = z.infer<typeof keyTermSchema>;
export type CalloutBox = z.infer<typeof calloutBoxSchema>;
export type TheorySection = z.infer<typeof theorySectionSchema>;
export type TheoryBlockContent = z.infer<typeof theoryBlockDataSchema>;
export type TheoryBlockData = TheoryBlockContent;

export type ImageBlockData = z.infer<typeof imageBlockDataSchema>;

export type FormulaVariableItem = z.infer<typeof formulaVariableSchema>;
export type FormulaConfigItem = z.infer<typeof formulaBlockDataSchema>;
export type FormulaBlockData = FormulaConfigItem;

export type GraphBlockData = z.infer<typeof graphBlockDataSchema>;
export type ThreeDBlockData = z.infer<typeof threeDBlockDataSchema>;
export type VideoBlockData = z.infer<typeof videoBlockDataSchema>;

export type QuestionOptionItem = z.infer<typeof questionOptionSchema>;
export type QuestionItem = z.infer<typeof questionItemSchema>;
export type QuestionsBlockData = z.infer<typeof questionsBlockDataSchema>;

// ==========================================
// 3. Supported Content Block Types
// ==========================================

export type ContentBlockType =
  | "THEORY"
  | "IMAGE"
  | "FORMULA"
  | "GRAPH"
  | "THREE_D"
  | "VIDEO"
  | "QUESTIONS";

// ==========================================
// 4. Discriminated Union Content Block Types
// ==========================================

export type TheoryBlock = z.infer<typeof theoryBlockSchema>;
export type ImageBlock = z.infer<typeof imageBlockSchema>;
export type FormulaBlock = z.infer<typeof formulaBlockSchema>;
export type GraphBlock = z.infer<typeof graphBlockSchema>;
export type ThreeDBlock = z.infer<typeof threeDBlockSchema>;
export type VideoBlock = z.infer<typeof videoBlockSchema>;
export type QuestionsBlock = z.infer<typeof questionsBlockSchema>;

export type ContentBlock = z.infer<typeof contentBlockSchema>;

// Full Topic Content
export type TopicContent = z.infer<typeof topicContentSchema>;

// ==========================================
// 5. Backward Compatibility Types
// ==========================================

export interface ContentBlockWithDetails {
  id: string;
  topicId?: string;
  type: ContentBlockType;
  title: string | null;
  description: string | null;
  content?: TheoryBlockContent | Record<string, unknown> | null;
  displayOrder: number;
  isPublished?: boolean;
  questions?: QuestionItem[];
  formulaConfig?: FormulaConfigItem | null;
  data?: unknown;
  image?: ImageBlockData;
  graphConfig?: GraphBlockData;
  threeDConfig?: ThreeDBlockData;
  videoConfig?: VideoBlockData;
}
