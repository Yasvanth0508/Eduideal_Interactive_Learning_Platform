import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

// ==========================================
// 1. Roles and Enums
// ==========================================

export type UserRole = (typeof schema.userRoleEnum.enumValues)[number];
export type ContentBlockType = (typeof schema.contentBlockTypeEnum.enumValues)[number];
export type QuestionType = (typeof schema.questionTypeEnum.enumValues)[number];
export type DifficultyLevel = (typeof schema.difficultyLevelEnum.enumValues)[number];
export type ProgressStatus = (typeof schema.progressStatusEnum.enumValues)[number];

// ==========================================
// 2. Database Model Types
// ==========================================

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Subject = InferSelectModel<typeof schema.subjects>;
export type NewSubject = InferInsertModel<typeof schema.subjects>;

export type Chapter = InferSelectModel<typeof schema.chapters>;
export type NewChapter = InferInsertModel<typeof schema.chapters>;

export type Topic = InferSelectModel<typeof schema.topics>;
export type NewTopic = InferInsertModel<typeof schema.topics>;

export type ContentBlock = InferSelectModel<typeof schema.contentBlocks>;
export type NewContentBlock = InferInsertModel<typeof schema.contentBlocks>;

export type MediaAsset = InferSelectModel<typeof schema.mediaAssets>;
export type VideoAsset = InferSelectModel<typeof schema.videoAssets>;
export type ThreeDAsset = InferSelectModel<typeof schema.threeDAssets>;

export type FormulaConfig = InferSelectModel<typeof schema.formulaConfigs>;
export type FormulaVariable = InferSelectModel<typeof schema.formulaVariables>;

export type GraphConfig = InferSelectModel<typeof schema.graphConfigs>;

export type Question = InferSelectModel<typeof schema.questions>;
export type QuestionOption = InferSelectModel<typeof schema.questionOptions>;

export type StudentSubject = InferSelectModel<typeof schema.studentSubjects>;
export type StudentProgress = InferSelectModel<typeof schema.studentProgress>;

// ==========================================
// 3. Content Block Payload Schemas
// ==========================================

export interface TheoryBlockContent {
  markdown: string;
  readingTimeMinutes?: number;
}

export interface ImageBlockContent {
  url: string;
  altText: string;
  caption?: string;
  aspectRatio?: string;
}

export interface GraphBlockConfig {
  xVariable: string;
  yVariable: string;
  formula?: string;
  minX?: number;
  maxX?: number;
  step?: number;
  dataPoints?: Array<[number, number]>;
}

export interface ThreeDSimulationConfig {
  simulationType: string;
  maxParticles?: number;
  defaultSpeed?: number;
  allowSpeedControl?: boolean;
  allowChargeControl?: boolean;
  parameters?: Record<string, unknown>;
}

export interface VideoBlockContent {
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  captionsUrl?: string;
}
