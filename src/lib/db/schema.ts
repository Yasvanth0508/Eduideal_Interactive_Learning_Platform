import {
  pgTable,
  pgEnum,
  uuid,
  text,
  boolean,
  timestamp,
  integer,
  primaryKey,
  unique,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ==========================================
// 1. Enums
// ==========================================

export const userRoleEnum = pgEnum("user_role", ["ADMIN", "STUDENT"]);

// ==========================================
// 2. Organisation Tables
// ==========================================

export const branches = pgTable("branches", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const boards = pgTable("boards", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(), // e.g. CBSE, TN State Board
  slug: text("slug").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const classes = pgTable(
  "classes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    boardId: uuid("board_id")
      .notNull()
      .references(() => boards.id),
    name: text("name").notNull(), // e.g. "12"
    slug: text("slug").notNull(),
    displayOrder: integer("display_order").default(0).notNull(),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("classes_board_id_slug_unique").on(table.boardId, table.slug),
    index("classes_board_id_idx").on(table.boardId),
  ]
);

// ==========================================
// 3. User & Access Control Tables
// ==========================================

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey(), // Matches auth.users id
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    role: userRoleEnum("role").notNull().default("STUDENT"),
    branchId: uuid("branch_id")
      .notNull()
      .references(() => branches.id),
    registerNumber: text("register_number").unique(), // For students (NULL for admins)
    classId: uuid("class_id").references(() => classes.id), // For students
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_branch_id_idx").on(table.branchId),
    index("users_class_id_idx").on(table.classId),
  ]
);

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    classId: uuid("class_id")
      .notNull()
      .references(() => classes.id),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    description: text("description"),
    thumbnailUrl: text("thumbnail_url"),
    displayOrder: integer("display_order").default(0).notNull(),
    isPublished: boolean("is_published").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("subjects_class_id_slug_unique").on(table.classId, table.slug),
    index("subjects_class_id_idx").on(table.classId),
  ]
);

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
    assignedBy: uuid("assigned_by").references(() => users.id, { onDelete: "set null" }),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    revokedBy: uuid("revoked_by").references(() => users.id, { onDelete: "set null" }),
    isActive: boolean("is_active").default(true).notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.subjectId] }),
    index("student_subjects_student_idx").on(table.studentId),
    index("student_subjects_subject_idx").on(table.subjectId),
  ]
);

// ==========================================
// 4. Student Dynamic Data (Notes & Bookmarks)
// NOTE: topicId references code-defined topic IDs (e.g. "phy-c01-t01")
// without a database foreign key constraint to a topics table.
// ==========================================

export const topicNotes = pgTable(
  "topic_notes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    unique("topic_notes_student_topic_unique").on(table.studentId, table.topicId),
    index("topic_notes_student_idx").on(table.studentId),
    index("topic_notes_topic_idx").on(table.topicId),
  ]
);

export const topicBookmarks = pgTable(
  "topic_bookmarks",
  {
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    topicId: text("topic_id").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    primaryKey({ columns: [table.studentId, table.topicId] }),
    index("topic_bookmarks_student_idx").on(table.studentId),
    index("topic_bookmarks_topic_idx").on(table.topicId),
  ]
);

// Backward-compatible alias for studentNotes pointing to topicNotes
export const studentNotes = topicNotes;

// ==========================================
// 5. Drizzle Relations
// ==========================================

export const branchesRelations = relations(branches, ({ many }) => ({
  users: many(users),
}));

export const boardsRelations = relations(boards, ({ many }) => ({
  classes: many(classes),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  board: one(boards, {
    fields: [classes.boardId],
    references: [boards.id],
  }),
  subjects: many(subjects),
  students: many(users),
}));

export const usersRelations = relations(users, ({ one, many }) => ({
  branch: one(branches, {
    fields: [users.branchId],
    references: [branches.id],
  }),
  class: one(classes, {
    fields: [users.classId],
    references: [classes.id],
  }),
  studentSubjects: many(studentSubjects, { relationName: "student_subjects_student" }),
  grantedAccess: many(studentSubjects, { relationName: "student_subjects_assigned_by" }),
  revokedAccess: many(studentSubjects, { relationName: "student_subjects_revoked_by" }),
  notes: many(topicNotes),
  bookmarks: many(topicBookmarks),
}));

export const subjectsRelations = relations(subjects, ({ one, many }) => ({
  class: one(classes, {
    fields: [subjects.classId],
    references: [classes.id],
  }),
  studentAssignments: many(studentSubjects),
}));

export const studentSubjectsRelations = relations(studentSubjects, ({ one }) => ({
  student: one(users, {
    fields: [studentSubjects.studentId],
    references: [users.id],
    relationName: "student_subjects_student",
  }),
  subject: one(subjects, {
    fields: [studentSubjects.subjectId],
    references: [subjects.id],
  }),
  assignedByUser: one(users, {
    fields: [studentSubjects.assignedBy],
    references: [users.id],
    relationName: "student_subjects_assigned_by",
  }),
  revokedByUser: one(users, {
    fields: [studentSubjects.revokedBy],
    references: [users.id],
    relationName: "student_subjects_revoked_by",
  }),
}));

export const topicNotesRelations = relations(topicNotes, ({ one }) => ({
  student: one(users, {
    fields: [topicNotes.studentId],
    references: [users.id],
  }),
}));

export const topicBookmarksRelations = relations(topicBookmarks, ({ one }) => ({
  student: one(users, {
    fields: [topicBookmarks.studentId],
    references: [users.id],
  }),
}));
