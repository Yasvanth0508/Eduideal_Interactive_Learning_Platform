"use server";

import { revalidatePath } from "next/cache";
import { and, eq, inArray, ne } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { classes, studentSubjects, subjects, users } from "@/lib/db/schema";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createStudentSchema,
  deleteStudentSchema,
  resetPasswordSchema,
  setActiveSchema,
  studentSubjectSchema,
  updateStudentSchema,
} from "./schemas";

export interface CreateStudentResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  credentials?: {
    name: string;
    registerNumber: string;
    password: string;
  };
}

export async function createStudent(
  _prevState: CreateStudentResult | null,
  formData: FormData
): Promise<CreateStudentResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    name: formData.get("name"),
    email: formData.get("email"),
    registerNumber: formData.get("registerNumber"),
    classId: formData.get("classId"),
    password: formData.get("password"),
    subjectIds: formData.getAll("subjectIds").filter((v): v is string => typeof v === "string" && v.length > 0),
  };

  const parsed = createStudentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, registerNumber, classId, password, subjectIds } = parsed.data;

  // 1. Verify selected class exists and is active
  const [targetClass] = await db
    .select({ id: classes.id })
    .from(classes)
    .where(and(eq(classes.id, classId), eq(classes.isActive, true)))
    .limit(1);

  if (!targetClass) {
    return { error: "The selected class does not exist or is inactive." };
  }

  // Verify all selected subjects belong to this class and are published
  if (subjectIds.length > 0) {
    const validSubjects = await db
      .select({ id: subjects.id })
      .from(subjects)
      .where(
        and(
          inArray(subjects.id, subjectIds),
          eq(subjects.classId, classId),
          eq(subjects.isPublished, true)
        )
      );

    if (validSubjects.length !== subjectIds.length) {
      return { error: "One or more selected subjects are invalid for this class." };
    }
  }

  // 2. Create the Supabase Auth user
  const supabaseAdmin = createAdminClient();
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError || !authData?.user) {
    console.error("createStudent: auth.admin.createUser error:", authError);
    const msg = authError?.message?.toLowerCase() || "";
    if (msg.includes("already registered") || msg.includes("already exists") || msg.includes("unique")) {
      return { error: "This email is already registered." };
    }
    return { error: "Could not create user account. Please try again." };
  }

  const authUserId = authData.user.id;

  // 3. Database transaction to create student user row and student_subjects rows
  try {
    await db.transaction(async (tx) => {
      const [existingReg] = await tx
        .select({ id: users.id })
        .from(users)
        .where(eq(users.registerNumber, registerNumber))
        .limit(1);

      if (existingReg) {
        throw new Error("REGISTER_NUMBER_IN_USE");
      }

      await tx.insert(users).values({
        id: authUserId,
        email,
        name,
        role: "STUDENT",
        branchId: admin.branchId,
        registerNumber,
        classId,
        isActive: true,
      });

      if (subjectIds.length > 0) {
        await tx.insert(studentSubjects).values(
          subjectIds.map((subjectId) => ({
            studentId: authUserId,
            subjectId,
            assignedBy: admin.id,
            isActive: true,
          }))
        );
      }
    });
  } catch (txErr: unknown) {
    console.error("createStudent: database transaction error:", txErr);
    // Rollback: delete created auth user
    try {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    } catch (delErr) {
      console.error("createStudent: auth rollback deletion failed:", delErr);
    }

    const errorObj = txErr as { message?: string; code?: string; detail?: string };
    if (
      errorObj?.message === "REGISTER_NUMBER_IN_USE" ||
      errorObj?.code === "23505"
    ) {
      const detail = errorObj?.detail || "";
      if (detail.includes("email")) {
        return { error: "This email is already registered." };
      }
      return { error: "This register number is already in use." };
    }

    return { error: "Could not save student profile. Please try again." };
  }

  revalidatePath("/admin");

  return {
    ok: true,
    credentials: {
      name,
      registerNumber,
      password,
    },
  };
}

export interface UpdateStudentResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function updateStudent(
  _prevState: UpdateStudentResult | null,
  formData: FormData
): Promise<UpdateStudentResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    name: formData.get("name"),
    registerNumber: formData.get("registerNumber"),
  };

  const parsed = updateStudentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Please check the form for errors.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { studentId, name, registerNumber } = parsed.data;

  // Verify student belongs to this admin's branch
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  try {
    // Check if register number is already in use by another user
    const [duplicate] = await db
      .select({ id: users.id })
      .from(users)
      .where(
        and(
          eq(users.registerNumber, registerNumber),
          ne(users.id, studentId)
        )
      )
      .limit(1);

    if (duplicate) {
      return { error: "This register number is already in use." };
    }

    await db
      .update(users)
      .set({
        name,
        registerNumber,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, studentId),
          eq(users.role, "STUDENT"),
          eq(users.branchId, admin.branchId)
        )
      );

    revalidatePath("/admin");
    revalidatePath(`/admin/students/${studentId}`);

    return { ok: true };
  } catch (err: unknown) {
    console.error("updateStudent error:", err);
    const errorObj = err as { code?: string };
    if (errorObj?.code === "23505") {
      return { error: "This register number is already in use." };
    }
    return { error: "Could not update student. Please try again." };
  }
}

export interface MutationResult {
  ok?: boolean;
  error?: string;
}

export async function grantSubject(
  formData: FormData
): Promise<MutationResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    subjectId: formData.get("subjectId"),
  };

  const parsed = studentSubjectSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Invalid student or subject ID." };
  }

  const { studentId, subjectId } = parsed.data;

  // Verify student belongs to this branch and get student's classId
  const [student] = await db
    .select({
      id: users.id,
      classId: users.classId,
    })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  if (!student.classId) {
    return { error: "Student has no class assigned." };
  }

  // Verify subject belongs to the student's class and is published
  const [subject] = await db
    .select({ id: subjects.id })
    .from(subjects)
    .where(
      and(
        eq(subjects.id, subjectId),
        eq(subjects.classId, student.classId),
        eq(subjects.isPublished, true)
      )
    )
    .limit(1);

  if (!subject) {
    return { error: "Subject is not available for this student's class." };
  }

  try {
    await db
      .insert(studentSubjects)
      .values({
        studentId,
        subjectId,
        isActive: true,
        assignedAt: new Date(),
        assignedBy: admin.id,
        revokedAt: null,
        revokedBy: null,
      })
      .onConflictDoUpdate({
        target: [studentSubjects.studentId, studentSubjects.subjectId],
        set: {
          isActive: true,
          assignedAt: new Date(),
          assignedBy: admin.id,
          revokedAt: null,
          revokedBy: null,
        },
      });

    revalidatePath("/admin");
    revalidatePath(`/admin/students/${studentId}`);
    return { ok: true };
  } catch (err) {
    console.error("grantSubject error:", err);
    return { error: "Could not grant subject. Please try again." };
  }
}

export async function revokeSubject(
  formData: FormData
): Promise<MutationResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    subjectId: formData.get("subjectId"),
  };

  const parsed = studentSubjectSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Invalid student or subject ID." };
  }

  const { studentId, subjectId } = parsed.data;

  // Verify student belongs to this branch
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  try {
    await db
      .update(studentSubjects)
      .set({
        isActive: false,
        revokedAt: new Date(),
        revokedBy: admin.id,
      })
      .where(
        and(
          eq(studentSubjects.studentId, studentId),
          eq(studentSubjects.subjectId, subjectId)
        )
      );

    revalidatePath("/admin");
    revalidatePath(`/admin/students/${studentId}`);
    return { ok: true };
  } catch (err) {
    console.error("revokeSubject error:", err);
    return { error: "Could not revoke subject access. Please try again." };
  }
}

export interface ResetPasswordResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  password?: string;
}

export async function resetPassword(
  _prevState: ResetPasswordResult | null,
  formData: FormData
): Promise<ResetPasswordResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    password: formData.get("password"),
  };

  const parsed = resetPasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Please check the password requirements.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { studentId, password } = parsed.data;

  // Verify student belongs to this branch
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      studentId,
      { password }
    );

    if (authError) {
      console.error("resetPassword: auth error:", authError);
      return { error: "Could not reset password. Please try again." };
    }

    return {
      ok: true,
      password,
    };
  } catch (err) {
    console.error("resetPassword error:", err);
    return { error: "Could not reset password. Please try again." };
  }
}

export async function setStudentActive(
  formData: FormData
): Promise<MutationResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    active: formData.get("active") === "true",
  };

  const parsed = setActiveSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: "Invalid request data." };
  }

  const { studentId, active } = parsed.data;

  // Verify student belongs to this branch
  const [student] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  try {
    await db
      .update(users)
      .set({
        isActive: active,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(users.id, studentId),
          eq(users.role, "STUDENT"),
          eq(users.branchId, admin.branchId)
        )
      );

    revalidatePath("/admin");
    revalidatePath(`/admin/students/${studentId}`);
    return { ok: true };
  } catch (err) {
    console.error("setStudentActive error:", err);
    return { error: "Could not update student status. Please try again." };
  }
}

export interface DeleteStudentResult {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
}

export async function deleteStudent(
  _prevState: DeleteStudentResult | null,
  formData: FormData
): Promise<DeleteStudentResult> {
  const admin = await requireRole("ADMIN");

  const rawData = {
    studentId: formData.get("studentId"),
    confirmRegisterNumber: formData.get("confirmRegisterNumber"),
  };

  const parsed = deleteStudentSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      error: "Please enter the register number to confirm.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { studentId, confirmRegisterNumber } = parsed.data;

  // Verify student belongs to this branch
  const [student] = await db
    .select({
      id: users.id,
      registerNumber: users.registerNumber,
    })
    .from(users)
    .where(
      and(
        eq(users.id, studentId),
        eq(users.role, "STUDENT"),
        eq(users.branchId, admin.branchId)
      )
    )
    .limit(1);

  if (!student) {
    return { error: "Student not found." };
  }

  if ((student.registerNumber || "").trim() !== confirmRegisterNumber) {
    return { error: "The entered register number does not match." };
  }

  // Delete the auth user first
  const supabaseAdmin = createAdminClient();
  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(studentId);

  if (authError) {
    console.error("deleteStudent: auth deleteUser error:", authError);
    return { error: "Could not delete user account. Student profile was not removed." };
  }

  try {
    // Delete profile (cascades remove access, progress, and notes)
    await db
      .delete(users)
      .where(
        and(
          eq(users.id, studentId),
          eq(users.role, "STUDENT"),
          eq(users.branchId, admin.branchId)
        )
      );

    revalidatePath("/admin");
    return { ok: true };
  } catch (err) {
    console.error("deleteStudent: database deletion error:", err);
    return { error: "Could not remove student profile. Please try again." };
  }
}
