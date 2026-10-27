import "server-only";

import { and, asc, count, eq, ilike, inArray, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { boards, classes, studentSubjects, subjects, users } from "@/lib/db/schema";

export interface ListStudentsParams {
  branchId: string;
  q?: string;
  status?: "all" | "active" | "inactive";
  page?: number;
}

export interface StudentListItem {
  id: string;
  name: string;
  email: string;
  registerNumber: string | null;
  isActive: boolean;
  classId: string | null;
  createdAt: Date;
  activeSubjectNames: string[];
}

export interface ListStudentsResult {
  rows: StudentListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function escapeLike(str: string): string {
  return str.replace(/[%_\\]/g, "\\$&");
}

export async function listStudents({
  branchId,
  q,
  status = "all",
  page = 1,
}: ListStudentsParams): Promise<ListStudentsResult> {
  const PAGE_SIZE = 20;
  const currentPage = Math.max(1, Math.floor(Number(page) || 1));
  const offset = (currentPage - 1) * PAGE_SIZE;

  const conditions: SQL[] = [
    eq(users.role, "STUDENT"),
    eq(users.branchId, branchId),
  ];

  if (status === "active") {
    conditions.push(eq(users.isActive, true));
  } else if (status === "inactive") {
    conditions.push(eq(users.isActive, false));
  }

  const trimmedQuery = q?.trim();
  if (trimmedQuery) {
    const escaped = `%${escapeLike(trimmedQuery)}%`;
    conditions.push(
      or(
        ilike(users.name, escaped),
        ilike(users.registerNumber, escaped),
        ilike(users.email, escaped)
      )!
    );
  }

  const whereClause = and(...conditions);

  const [countResult] = await db
    .select({ count: count() })
    .from(users)
    .where(whereClause);

  const totalCount = Number(countResult?.count ?? 0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  if (totalCount === 0) {
    return {
      rows: [],
      totalCount: 0,
      page: currentPage,
      pageSize: PAGE_SIZE,
      totalPages: 1,
    };
  }

  const studentRows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      registerNumber: users.registerNumber,
      isActive: users.isActive,
      classId: users.classId,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(asc(users.name))
    .limit(PAGE_SIZE)
    .offset(offset);

  const studentIds = studentRows.map((s) => s.id);

  let activeSubjectRows: { studentId: string; subjectName: string }[] = [];
  if (studentIds.length > 0) {
    activeSubjectRows = await db
      .select({
        studentId: studentSubjects.studentId,
        subjectName: subjects.name,
      })
      .from(studentSubjects)
      .innerJoin(subjects, eq(studentSubjects.subjectId, subjects.id))
      .where(
        and(
          inArray(studentSubjects.studentId, studentIds),
          eq(studentSubjects.isActive, true)
        )
      )
      .orderBy(asc(subjects.displayOrder), asc(subjects.name));
  }

  const subjectsByStudentId = new Map<string, string[]>();
  for (const row of activeSubjectRows) {
    const existing = subjectsByStudentId.get(row.studentId) ?? [];
    existing.push(row.subjectName);
    subjectsByStudentId.set(row.studentId, existing);
  }

  const rows: StudentListItem[] = studentRows.map((student) => ({
    ...student,
    activeSubjectNames: subjectsByStudentId.get(student.id) ?? [],
  }));

  return {
    rows,
    totalCount,
    page: currentPage,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

export interface StudentSubjectDetail {
  id: string;
  name: string;
  isGranted: boolean;
  assignedAt: Date | null;
  revokedAt: Date | null;
}

export interface StudentDetail {
  id: string;
  name: string;
  email: string;
  registerNumber: string | null;
  isActive: boolean;
  classId: string | null;
  className: string | null;
  boardName: string | null;
  createdAt: Date;
  updatedAt: Date;
  subjects: StudentSubjectDetail[];
}

export async function getStudentDetail(
  branchId: string,
  studentId: string
): Promise<StudentDetail | null> {
  const [student] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      registerNumber: users.registerNumber,
      isActive: users.isActive,
      classId: users.classId,
      className: classes.name,
      boardName: boards.name,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .leftJoin(classes, eq(users.classId, classes.id))
    .leftJoin(boards, eq(classes.boardId, boards.id))
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, branchId)
      )
    )
    .limit(1);

  if (!student) {
    return null;
  }

  let subjectsWithAccess: StudentSubjectDetail[] = [];

  if (student.classId) {
    const classSubjects = await db
      .select({
        id: subjects.id,
        name: subjects.name,
        displayOrder: subjects.displayOrder,
      })
      .from(subjects)
      .where(
        and(
          eq(subjects.classId, student.classId),
          eq(subjects.isPublished, true)
        )
      )
      .orderBy(asc(subjects.displayOrder), asc(subjects.name));

    const assignments = await db
      .select({
        subjectId: studentSubjects.subjectId,
        isActive: studentSubjects.isActive,
        assignedAt: studentSubjects.assignedAt,
        revokedAt: studentSubjects.revokedAt,
      })
      .from(studentSubjects)
      .where(eq(studentSubjects.studentId, studentId));

    const assignmentMap = new Map(assignments.map((a) => [a.subjectId, a]));

    subjectsWithAccess = classSubjects.map((subject) => {
      const assignment = assignmentMap.get(subject.id);
      return {
        id: subject.id,
        name: subject.name,
        isGranted: assignment ? assignment.isActive : false,
        assignedAt: assignment?.assignedAt ?? null,
        revokedAt: assignment?.revokedAt ?? null,
      };
    });
  }

  return {
    ...student,
    subjects: subjectsWithAccess,
  };
}

export interface CreateFormData {
  classes: { id: string; label: string }[];
  subjects: { id: string; classId: string; name: string }[];
}

export async function getCreateFormData(): Promise<CreateFormData> {
  const classRows = await db
    .select({
      id: classes.id,
      className: classes.name,
      boardName: boards.name,
      displayOrder: classes.displayOrder,
    })
    .from(classes)
    .innerJoin(boards, eq(classes.boardId, boards.id))
    .where(and(eq(classes.isActive, true), eq(boards.isActive, true)))
    .orderBy(asc(boards.name), asc(classes.displayOrder), asc(classes.name));

  const subjectRows = await db
    .select({
      id: subjects.id,
      classId: subjects.classId,
      name: subjects.name,
      displayOrder: subjects.displayOrder,
    })
    .from(subjects)
    .where(eq(subjects.isPublished, true))
    .orderBy(asc(subjects.displayOrder), asc(subjects.name));

  return {
    classes: classRows.map((c) => ({
      id: c.id,
      label: `${c.boardName} - Class ${c.className}`,
    })),
    subjects: subjectRows.map((s) => ({
      id: s.id,
      classId: s.classId,
      name: s.name,
    })),
  };
}
