"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Search,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { ChapterDetail } from "../types";

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

interface SubjectViewProps {
  subjectSlug?: string;
  subjectName?: string;
  chapters?: ChapterDetail[];
}

export function SubjectView({
  subjectSlug = "chemistry",
  subjectName = "Chemistry",
  chapters = [],
}: SubjectViewProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChapters = chapters.filter((chapter) => {
    const q = searchQuery.toLowerCase();
    return (
      chapter.name.toLowerCase().includes(q) ||
      (chapter.description && chapter.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans flex flex-col justify-between selection:bg-[#C0222E] selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 flex-shrink-0 group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/eduideal-logo-BUtjWTvV.png"
              alt="EDUiDEAL Academy Logo"
              className="h-8 sm:h-9 w-auto object-contain block group-hover:scale-105 transition-transform"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
              <span>Back to Overview</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Subject Hero */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-black font-semibold capitalize">
              {subjectName}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CBSE CLASS 12 • {subjectName}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] text-[#555555] border border-[#E5E5E5] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{chapters.length} Chapters</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight capitalize">
                {subjectName} Curriculum
              </h1>

              <p className="text-base sm:text-lg text-[#555555] max-w-2xl leading-relaxed">
                Explore chapter-wise interactive lessons, dynamic formula solvers,
                scientific charts, 3D simulations, and topic-wise practice problems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Content */}
      <section className="py-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {chapters.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <h2 className="text-lg font-bold text-black">Chapters</h2>
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters..."
                  className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-[#E5E5E5] rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] transition-colors shadow-2xs"
                />
              </div>
            </div>
          )}

          {chapters.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAFA] rounded-3xl border border-[#E5E5E5] p-8 max-w-md mx-auto my-12 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#C0222E] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-black mb-1">
                No Chapters Published
              </h3>
              <p className="text-xs sm:text-sm text-[#555555] leading-relaxed">
                Curriculum content for {subjectName} will appear here once published.
              </p>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <p className="text-[#555555] text-sm">
                No chapters found matching &quot;{searchQuery}&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/${subjectSlug}/${chapter.slug}`}
                  className="group relative p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#C0222E] hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="text-xs font-semibold text-[#555555] tabular-nums">
                        Chapter {chapter.displayOrder}
                      </span>
                      {chapter.isPublished && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Published</span>
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-black group-hover:text-[#C0222E] transition-colors leading-snug mb-2">
                      {chapter.name}
                    </h3>

                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-3 mb-4">
                      {chapter.description ||
                        "Explore interactive lessons and practice problems for this chapter."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="text-xs font-medium text-[#555555] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#C0222E]" />
                      <span>View Topics</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C0222E] group-hover:translate-x-1 transition-transform">
                      <span>Explore Chapter</span>
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/eduideal-logo-BUtjWTvV.png"
                  alt="EDUiDEAL Academy"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#555555] leading-relaxed max-w-sm">
                Interactive learning platform for CBSE Class 12 students.
                Designed for concept clarity, visual understanding, and board examination excellence.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold text-xs text-black uppercase tracking-wider mb-3">
                EDUiDEAL Academy Branches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BRANCHES.map((b) => (
                  <div
                    key={b.city}
                    className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]"
                  >
                    <span className="text-xs font-bold text-black block mb-1">
                      {b.city}
                    </span>
                    <p className="text-xs text-[#555555] leading-tight mb-2">
                      {b.address}
                    </p>
                    <span className="text-[11px] font-mono text-[#C0222E] font-semibold">
                      Ph: {b.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between text-xs text-[#555555] gap-4">
            <p>
              &copy; {new Date().getFullYear()} EDUiDEAL Academy. All rights reserved.
            </p>
            <p className="font-mono text-[11px]">
              Learnova &bull; CBSE Class 12 Digital Learning
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
