import type { InferSelectModel, InferInsertModel } from "drizzle-orm";
import * as schema from "@/lib/db/schema";

// ==========================================
// 1. Roles and Database Enums
// ==========================================

export type UserRole = (typeof schema.userRoleEnum.enumValues)[number];

// ==========================================
// 2. Dynamic Database Model Types
// ==========================================

export type Branch = InferSelectModel<typeof schema.branches>;
export type NewBranch = InferInsertModel<typeof schema.branches>;

export type Board = InferSelectModel<typeof schema.boards>;
export type NewBoard = InferInsertModel<typeof schema.boards>;

export type ClassEntity = InferSelectModel<typeof schema.classes>;
export type NewClassEntity = InferInsertModel<typeof schema.classes>;

export type User = InferSelectModel<typeof schema.users>;
export type NewUser = InferInsertModel<typeof schema.users>;

export type Subject = InferSelectModel<typeof schema.subjects>;
export type NewSubject = InferInsertModel<typeof schema.subjects>;

export type StudentSubject = InferSelectModel<typeof schema.studentSubjects>;
export type NewStudentSubject = InferInsertModel<typeof schema.studentSubjects>;

export type TopicNote = InferSelectModel<typeof schema.topicNotes>;
export type NewTopicNote = InferInsertModel<typeof schema.topicNotes>;

export type TopicBookmark = InferSelectModel<typeof schema.topicBookmarks>;
export type NewTopicBookmark = InferInsertModel<typeof schema.topicBookmarks>;

// Backward-compatible alias
export type StudentNote = TopicNote;

// ==========================================
// 3. Static Educational Content Types (Re-exported from content.ts)
// ==========================================

export type {
  ContentBlockType,
  SubjectMetadata,
  ChapterMetadata,
  TopicMetadata,
  TopicContent,
  ContentBlock,
  ContentBlockWithDetails,
  TheoryBlock,
  TheoryBlockContent,
  ImageBlock,
  ImageBlockData,
  FormulaBlock,
  FormulaBlockData,
  FormulaVariableItem,
  GraphBlock,
  GraphBlockData,
  ThreeDBlock,
  ThreeDBlockData,
  VideoBlock,
  VideoBlockData,
  QuestionsBlock,
  QuestionsBlockData,
  QuestionItem,
  QuestionOptionItem,
} from "./content";
