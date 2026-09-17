import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
  MapPin,
} from "lucide-react";
import { getChapterWithTopics, getTopicBySlug } from "@/features/subjects/queries";
import { getTopicContentBlocks } from "@/features/content/queries";
import { ContentBlockRenderer } from "@/features/content/components/content-block-renderer";

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
}

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { topicSlug } = await params;
  const topic = await getTopicBySlug("chemistry", "solutions", topicSlug);

  if (!topic) {
    return {
      title: "Topic Not Found | Learnova",
    };
  }

  return {
    title: `${topic.name} — Solutions | CBSE Class 12 Chemistry | Learnova`,
    description: topic.description || undefined,
  };
}

export default async function TopicDetailPage({ params }: TopicPageProps) {
  const { topicSlug } = await params;
  const topic = await getTopicBySlug("chemistry", "solutions", topicSlug);

  if (!topic || !topic.isPublished) {
    notFound();
  }

  const formattedNumber = String(topic.displayOrder).padStart(2, "0");

  // Fetch all topics to calculate previous and next pagination
  const chapterData = await getChapterWithTopics("chemistry", "solutions");
  const sortedTopics = chapterData?.topics
    ? [...chapterData.topics]
        .filter((t) => t.isPublished)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const currentIndex = sortedTopics.findIndex((t) => t.slug === topicSlug);
  const prevTopic = currentIndex > 0 ? sortedTopics[currentIndex - 1] : null;
  const nextTopic =
    currentIndex >= 0 && currentIndex < sortedTopics.length - 1
      ? sortedTopics[currentIndex + 1]
      : null;

  // Fetch content blocks for this topic
  const contentBlocks = await getTopicContentBlocks(topic.id);
  const isLessonActive = contentBlocks.length > 0;

  return (
    <div className="min-h-screen bg-white text-black antialiased font-sans flex flex-col justify-between selection:bg-[#C0222E] selection:text-white">
      {/* Header */}
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
              href="/chemistry/solutions"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Topics</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Topic Title Header Section */}
        <section className="bg-white border-b border-[#E5E5E5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-5 flex-wrap">
              <Link href="/" className="hover:text-black transition-colors">
                Dashboard
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link href="/chemistry" className="hover:text-black transition-colors">
                Chemistry
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <Link
                href="/chemistry/solutions"
                className="hover:text-black transition-colors"
              >
                Solutions
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-black font-semibold truncate">
                {topic.name}
              </span>
            </nav>

            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-mono font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>TOPIC {formattedNumber}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#555555] border border-[#E5E5E5] flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5" />
                  <span>CBSE Class 12</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>12 Min Interactive Lesson</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-black tracking-tight">
                {topic.name}
              </h1>

              <p className="text-base sm:text-lg text-[#555555] leading-relaxed max-w-2xl">
                {topic.description || "Master foundational concepts in this topic."}
              </p>
            </div>
          </div>
        </section>

        {/* Content Body: Active Interactive Lesson vs Coming Soon Placeholder */}
        {isLessonActive ? (
          <section className="py-10 sm:py-14 bg-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
              {/* Sequential Content Blocks */}
              {contentBlocks.map((block) => (
                <ContentBlockRenderer key={block.id} block={block} />
              ))}

              {/* Bottom Topic Navigation Footer */}
              <div className="pt-10 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4">
                {prevTopic ? (
                  <Link
                    href={`/chemistry/solutions/${prevTopic.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous: {prevTopic.name}</span>
                  </Link>
                ) : (
                  <Link
                    href="/chemistry/solutions"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-2xs"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Solutions Overview</span>
                  </Link>
                )}

                {nextTopic ? (
                  <Link
                    href={`/chemistry/solutions/${nextTopic.slug}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all active:scale-95 shadow-sm hover:opacity-95"
                    style={{ background: "var(--brand)" }}
                  >
                    <span>Next: {nextTopic.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href="/chemistry/solutions"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs sm:text-sm font-bold text-white transition-all active:scale-95 shadow-sm hover:opacity-95"
                    style={{ background: "var(--brand)" }}
                  >
                    <span>Complete Chapter Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Placeholder Notice Card for topics whose content is pending */
          <section className="py-16 sm:py-24 bg-[#FAFAFA]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E5E5] shadow-sm text-center max-w-2xl mx-auto flex flex-col items-center gap-6">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{
                    background: "var(--brand-tint)",
                    color: "var(--brand)",
                    border: "1px solid var(--brand-border)",
                  }}
                >
                  <Sparkles className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold font-mono px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    <span>CONTENT PHASE PREPARATION</span>
                  </span>

                  <h2 className="text-2xl font-bold text-black tracking-tight">
                    Educational Content Coming Soon
                  </h2>

                  <p className="text-sm text-[#555555] leading-relaxed max-w-md mx-auto">
                    The chapter structure and topic routing are active. Detailed
                    theory, dynamic formula calculations, live scientific graphs,
                    and NCERT practice problems will be configured in the next phase.
                  </p>
                </div>

                <div className="pt-2">
                  <Link
                    href="/chemistry/solutions"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                    style={{ background: "var(--brand)" }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Chapter Topics</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Academy Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/assets/eduideal-logo-BUtjWTvV.png"
                  alt="EDUiDEAL Academy"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <p className="text-xs text-[#555555] leading-relaxed max-w-sm">
                Interactive learning platform for CBSE Class 12. Designed for
                concept clarity, visual understanding, and board examination excellence.
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

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#555555]">
            <span>
              &copy; 2026 Learnova &bull; EDUiDEAL ACADEMY. All rights reserved.
            </span>
            <div className="flex items-center gap-4 font-mono">
              <Link href="/chemistry/solutions" className="hover:text-[#C0222E] transition-colors">
                Solutions Chapter
              </Link>
              <span>&bull;</span>
              <Link href="/chemistry" className="hover:text-[#C0222E] transition-colors">
                Chemistry
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
