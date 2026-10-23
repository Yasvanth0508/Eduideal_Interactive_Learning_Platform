import type { Metadata } from "next";
import Link from "next/link";
import { Users, ShieldCheck, MapPin, Sparkles, User } from "lucide-react";
import { eq, and, count } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { LogoutButton } from "@/features/auth/components/logout-button";

export const metadata: Metadata = {
  title: "Admin Portal | Learnova — EDUiDEAL Academy",
  description:
    "Administrator control center for student management and curriculum assignments.",
};

export default async function AdminPage() {
  const user = await requireRole("ADMIN");

  const [studentCountResult] = await db
    .select({ count: count() })
    .from(users)
    .where(
      and(
        eq(users.role, "STUDENT"),
        eq(users.branchId, user.branchId)
      )
    );

  const studentCount = Number(studentCountResult?.count ?? 0);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#C0222E] selection:text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/admin" className="flex items-center gap-3 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="h-8 sm:h-9 w-auto object-contain block group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pl-3 pr-3.5 py-1.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5] text-xs">
              <User className="w-3.5 h-3.5 text-[#C0222E]" />
              <span className="font-semibold text-black">{user.name}</span>
              <span className="text-[#E5E5E5]">|</span>
              <span className="flex items-center gap-1 text-[#555555]">
                <MapPin className="w-3 h-3 text-slate-400" />
                {user.branchName}
              </span>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-10 flex-1">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                background: "var(--brand-tint)",
                color: "var(--brand)",
                border: "1px solid var(--brand-border)",
              }}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>BRANCH ADMINISTRATION</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-[#555555] mt-1">
            {user.branchName} branch
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Branch Students
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 text-[#C0222E] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-black text-black">
              {studentCount}
            </div>
            <p className="text-xs text-[#555555] mt-1.5">
              Enrolled students registered under {user.branchName}
            </p>
          </div>
        </div>

        {/* Placeholder Information Box */}
        <div className="p-8 rounded-3xl bg-[#FAFAFA] border border-[#E5E5E5] text-center max-w-xl mx-auto my-6 shadow-xs">
          <Sparkles className="w-6 h-6 text-[#C0222E] mx-auto mb-3" />
          <h2 className="text-base font-bold text-black mb-1">Administration Portal</h2>
          <p className="text-xs sm:text-sm text-[#555555]">
            Student management is coming next.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#555555] border-t border-[#E5E5E5] bg-white font-mono">
        EDUiDEAL Academy — Learnova Digitalized Learning World &copy; 2026
      </footer>
    </div>
  );
}
