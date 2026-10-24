import { z } from "zod";

export const loginSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, "Identifier is required")
    .max(100, "Identifier must be at most 100 characters"),
  password: z
    .string()
    .min(1, "Password is required")
    .max(128, "Password must be at most 128 characters"),
  next: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
