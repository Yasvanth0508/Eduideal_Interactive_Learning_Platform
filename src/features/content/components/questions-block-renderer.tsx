"use client";

import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Eye,
  Award,
} from "lucide-react";
import { ContentBlockWithDetails } from "../types";

interface QuestionsBlockRendererProps {
  block: ContentBlockWithDetails;
}

export function QuestionsBlockRenderer({ block }: QuestionsBlockRendererProps) {
  const questionsList = block.questions || [];

  // State: selected options for MCQs { [questionId]: optionId }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  // State: revealed explanations { [questionId]: boolean }
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [questionId]: optionId,
    }));
    // Automatically reveal explanation once an answer is chosen
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const toggleReveal = (questionId: string) => {
    setRevealedAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleReset = () => {
    setSelectedOptions({});
    setRevealedAnswers({});
  };

  // Compute MCQ score
  const mcqs = questionsList.filter((q) => q.questionType === "MCQ");
  let correctCount = 0;

  mcqs.forEach((q) => {
    const selectedOptId = selectedOptions[q.id];
    if (selectedOptId && q.options) {
      const chosenOpt = q.options.find((o) => o.id === selectedOptId);
      if (chosenOpt?.isCorrect) {
        correctCount++;
      }
    }
  });

  return (
    <section className="space-y-8 my-8 pt-6 border-t border-[#E5E5E5]">
      {/* Questions Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span
              className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                background: "var(--brand-tint)",
                color: "var(--brand)",
                border: "1px solid var(--brand-border)",
              }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SELF-ASSESSMENT PRACTICE</span>
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {questionsList.length} Questions
            </span>
          </div>

          <h3 className="text-2xl font-black text-black tracking-tight">
            {block.title || "Quick Practice"}
          </h3>
          <p className="text-xs sm:text-sm text-[#555555]">
            {block.description || "Test your understanding with CBSE-aligned questions."}
          </p>
        </div>

        {/* Score Pill & Reset */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {mcqs.length > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-[#E5E5E5] text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#C0222E]" />
              <span>
                MCQ Score: {correctCount}/{mcqs.length}
              </span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-black bg-white hover:bg-slate-50 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95 shadow-2xs"
            title="Reset answers"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Questions Stack */}
      <div className="space-y-6">
        {questionsList.map((question, index) => {
          const isMCQ = question.questionType === "MCQ";
          const selectedOptionId = selectedOptions[question.id];
          const isAnswered = !!selectedOptionId;
          const isRevealed = !!revealedAnswers[question.id];

          return (
            <div
              key={question.id}
              className="p-5 sm:p-6 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] shadow-xs space-y-4 transition-all"
            >
              {/* Question Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center font-mono text-xs font-bold text-slate-700 flex-shrink-0">
                    {index + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      question.difficulty === "EASY"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : question.difficulty === "HARD"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {question.difficulty} • {question.marks} {question.marks === 1 ? "Mark" : "Marks"}
                  </span>
                </div>

                {!isMCQ && (
                  <button
                    onClick={() => toggleReveal(question.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                    style={{
                      background: isRevealed ? "var(--brand-tint)" : "#ffffff",
                      color: isRevealed ? "var(--brand)" : "#000000",
                      border: isRevealed
                        ? "1px solid var(--brand-border)"
                        : "1px solid #E5E5E5",
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRevealed ? "Hide Answer" : "Reveal Answer"}</span>
                  </button>
                )}
              </div>

              {/* Question Text */}
              <p className="text-sm sm:text-base font-bold text-black leading-relaxed">
                {question.questionText}
              </p>

              {/* MCQ Options Rendering */}
              {isMCQ && question.options && (
                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {question.options.map((opt) => {
                    const isChosen = selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;

                    let btnStyle = "bg-white border-[#E5E5E5] hover:border-slate-300 text-slate-800";

                    if (isAnswered) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-50 border-emerald-400 text-emerald-950 font-semibold ring-1 ring-emerald-400/40";
                      } else if (isChosen) {
                        btnStyle = "bg-rose-50 border-rose-400 text-rose-950 ring-1 ring-rose-400/40";
                      } else {
                        btnStyle = "bg-white border-[#E5E5E5] opacity-60 text-slate-500";
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        onClick={() => handleSelectOption(question.id, opt.id)}
                        className={`p-3.5 rounded-xl border text-left text-xs sm:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 bg-slate-50">
                          {String.fromCharCode(64 + opt.displayOrder)}
                        </span>
                        <span className="flex-1 leading-relaxed">
                          {opt.optionText}
                        </span>
                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        )}
                        {isAnswered && isChosen && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Short Answer / Identification Hint Box */}
              {!isMCQ && question.hint && !isRevealed && (
                <div className="text-xs text-[#555555] bg-white p-3 rounded-xl border border-dashed border-[#E5E5E5] italic">
                  💡 Hint: {question.hint}
                </div>
              )}

              {/* Short Answer Revealed Answer */}
              {!isMCQ && isRevealed && question.expectedAnswer && (
                <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1">
                  <div className="font-mono font-bold text-emerald-800 uppercase tracking-wider text-[10px]">
                    Model CBSE Answer
                  </div>
                  <div className="font-semibold text-sm">
                    {question.expectedAnswer}
                  </div>
                </div>
              )}

              {/* Explanation Box (Visible if revealed or answered) */}
              {isRevealed && (
                <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] text-xs sm:text-sm text-slate-700 leading-relaxed space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-black mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#C0222E]" />
                    <span>Detailed CBSE Solution & Explanation</span>
                  </div>
                  <div className="whitespace-pre-line text-slate-600">
                    {question.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
