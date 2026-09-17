"use client";

import React from "react";
import {
  BookOpen,
  Info,
  AlertTriangle,
  Lightbulb,
  Bookmark,
} from "lucide-react";
import { ContentBlockWithDetails, TheoryBlockContent } from "../types";
import { ParticleSolutionSimulator } from "./interactive/particle-solution-simulator";
import { SoluteSolventExplorer } from "./interactive/solute-solvent-explorer";
import { TypesOfSolutionsMatrix } from "./interactive/types-of-solutions-matrix";
import { SolutionColloidSuspensionComparison } from "./interactive/solution-colloid-suspension-comparison";

interface TheoryBlockRendererProps {
  block: ContentBlockWithDetails;
}

export function TheoryBlockRenderer({ block }: TheoryBlockRendererProps) {
  const content = block.content as TheoryBlockContent | null;

  if (!content) {
    return null;
  }

  return (
    <article className="space-y-8">
      {/* Block Title & Meta Header */}
      <div className="border-b border-[#E5E5E5] pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>THEORY SECTION</span>
          </span>
          <span className="text-xs font-semibold text-[#555555]">
            Block {block.displayOrder}
          </span>
        </div>

        {block.title && (
          <h2 className="text-2xl sm:text-3xl font-black text-black tracking-tight mb-2">
            {block.title}
          </h2>
        )}

        {block.description && (
          <p className="text-sm text-[#555555] leading-relaxed max-w-3xl">
            {block.description}
          </p>
        )}
      </div>

      {/* Block Introduction */}
      {content.introduction && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-sm text-slate-800 leading-relaxed font-medium">
          {content.introduction}
        </div>
      )}

      {/* Sections Loop */}
      <div className="space-y-8">
        {content.sections.map((section) => (
          <div key={section.id} className="space-y-4">
            {/* Section Badge & Heading */}
            {section.heading && (
              <div className="space-y-1">
                {section.badge && (
                  <span className="text-[11px] font-mono font-bold text-[#C0222E] uppercase tracking-wider block">
                    {section.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-black tracking-tight">
                  {section.heading}
                </h3>
              </div>
            )}

            {/* Paragraphs */}
            {section.paragraphs && section.paragraphs.length > 0 && (
              <div className="space-y-3">
                {section.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-sm sm:text-base text-slate-700 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            )}

            {/* Bullet Points */}
            {section.bulletPoints && section.bulletPoints.length > 0 && (
              <ul className="space-y-2.5 my-3 pl-1">
                {section.bulletPoints.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-sm sm:text-base text-slate-700 flex items-start gap-3 leading-relaxed"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#C0222E] flex-shrink-0 mt-2.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Key Terms */}
            {section.keyTerms && section.keyTerms.length > 0 && (
              <div className="my-5 p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                  <Bookmark className="w-3.5 h-3.5 text-[#C0222E]" />
                  <span>Key Terms & Definitions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {section.keyTerms.map((kt, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs"
                    >
                      <span className="text-xs font-bold text-[#C0222E] block mb-1">
                        {kt.term}
                      </span>
                      <p className="text-xs text-[#555555] leading-relaxed">
                        {kt.definition}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Callouts */}
            {section.callout && (
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed flex items-start gap-3 my-4 border ${
                  section.callout.type === "ncert"
                    ? "bg-rose-50/70 border-rose-200 text-rose-950"
                    : section.callout.type === "warning"
                    ? "bg-amber-50/70 border-amber-200 text-amber-950"
                    : section.callout.type === "tip"
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-950"
                    : "bg-sky-50/70 border-sky-200 text-sky-950"
                }`}
              >
                {section.callout.type === "warning" ? (
                  <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                ) : section.callout.type === "tip" ? (
                  <Lightbulb className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-5 h-5 text-[#C0222E] flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <strong className="font-bold block mb-0.5">
                    {section.callout.title}
                  </strong>
                  <span>{section.callout.text}</span>
                </div>
              </div>
            )}

            {/* Interactive Widget Dispatcher */}
            {section.interactiveWidget === "PARTICLE_SIMULATOR" && (
              <ParticleSolutionSimulator />
            )}
            {section.interactiveWidget === "SOLUTE_SOLVENT_EXPLORER" && (
              <SoluteSolventExplorer />
            )}
            {section.interactiveWidget === "TYPES_OF_SOLUTIONS_MATRIX" && (
              <TypesOfSolutionsMatrix />
            )}
            {section.interactiveWidget ===
              "SOLUTION_COLLOID_SUSPENSION_COMPARISON" && (
              <SolutionColloidSuspensionComparison />
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
