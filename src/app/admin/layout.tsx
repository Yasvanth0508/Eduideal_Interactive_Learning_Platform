import type { Metadata } from "next";
import { requireRole } from "@/server/authorization/session";
import { AdminShell } from "@/features/students/components/admin-shell";

export const metadata: Metadata = {
  title: "Branch Admin | EDUiDEAL Academy — Learnova",
  description: "Branch student administration and subject access management.",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("ADMIN");

  return (
    <AdminShell adminName={user.name} branchName={user.branchName}>
      {children}
    </AdminShell>
  );
}
