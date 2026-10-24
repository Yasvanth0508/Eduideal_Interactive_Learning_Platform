import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { users, branches } from "@/lib/db/schema";

export interface CurrentUser {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STUDENT";
  branchId: string;
  registerNumber: string | null;
  classId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  branchName: string;
  branchSlug: string;
  branchIsActive: boolean;
}

/**
 * Loads the current authenticated user and their organization details.
 * Calls supabase.auth.getUser() (never getSession), then loads the users row by id
 * joined with branches.
 * Returns null if there is no auth user or no matching users row.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();
  const {
    data: { user: authUser },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !authUser) {
    return null;
  }

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      branchId: users.branchId,
      registerNumber: users.registerNumber,
      classId: users.classId,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      branchName: branches.name,
      branchSlug: branches.slug,
      branchIsActive: branches.isActive,
    })
    .from(users)
    .innerJoin(branches, eq(users.branchId, branches.id))
    .where(eq(users.id, authUser.id))
    .limit(1);

  if (rows.length === 0) {
    return null;
  }

  return rows[0];
}

/**
 * Ensures a valid and active user session exists.
 * Redirects to /login if user is null or if is_active is false or the branch is inactive
 * (signs the user out from Supabase Auth before redirecting if inactive).
 */
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (!user.isActive || !user.branchIsActive) {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/login");
  }

  return user;
}

/**
 * Ensures the authenticated user has the required role.
 * Redirects to the appropriate home page if the role does not match:
 * ADMIN -> /admin
 * STUDENT -> /dashboard
 */
export async function requireRole(role: "ADMIN" | "STUDENT"): Promise<CurrentUser> {
  const user = await requireUser();

  if (user.role !== role) {
    if (user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return user;
}
