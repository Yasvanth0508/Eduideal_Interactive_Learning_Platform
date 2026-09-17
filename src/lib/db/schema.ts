import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  bigint,
  jsonb,
  numeric,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. Enums
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "STUDENT"]);

export const contentBlockTypeEnum = pgEnum("content_block_type", [
  "THEORY",
  "IMAGE",
  "FORMULA",
  "GRAPH",
  "THREE_D",
  "VIDEO",
  "QUESTIONS",
]);

export const questionTypeEnum = pgEnum("question_type", [
  "MCQ",
  "TRUE_FALSE",
  "NUMERICAL",
  "SHORT_ANSWER",
]);

export const difficultyLevelEnum = pgEnum("difficulty_level", [
  "EASY",
  "MEDIUM",
  "HARD",
]);

export const progressStatusEnum = pgEnum("progress_status", [
  "NOT_STARTED",
  "IN_PROGRESS",
  "COMPLETED",
]);

// ==========================================
// 2. Core Tables
// ==========================================

export const users = pgTable("users", {
  id: uuid("id").primaryKey(), // Matches auth.users id
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: userRoleEnum("role").notNull().default("STUDENT"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const subjects = pgTable("subjects", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  thumbnailUrl: text("thumbnail_url"),
  displayOrder: integer("display_order").default(0).notNull(),
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const chapters = pgTable(
  "chapters",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("chapters_subject_id_slug_unique").on(table.subjectId, table.slug),
    index("chapters_subject_id_idx").on(table.subjectId),
  ]
);

export const topics = pgTable(
  "topics",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chapterId: uuid("chapter_id")
      .notNull()
      .references(() => chapters.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    displayOrder: integer("display_order").default(0).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("topics_chapter_id_slug_unique").on(table.chapterId, table.slug),
    index("topics_chapter_id_idx").on(table.chapterId),
  ]
);

// ==========================================
// 3. Content System
// ==========================================

export const contentBlocks = pgTable(
  "content_blocks",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    type: contentBlockTypeEnum("type").notNull(),
    title: text("title"),
    description: text("description"),
    content: jsonb("content"),
    displayOrder: integer("display_order").default(0).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("content_blocks_topic_id_idx").on(table.topicId),
    index("content_blocks_topic_order_idx").on(table.topicId, table.displayOrder),
  ]
);

// ==========================================
// 4. Media System
// ==========================================

export const mediaAssets = pgTable("media_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  bucket: text("bucket").notNull(),
  storagePath: text("storage_path").notNull(),
  fileName: text("file_name").notNull(),
  mimeType: text("mime_type"),
  fileSize: bigint("file_size", { mode: "number" }),
  width: integer("width"),
  height: integer("height"),
  durationSec: integer("duration_sec"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const videoAssets = pgTable("video_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentBlockId: uuid("content_block_id")
    .notNull()
    .unique()
    .references(() => contentBlocks.id, { onDelete: "cascade" }),
  mediaAssetId: uuid("media_asset_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  title: text("title"),
  thumbnailAssetId: uuid("thumbnail_asset_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  durationSec: integer("duration_sec"),
  captionsPath: text("captions_path"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const threeDAssets = pgTable("three_d_assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentBlockId: uuid("content_block_id")
    .notNull()
    .unique()
    .references(() => contentBlocks.id, { onDelete: "cascade" }),
  mediaAssetId: uuid("media_asset_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  modelName: text("model_name").notNull(),
  format: text("format").default("GLB").notNull(),
  thumbnailAssetId: uuid("thumbnail_asset_id").references(() => mediaAssets.id, {
    onDelete: "set null",
  }),
  simulationConfig: jsonb("simulation_config"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 5. Formula System
// ==========================================

export const formulaConfigs = pgTable("formula_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentBlockId: uuid("content_block_id")
    .notNull()
    .unique()
    .references(() => contentBlocks.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  formulaExpression: text("formula_expression").notNull(),
  resultUnit: text("result_unit"),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const formulaVariables = pgTable(
  "formula_variables",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    formulaId: uuid("formula_id")
      .notNull()
      .references(() => formulaConfigs.id, { onDelete: "cascade" }),
    symbol: text("symbol").notNull(),
    label: text("label").notNull(),
    unit: text("unit"),
    dataType: text("data_type").default("number").notNull(),
    defaultValue: numeric("default_value"),
    minValue: numeric("min_value"),
    maxValue: numeric("max_value"),
    displayOrder: integer("display_order").default(0).notNull(),
  },
  (table) => [index("formula_variables_formula_id_idx").on(table.formulaId)]
);

// ==========================================
// 6. Graph System
// ==========================================

export const graphConfigs = pgTable("graph_configs", {
  id: uuid("id").defaultRandom().primaryKey(),
  contentBlockId: uuid("content_block_id")
    .notNull()
    .unique()
    .references(() => contentBlocks.id, { onDelete: "cascade" }),
  graphType: text("graph_type").notNull(),
  title: text("title"),
  xAxisLabel: text("x_axis_label"),
  yAxisLabel: text("y_axis_label"),
  config: jsonb("config").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ==========================================
// 7. Questions System
// ==========================================

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    contentBlockId: uuid("content_block_id")
      .notNull()
      .references(() => contentBlocks.id, { onDelete: "cascade" }),
    questionText: text("question_text").notNull(),
    questionType: questionTypeEnum("question_type").notNull(),
    difficulty: difficultyLevelEnum("difficulty"),
    marks: integer("marks").default(1).notNull(),
    explanation: text("explanation"),
    displayOrder: integer("display_order").default(0).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [index("questions_content_block_id_idx").on(table.contentBlockId)]
);

export const questionOptions = pgTable(
  "question_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "cascade" }),
    optionText: text("option_text").notNull(),
    isCorrect: boolean("is_correct").default(false).notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
  },
  (table) => [index("question_options_question_id_idx").on(table.questionId)]
);

// ==========================================
// 8. Student Access & Progress
// ==========================================

export const studentSubjects = pgTable(
  "student_subjects",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    subjectId: uuid("subject_id")
      .notNull()
      .references(() => subjects.id, { onDelete: "cascade" }),
    assignedAt: timestamp("assigned_at", { withTimezone: true }).defaultNow().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.subjectId] }),
    index("student_subjects_student_idx").on(table.studentId),
    index("student_subjects_subject_idx").on(table.subjectId),
  ]
);

export const studentProgress = pgTable(
  "student_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: uuid("topic_id")
      .notNull()
      .references(() => topics.id, { onDelete: "cascade" }),
    contentBlockId: uuid("content_block_id").references(() => contentBlocks.id, {
      onDelete: "set null",
    }),
    status: progressStatusEnum("status").default("NOT_STARTED").notNull(),
    progressPercent: integer("progress_percent").default(0).notNull(),
    lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("student_progress_student_idx").on(table.studentId),
    index("student_progress_topic_idx").on(table.topicId),
  ]
);

// ==========================================
// 9. Drizzle Relations
// ==========================================

export const usersRelations = relations(users, ({ many }) => ({
  studentSubjects: many(studentSubjects),
  progress: many(studentProgress),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  chapters: many(chapters),
  studentAssignments: many(studentSubjects),
}));

export const chaptersRelations = relations(chapters, ({ one, many }) => ({
  subject: one(subjects, {
    fields: [chapters.subjectId],
    references: [subjects.id],
  }),
  topics: many(topics),
}));

export const topicsRelations = relations(topics, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [topics.chapterId],
    references: [chapters.id],
  }),
  contentBlocks: many(contentBlocks),
  progress: many(studentProgress),
}));

export const contentBlocksRelations = relations(contentBlocks, ({ one, many }) => ({
  topic: one(topics, {
    fields: [contentBlocks.topicId],
    references: [topics.id],
  }),
  videoAsset: one(videoAssets, {
    fields: [contentBlocks.id],
    references: [videoAssets.contentBlockId],
  }),
  threeDAsset: one(threeDAssets, {
    fields: [contentBlocks.id],
    references: [threeDAssets.contentBlockId],
  }),
  formulaConfig: one(formulaConfigs, {
    fields: [contentBlocks.id],
    references: [formulaConfigs.contentBlockId],
  }),
  graphConfig: one(graphConfigs, {
    fields: [contentBlocks.id],
    references: [graphConfigs.contentBlockId],
  }),
  questions: many(questions),
  progress: many(studentProgress),
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
  contentBlock: one(contentBlocks, {
    fields: [questions.contentBlockId],
    references: [contentBlocks.id],
  }),
  options: many(questionOptions),
}));

export const questionOptionsRelations = relations(questionOptions, ({ one }) => ({
  question: one(questions, {
    fields: [questionOptions.questionId],
    references: [questions.id],
  }),
}));

export const formulaConfigsRelations = relations(formulaConfigs, ({ one, many }) => ({
  contentBlock: one(contentBlocks, {
    fields: [formulaConfigs.contentBlockId],
    references: [contentBlocks.id],
  }),
  variables: many(formulaVariables),
}));

export const formulaVariablesRelations = relations(formulaVariables, ({ one }) => ({
  formulaConfig: one(formulaConfigs, {
    fields: [formulaVariables.formulaId],
    references: [formulaConfigs.id],
  }),
}));
