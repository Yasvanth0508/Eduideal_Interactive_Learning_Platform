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
  MapPin,
} from "lucide-react";
import { ChapterDetail } from "../types";
import {
  PageTitle,
  SectionTitle,
  SubsectionTitle,
  BodyParagraph,
  CaptionText,
} from "@/components/ui/typography";

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
              className="type-button flex items-center gap-2 px-3.5 py-2 rounded-xl text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer"
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
          <nav className="flex items-center gap-2 type-metadata font-medium text-[#555555] mb-4">
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
                  className="type-metadata font-bold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CBSE CLASS 12 • {subjectName}</span>
                </span>
                <span className="type-metadata font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] text-[#555555] border border-[#E5E5E5] flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{chapters.length} Chapters</span>
                </span>
              </div>

              {/* Page Title: 32px desktop / 28px mobile, 700 */}
              <PageTitle className="capitalize">
                {subjectName} Curriculum
              </PageTitle>

              {/* Body Paragraph: 17px desktop / 16px mobile, 1.7 line height */}
              <BodyParagraph className="text-[#555555] max-w-2xl">
                Explore chapter-wise interactive lessons, dynamic formula solvers,
                scientific charts, 3D simulations, and topic-wise practice problems.
              </BodyParagraph>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Content */}
      <section className="py-10 flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {chapters.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <SectionTitle>Chapters</SectionTitle>

              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search chapters..."
                  className="w-full pl-10 pr-4 py-2 type-caption bg-white border border-[#E5E5E5] rounded-xl text-black placeholder:text-slate-400 focus:outline-none focus:border-[#C0222E] transition-colors shadow-2xs"
                />
              </div>
            </div>
          )}

          {chapters.length === 0 ? (
            <div className="text-center py-16 bg-[#FAFAFA] rounded-3xl border border-[#E5E5E5] p-8 max-w-md mx-auto my-12 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-[#C0222E] flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <SubsectionTitle className="mb-1">
                No Chapters Published
              </SubsectionTitle>
              <CaptionText className="text-[#555555]">
                Curriculum content for {subjectName} will appear here once published.
              </CaptionText>
            </div>
          ) : filteredChapters.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <CaptionText className="text-[#555555]">
                No chapters found matching &quot;{searchQuery}&quot;.
              </CaptionText>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredChapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/${subjectSlug}/${chapter.slug}`}
                  className="group relative p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#C0222E] hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <span className="type-metadata font-semibold text-[#555555] tabular-nums">
                        Chapter {chapter.displayOrder}
                      </span>
                      {chapter.isPublished && (
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          <span>Published</span>
                        </span>
                      )}
                    </div>

                    <SubsectionTitle className="group-hover:text-[#C0222E] transition-colors leading-snug mb-2">
                      {chapter.name}
                    </SubsectionTitle>

                    <CaptionText className="text-[#555555] line-clamp-3 mb-4">
                      {chapter.description ||
                        "Explore interactive lessons and practice problems for this chapter."}
                    </CaptionText>
                  </div>

                  <div className="pt-4 border-t border-[#E5E5E5] flex items-center justify-between">
                    <span className="type-caption font-medium text-[#555555] flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-[#C0222E]" />
                      <span>View Topics</span>
                    </span>
                    <span className="type-button inline-flex items-center gap-1.5 text-[#C0222E] group-hover:translate-x-1 transition-transform">
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
              <p className="type-metadata text-[#555555] leading-relaxed max-w-sm">
                Explore interactive concepts, visual learning, formulas, notes,
                and practice questions designed for CBSE Class 12 students.
                Powered by EDUiDEAL Academy.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold type-metadata text-black uppercase tracking-wider mb-4">
                Branch Campuses
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BRANCHES.map((b) => (
                  <div
                    key={b.city}
                    className="p-3.5 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]"
                  >
                    <div className="flex items-center gap-1.5 type-metadata font-bold text-black">
                      <MapPin className="w-3.5 h-3.5 text-[#C0222E]" />
                      <span>{b.city}</span>
                    </div>
                    <div className="text-[11px] text-[#555555] mt-1">
                      {b.address}
                    </div>
                    <div className="text-[11px] font-semibold text-[#C0222E] mt-1">
                      {b.phone}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4 type-metadata text-[#555555]">
            <span>
              &copy; 2026 Learnova &bull; EDUiDEAL ACADEMY. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link href="/" className="hover:text-[#C0222E] transition-colors">
                Academic Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
