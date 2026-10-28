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
import { ContentBlockWithDetails, QuestionsBlock, QuestionItem, QuestionsBlockData } from "@/types/content";
import {
  SubsectionTitle,
  CaptionText,
  MetadataText,
} from "@/components/ui/typography";
import { MathText } from "@/components/ui/math-formula";

interface QuestionsBlockRendererProps {
  block: QuestionsBlock | ContentBlockWithDetails;
}

export function QuestionsBlockRenderer({ block }: QuestionsBlockRendererProps) {
  const questionsList: QuestionItem[] =
    ("data" in block && (block.data as QuestionsBlockData)?.questions ? (block.data as QuestionsBlockData).questions : undefined) ||
    ("questions" in block && block.questions ? block.questions : undefined) ||
    [];

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
              className="type-metadata font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                background: "var(--brand-tint)",
                color: "var(--brand)",
                border: "1px solid var(--brand-border)",
              }}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>SELF-ASSESSMENT PRACTICE</span>
            </span>
            <MetadataText className="font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {questionsList.length} Questions
            </MetadataText>
          </div>

          <SubsectionTitle className="tracking-tight">
            {block.title || "Quick Practice"}
          </SubsectionTitle>
          <CaptionText className="text-[#555555]">
            {block.description || "Test your understanding with CBSE-aligned questions."}
          </CaptionText>
        </div>

        {/* Score Pill & Reset */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          {mcqs.length > 0 && (
            <div className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-[#E5E5E5] type-metadata font-mono font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <Award className="w-3.5 h-3.5 text-[#C0222E]" />
              <span>
                MCQ Score: {correctCount}/{mcqs.length}
              </span>
            </div>
          )}

          <button
            onClick={handleReset}
            className="type-button inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-black bg-white hover:bg-slate-50 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95 shadow-2xs"
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
                  <span className="w-6 h-6 rounded-lg bg-white border border-[#E5E5E5] flex items-center justify-center font-mono type-metadata font-bold text-slate-700 flex-shrink-0">
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
                    className="type-button inline-flex items-center gap-1.5 px-3 py-1 rounded-xl transition-all cursor-pointer active:scale-95"
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

              {/* Question Text (16-17px according to README standard) */}
              <div className="type-question text-black">
                <MathText text={question.questionText} />
              </div>

              {/* MCQ Options Rendering */}
              {isMCQ && question.options && (
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {question.options.map((opt, optIndex) => {
                    const isChosen = selectedOptionId === opt.id;
                    const isCorrect = opt.isCorrect;
                    const optionLetter = String.fromCharCode(65 + optIndex);

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
                        className={`p-3.5 rounded-xl border text-left type-body transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                      >
                        <span className="w-5 h-5 rounded-full border border-slate-300 flex items-center justify-center text-[10px] font-mono font-bold flex-shrink-0 mt-0.5 bg-slate-50">
                          {optionLetter}
                        </span>

                        <span className="flex-1">
                          <MathText text={opt.optionText} />
                        </span>

                        {isAnswered && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        )}

                        {isAnswered && isChosen && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Explanation / Answer Reveal */}
              {isRevealed && question.explanation && (
                <div className="p-4 rounded-xl bg-white border border-[#E5E5E5] space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 type-metadata font-bold text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Explanation & Key Concepts</span>
                  </div>
                  <div className="type-body text-slate-700">
                    <MathText text={question.explanation} />
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
