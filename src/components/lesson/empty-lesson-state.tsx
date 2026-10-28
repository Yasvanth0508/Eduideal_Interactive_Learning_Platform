import React from "react";
import Link from "next/link";
import { Clock, Sparkles, BookOpen, ArrowLeft, Layers, Compass } from "lucide-react";

interface EmptyLessonStateProps {
  title?: string;
  description?: string;
  subjectName?: string;
  chapterName?: string;
  topicName?: string;
  backHref?: string;
  backLabel?: string;
  type?: "topic" | "chapter" | "subject";
}

export function EmptyLessonState({
  title,
  description,
  subjectName,
  chapterName,
  topicName,
  backHref = "/",
  backLabel,
  type = "topic",
}: EmptyLessonStateProps) {
  const defaultTitle =
    type === "chapter"
      ? "Chapter Topics In Preparation"
      : type === "subject"
      ? "Subject Curriculum In Preparation"
      : "Educational Content Coming Soon";

  const defaultDescription =
    type === "chapter"
      ? `The curriculum routing and syllabus structure for ${chapterName || "this chapter"} are verified and active. Topics and interactive modules are currently in the authoring phase.`
      : type === "subject"
      ? `The subject outline for ${subjectName || "this subject"} is active. Chapters and topics will be populated here.`
      : "The syllabus structure and navigation are active. Theory, interactive formula solvers, scientific graphs, and practice problems are being authored for this topic.";

  const defaultBackLabel =
    type === "chapter"
      ? `Back to ${subjectName || "Subject"}`
      : `Back to ${chapterName || "Chapter"} Overview`;

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 bg-[#FAFAFA] flex-1 flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E5E5E5] shadow-xs flex flex-col items-center gap-6">
          {/* Badge Icon */}
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-xs"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            {type === "chapter" ? (
              <Layers className="w-8 h-8" />
            ) : type === "subject" ? (
              <Compass className="w-8 h-8" />
            ) : (
              <Sparkles className="w-8 h-8" />
            )}
          </div>

          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>CONTENT PREPARATION PHASE</span>
            </span>

            <h2 className="type-h2 font-bold text-black tracking-tight">
              {title || defaultTitle}
            </h2>

            {/* Context breadcrumb chip if names exist */}
            {(subjectName || chapterName || topicName) && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 type-metadata text-[#555555] font-medium">
                {subjectName && <span className="capitalize">{subjectName}</span>}
                {chapterName && (
                  <>
                    <span>•</span>
                    <span>{chapterName}</span>
                  </>
                )}
                {topicName && (
                  <>
                    <span>•</span>
                    <span className="text-black font-semibold">{topicName}</span>
                  </>
                )}
              </div>
            )}

            <p className="type-caption text-[#555555] leading-relaxed max-w-lg mx-auto">
              {description || defaultDescription}
            </p>
          </div>

          {/* Action Navigation */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href={backHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl type-button text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#C0222E]" />
              <span>{backLabel || defaultBackLabel}</span>
            </Link>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl type-button text-white transition-all active:scale-95 shadow-xs hover:opacity-95"
              style={{ background: "var(--brand)" }}
            >
              <BookOpen className="w-4 h-4" />
              <span>View Curriculum</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
