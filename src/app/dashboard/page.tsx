import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ArrowRight, Sparkles, MapPin, User } from "lucide-react";
import { eq, and, asc } from "drizzle-orm";
import { requireRole } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { studentSubjects, subjects } from "@/lib/db/schema";
import { LogoutButton } from "@/features/auth/components/logout-button";

export const metadata: Metadata = {
  title: "Student Dashboard | Learnova — EDUiDEAL Academy",
  description: "View your assigned subjects, chapters, and curriculum modules.",
};

export default async function DashboardPage() {
  const user = await requireRole("STUDENT");

  const assignedSubjects = await db
    .select({
      id: subjects.id,
      name: subjects.name,
      slug: subjects.slug,
      description: subjects.description,
      displayOrder: subjects.displayOrder,
    })
    .from(studentSubjects)
    .innerJoin(subjects, eq(studentSubjects.subjectId, subjects.id))
    .where(
      and(
        eq(studentSubjects.studentId, user.id),
        eq(studentSubjects.isActive, true),
        eq(subjects.isPublished, true)
      )
    )
    .orderBy(asc(subjects.displayOrder));

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between selection:bg-[#C0222E] selection:text-white font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/dashboard" className="flex items-center gap-3 group">
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
              className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                background: "var(--brand-tint)",
                color: "var(--brand)",
                border: "1px solid var(--brand-border)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>STUDENT DASHBOARD</span>
            </span>
            <span className="text-xs font-semibold text-[#555555] sm:hidden">
              {user.branchName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black">
            Welcome, {user.name}
          </h1>
          <p className="text-sm text-[#555555] mt-1">
            Access your assigned Class 12 CBSE curriculum subjects and interactive learning modules.
          </p>
        </div>

        {assignedSubjects.length === 0 ? (
          <div className="p-10 rounded-3xl bg-[#FAFAFA] border border-[#E5E5E5] text-center max-w-lg mx-auto my-12 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#C0222E] flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-base font-bold text-black mb-1">No Subjects Assigned</h2>
            <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
              No subjects have been assigned to you yet. Please contact your branch admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assignedSubjects.map((subject) => (
              <Link
                key={subject.id}
                href={`/${subject.slug}`}
                className="group p-6 rounded-3xl bg-white border border-[#E5E5E5] hover:border-[#C0222E]/40 hover:shadow-lg hover:shadow-slate-200/50 transition-all flex flex-col justify-between relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Enrolled
                    </span>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#C0222E] group-hover:translate-x-1 transition-all" />
                  </div>
                  <h2 className="text-lg font-bold text-black group-hover:text-[#C0222E] transition-colors mb-2">
                    {subject.name}
                  </h2>
                  <p className="text-xs text-[#555555] leading-relaxed line-clamp-3">
                    {subject.description || "Comprehensive CBSE Class 12 learning modules and interactive practice."}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#E5E5E5] flex items-center justify-between text-xs font-bold text-black">
                  <span>Open Curriculum</span>
                  <span className="text-[#C0222E] group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#555555] border-t border-[#E5E5E5] bg-white">
        EDUiDEAL Academy — Learnova Digitalized Learning World &copy; 2026
      </footer>
    </div>
  );
}
