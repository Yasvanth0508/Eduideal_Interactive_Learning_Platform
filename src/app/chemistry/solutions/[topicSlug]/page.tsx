import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Sparkles,
  BookOpen,
  Clock,
  Layers,
} from "lucide-react";
import { getTopicBySlug } from "@/features/subjects/queries";

interface TopicPageProps {
  params: Promise<{
    topicSlug: string;
  }>;
}

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
        {/* Topic Title Section */}
        <section className="bg-white border-b border-[#E5E5E5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs font-medium text-[#555555] mb-6 flex-wrap">
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

            <div className="space-y-4">
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
                  <span>Class 12 CBSE</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight">
                {topic.name}
              </h1>

              <p className="text-base sm:text-lg text-[#555555] leading-relaxed">
                {topic.description || "Master core concepts in this topic."}
              </p>
            </div>
          </div>
        </section>

        {/* Placeholder Notice Card */}
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
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-[#E5E5E5] bg-white text-center text-xs text-[#555555] font-mono">
        Learnova &bull; EDUiDEAL Academy &copy; 2026
      </footer>
    </div>
  );
}
