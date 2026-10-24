"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, branches } from "@/lib/db/schema";
import { loginSchema } from "./schemas";

export interface ActionState {
  error?: string;
}

export async function loginAction(
  _prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const rawIdentifier = formData.get("identifier");
  const rawPassword = formData.get("password");
  const rawNext = formData.get("next");

  // a. Validate with Zod. On failure return generic input error.
  const validation = loginSchema.safeParse({
    identifier: typeof rawIdentifier === "string" ? rawIdentifier : "",
    password: typeof rawPassword === "string" ? rawPassword : "",
    next: typeof rawNext === "string" ? rawNext : undefined,
  });

  if (!validation.success) {
    return {
      error: "Please enter your register number or email, and your password.",
    };
  }

  const { identifier, password, next: nextParam } = validation.data;

  // b. Determine email address
  let email: string;
  if (identifier.includes("@")) {
    email = identifier.toLowerCase();
  } else {
    // Treat as register number and look up users.email with Drizzle
    const [foundUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.registerNumber, identifier))
      .limit(1);

    if (!foundUser) {
      return {
        error: "Invalid register number / email or password.",
      };
    }
    email = foundUser.email;
  }

  // c. Call supabase.auth.signInWithPassword using the server client
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (signInError) {
    return {
      error: "Invalid register number / email or password.",
    };
  }

  // d. Load the users row and check active status
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    await supabase.auth.signOut();
    return {
      error: "Invalid register number / email or password.",
    };
  }

  const userRows = await db
    .select({
      id: users.id,
      role: users.role,
      isActive: users.isActive,
      branchIsActive: branches.isActive,
    })
    .from(users)
    .innerJoin(branches, eq(users.branchId, branches.id))
    .where(eq(users.id, authUser.id))
    .limit(1);

  if (
    userRows.length === 0 ||
    !userRows[0].isActive ||
    !userRows[0].branchIsActive
  ) {
    await supabase.auth.signOut();
    return {
      error: "Your account is not active. Please contact your branch admin.",
    };
  }

  // e. Redirect based on role and optional safe `next` path
  const userRole = userRows[0].role;
  let targetPath = userRole === "ADMIN" ? "/admin" : "/dashboard";

  if (nextParam) {
    const trimmedNext = nextParam.trim();
    const isSafeRelative =
      trimmedNext.startsWith("/") &&
      !trimmedNext.startsWith("//") &&
      !trimmedNext.includes("\\") &&
      !trimmedNext.includes(":");
    const isNotLogin =
      trimmedNext !== "/login" &&
      !trimmedNext.startsWith("/login?") &&
      !trimmedNext.startsWith("/login/");

    if (isSafeRelative && isNotLogin) {
      if (userRole === "ADMIN" && trimmedNext.startsWith("/admin")) {
        targetPath = trimmedNext;
      } else if (userRole === "STUDENT" && !trimmedNext.startsWith("/admin")) {
        targetPath = trimmedNext;
      }
    }
  }

  redirect(targetPath);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
