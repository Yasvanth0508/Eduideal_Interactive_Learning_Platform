import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  BookOpen,
  CheckCircle2,
  Layers,
  MapPin,
  Sparkles,
} from "lucide-react";
import { getChapterWithTopics } from "../queries";

interface ChapterDetailViewProps {
  subjectSlug: string;
  chapterSlug: string;
}

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

export async function ChapterDetailView({
  subjectSlug,
  chapterSlug,
}: ChapterDetailViewProps) {
  const chapterData = await getChapterWithTopics(subjectSlug, chapterSlug);

  if (!chapterData) {
    notFound();
  }

  // Filter only published topics and order by displayOrder
  const publishedTopics = chapterData.topics
    .filter((topic) => topic.isPublished)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans flex flex-col justify-between selection:bg-[#C0222E] selection:text-white">
      {/* Header Navigation */}
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
              href={`/${subjectSlug}`}
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer capitalize"
            >
              <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
              <span>Back to {chapterData.subjectName}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Chapter Overview Hero */}
      <section className="bg-white border-b border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-4">
            <Link href="/" className="hover:text-black transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href={`/${subjectSlug}`}
              className="hover:text-black transition-colors capitalize"
            >
              {chapterData.subjectName}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-black font-semibold">{chapterData.name}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 uppercase"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CBSE CLASS 12 • {chapterData.subjectName}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Chapter {chapterData.displayOrder}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FAFAFA] text-[#555555] border border-[#E5E5E5] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>{publishedTopics.length} Topics</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                {chapterData.name}
              </h1>

              <p className="text-base sm:text-lg text-[#555555] max-w-2xl leading-relaxed">
                {chapterData.description ||
                  "Learn chapter concepts step by step with interactive lessons, formula solvers, and practice questions."}
              </p>
            </div>

            {/* Quick Stats Card */}
            <div className="flex-shrink-0">
              <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] shadow-xs flex flex-col gap-3 min-w-[240px]">
                <div className="flex items-center justify-between text-xs font-mono font-bold text-[#555555] uppercase tracking-wider">
                  <span>Curriculum</span>
                  <span className="text-[#C0222E]">CBSE 2026</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Sequential Topic Path</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Interactive Exercises</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Topic List Section */}
      <section className="py-12 sm:py-16 flex-1 bg-[#FAFAFA]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-black tracking-tight mb-2">
              Chapter Topics
            </h2>
            <p className="text-sm text-[#555555]">
              Select a topic below to explore concepts, visual representations, and fundamental definitions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {publishedTopics.map((topic) => {
              const formattedNumber = String(topic.displayOrder).padStart(2, "0");

              return (
                <Link
                  key={topic.id}
                  href={`/${subjectSlug}/${chapterSlug}/${topic.slug}`}
                  className="group relative p-5 sm:p-6 rounded-2xl bg-white border border-[#E5E5E5] hover:border-[#C0222E] hover:shadow-lg transition-all duration-200 flex items-start gap-4 cursor-pointer select-none"
                >
                  {/* Topic Number */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-mono text-lg font-black flex-shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{
                      background: "var(--brand-tint)",
                      color: "var(--brand)",
                      border: "1px solid var(--brand-border)",
                    }}
                  >
                    {formattedNumber}
                  </div>

                  {/* Topic Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="text-base font-bold text-black group-hover:text-[#C0222E] transition-colors truncate">
                        {topic.name}
                      </h3>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#C0222E] group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                    <p className="text-xs text-[#555555] leading-relaxed line-clamp-2">
                      {topic.description || "Explore chapter topic concepts."}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          {publishedTopics.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <p className="text-[#555555] text-sm">
                No published topics found for this chapter yet.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Academy Footer */}
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
                Explore interactive concepts, visual learning, formulas, notes,
                and practice questions designed for CBSE Class 12 students.
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
                    <div className="flex items-center gap-1 text-xs font-bold text-black">
                      <MapPin className="w-3 h-3 text-[#C0222E]" />
                      <span>{b.city}</span>
                    </div>
                    <div className="text-[11px] text-[#555555] mt-0.5">
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

          <div className="mt-10 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
            <span>
              &copy; 2026 Learnova &bull; EDUiDEAL ACADEMY. All rights reserved.
            </span>
            <div className="flex items-center gap-4 font-mono">
              <Link
                href={`/${subjectSlug}`}
                className="hover:text-[#C0222E] transition-colors capitalize"
              >
                {chapterData.subjectName} Overview
              </Link>
              <span>&bull;</span>
              <Link href="/" className="hover:text-[#C0222E] transition-colors">
                Subject Directory
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
