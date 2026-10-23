import { z } from "zod";

const registerNumberRegex = /^[a-zA-Z0-9_-]{3,30}$/;

export const registerNumberSchema = z
  .string()
  .trim()
  .regex(
    registerNumberRegex,
    "Register number must be 3 to 30 characters and contain only letters, numbers, hyphens, and underscores."
  );

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(72, "Password must be at most 72 characters.");

export const createStudentSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address."),
  registerNumber: registerNumberSchema,
  classId: z.string().uuid("Please select a valid class."),
  password: passwordSchema,
  subjectIds: z.array(z.string().uuid("Invalid subject ID.")).default([]),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;

export const updateStudentSchema = z.object({
  studentId: z.string().uuid("Invalid student ID."),
  name: z.string().trim().min(1, "Name is required.").max(100, "Name is too long."),
  registerNumber: registerNumberSchema,
});

export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;

export const studentSubjectSchema = z.object({
  studentId: z.string().uuid("Invalid student ID."),
  subjectId: z.string().uuid("Invalid subject ID."),
});

export type StudentSubjectInput = z.infer<typeof studentSubjectSchema>;

export const resetPasswordSchema = z.object({
  studentId: z.string().uuid("Invalid student ID."),
  password: passwordSchema,
});

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const setActiveSchema = z.object({
  studentId: z.string().uuid("Invalid student ID."),
  active: z.boolean(),
});

export type SetActiveInput = z.infer<typeof setActiveSchema>;

export const deleteStudentSchema = z.object({
  studentId: z.string().uuid("Invalid student ID."),
  confirmRegisterNumber: z.string().trim().min(1, "Confirmation register number is required."),
});

export type DeleteStudentInput = z.infer<typeof deleteStudentSchema>;
