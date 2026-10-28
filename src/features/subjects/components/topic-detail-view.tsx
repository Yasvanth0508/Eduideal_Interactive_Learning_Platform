import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  BookOpen,
  Clock,
  Layers,
  MapPin,
} from "lucide-react";
import { getChapterWithTopics, getTopicBySlug } from "../queries";
import { getTopicContentBlocks } from "@/server/services/content-service";
import { ContentBlockRenderer } from "@/components/lesson/content-block-renderer";
import { TopicSidebar } from "@/components/navigation/topic-sidebar";
import { EmptyLessonState } from "@/components/lesson/empty-lesson-state";
import {
  LessonTitle,
  BodyParagraph,
  ReadingColumn,
  MetadataText,
} from "@/components/ui/typography";

interface TopicDetailViewProps {
  subjectSlug: string;
  chapterSlug: string;
  topicSlug: string;
}

const BRANCHES = [
  { city: "Perambur", address: "MPM Street", phone: "9884234949" },
  { city: "Kodungaiyur", address: "Near Pandiyan Theatre", phone: "9790924949" },
  { city: "Agaram Jn.", address: "Agaram Jn.", phone: "7845977500" },
];

export async function TopicDetailView({
  subjectSlug,
  chapterSlug,
  topicSlug,
}: TopicDetailViewProps) {
  const topic = await getTopicBySlug(subjectSlug, chapterSlug, topicSlug);

  if (!topic || !topic.isPublished) {
    notFound();
  }

  const chapterData = await getChapterWithTopics(subjectSlug, chapterSlug);
  const sortedTopics = chapterData?.topics
    ? [...chapterData.topics]
        .filter((t) => t.isPublished)
        .sort((a, b) => a.displayOrder - b.displayOrder)
    : [];

  const formattedNumber = String(topic.displayOrder).padStart(2, "0");

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
      {/* Top Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E5E5E5] shadow-xs">
        <div className="w-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
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
              href={`/${subjectSlug}/${chapterSlug}`}
              className="type-button flex items-center gap-2 px-3.5 py-2 rounded-xl text-black hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
              <span>Back to {topic.chapterName || "Chapter"}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar + Content */}
      <div className="flex-1 w-full flex flex-col lg:flex-row">
        {/* Sidebar */}
        <TopicSidebar
          subjectSlug={subjectSlug}
          chapterSlug={chapterSlug}
          currentTopicSlug={topicSlug}
          chapterName={topic.chapterName}
          subjectName={topic.subjectName}
          topics={sortedTopics}
        />

        {/* Topic Content Column */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Topic Banner / Header */}
          <section className="bg-white border-b border-[#E5E5E5] px-4 sm:px-8 py-8 sm:py-10">
            <ReadingColumn className="space-y-4">
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-2 type-metadata font-medium text-[#555555] flex-wrap">
                <Link href="/" className="hover:text-black transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link
                  href={`/${subjectSlug}`}
                  className="hover:text-black transition-colors capitalize"
                >
                  {topic.subjectName}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link
                  href={`/${subjectSlug}/${chapterSlug}`}
                  className="hover:text-black transition-colors"
                >
                  {topic.chapterName}
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-black font-bold truncate">
                  {topic.name}
                </span>
              </nav>

              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className="type-metadata font-bold px-3 py-1 rounded-full flex items-center gap-1.5"
                    style={{
                      background: "var(--brand-tint)",
                      color: "var(--brand)",
                      border: "1px solid var(--brand-border)",
                    }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>TOPIC {formattedNumber}</span>
                  </span>
                  <MetadataText className="font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-[#555555] border border-[#E5E5E5] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>CBSE Class 12</span>
                  </MetadataText>
                  <MetadataText className="font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>12 Min Interactive Lesson</span>
                  </MetadataText>
                </div>

                {/* Lesson Title: 38px desktop / 30px mobile, 700 */}
                <LessonTitle>
                  {topic.name}
                </LessonTitle>

                {/* Body paragraph: 17px desktop / 16px mobile, 1.7 line height */}
                <BodyParagraph className="text-[#555555]">
                  {topic.description ||
                    "Master foundational concepts, visual explanations, and numerical problems in this topic."}
                </BodyParagraph>
              </div>
            </ReadingColumn>
          </section>

          {/* Lesson Content Area */}
          <div className="flex-1 bg-white">
            {isLessonActive ? (
              <section className="py-8 sm:py-12 px-4 sm:px-8">
                <ReadingColumn className="space-y-12">
                  {/* Sequential Content Blocks */}
                  {contentBlocks.map((block) => (
                    <ContentBlockRenderer key={block.id} block={block} />
                  ))}

                  {/* Bottom Navigation Pagination */}
                  <div className="pt-10 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-4">
                    {prevTopic ? (
                      <Link
                        href={`/${subjectSlug}/${chapterSlug}/${prevTopic.slug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl type-button text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-2xs"
                      >
                        <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
                        <span>Previous: {prevTopic.name}</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/${subjectSlug}/${chapterSlug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl type-button text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-2xs"
                      >
                        <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
                        <span>Back to {topic.chapterName} Overview</span>
                      </Link>
                    )}

                    {nextTopic ? (
                      <Link
                        href={`/${subjectSlug}/${chapterSlug}/${nextTopic.slug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl type-button text-white transition-all active:scale-95 shadow-sm hover:opacity-95"
                        style={{ background: "var(--brand)" }}
                      >
                        <span>Next: {nextTopic.name}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : (
                      <Link
                        href={`/${subjectSlug}/${chapterSlug}`}
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl type-button text-white transition-all active:scale-95 shadow-sm hover:opacity-95"
                        style={{ background: "var(--brand)" }}
                      >
                        <span>Complete Chapter Review</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </ReadingColumn>
              </section>
            ) : (
              <EmptyLessonState
                type="topic"
                subjectName={topic.subjectName}
                chapterName={topic.chapterName}
                topicName={topic.name}
                backHref={`/${subjectSlug}/${chapterSlug}`}
                backLabel={`Return to ${topic.chapterName} Topics`}
              />
            )}
          </div>
        </main>
      </div>

      {/* Academy Footer */}
      <footer className="border-t border-[#E5E5E5] bg-white z-10">
        <div className="w-full px-4 sm:px-6 py-10">
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
              <p className="type-metadata text-[#555555] leading-relaxed max-w-sm">
                Interactive learning platform for CBSE Class 12. Designed for
                concept clarity, visual understanding, and board examination excellence.
              </p>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-bold type-metadata text-black uppercase tracking-wider mb-3">
                EDUiDEAL Academy Branches
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {BRANCHES.map((b) => (
                  <div
                    key={b.city}
                    className="p-3 rounded-xl bg-[#FAFAFA] border border-[#E5E5E5]"
                  >
                    <div className="flex items-center gap-1 type-metadata font-bold text-black">
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

          <div className="mt-8 pt-6 border-t border-[#E5E5E5] flex flex-col sm:flex-row items-center justify-between gap-3 type-metadata text-[#555555]">
            <span>
              &copy; 2026 Learnova &bull; EDUiDEAL ACADEMY. All rights reserved.
            </span>
            <div className="flex items-center gap-4">
              <Link
                href={`/${subjectSlug}/${chapterSlug}`}
                className="hover:text-[#C0222E] transition-colors"
              >
                {topic.chapterName} Chapter
              </Link>
              <span>&bull;</span>
              <Link
                href={`/${subjectSlug}`}
                className="hover:text-[#C0222E] transition-colors capitalize"
              >
                {topic.subjectName}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
