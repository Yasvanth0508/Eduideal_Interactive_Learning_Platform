"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, HelpCircle, Eye, RefreshCw, BookOpen, Award } from "lucide-react";

interface Problem {
  id: string;
  category: string;
  title: string;
  statement: string;
  given: { label: string; value: string }[];
  formula: string;
  hint: string;
  steps: string[];
  expectedAnswer: number;
  unit: string;
  tolerance: number; // e.g. 0.05 for 5%
}

export function NumericalPracticeWorkbench() {
  const problems: Problem[] = [
    {
      id: "prob-1",
      category: "Boiling Point Elevation",
      title: "Molar Mass Calculation from ΔT_b",
      statement:
        "18 g of glucose (C₆H₁₂O₆) is dissolved in 1 kg of water in a saucepan. At what temperature will water boil at 1.013 bar? (K_b for water = 0.52 K kg mol⁻¹)",
      given: [
        { label: "Mass of solute (w₂)", value: "18 g" },
        { label: "Molar mass of glucose (M₂)", value: "180 g/mol" },
        { label: "Mass of solvent (w₁)", value: "1.0 kg" },
        { label: "K_b of water", value: "0.52 K kg mol⁻¹" },
        { label: "Pure water boiling pt (T_b°)", value: "373.15 K (100 °C)" },
      ],
      formula: "ΔT_b = K_b · m = K_b · (w₂ / M₂) / w₁(kg);  T_b = T_b° + ΔT_b",
      hint: "First find moles of glucose: 18 / 180 = 0.10 mol. Since solvent is 1 kg, molality m = 0.10 mol/kg.",
      steps: [
        "Step 1: Calculate molality (m) = (18 g / 180 g mol⁻¹) / 1 kg = 0.10 mol kg⁻¹",
        "Step 2: Calculate boiling point elevation: ΔT_b = 0.52 K kg mol⁻¹ × 0.10 mol kg⁻¹ = 0.052 K",
        "Step 3: Calculate solution boiling point: T_b = 373.15 K + 0.052 K = 373.202 K (or 100.052 °C)",
      ],
      expectedAnswer: 373.2,
      unit: "K",
      tolerance: 0.002,
    },
    {
      id: "prob-2",
      category: "Freezing Point Depression & Van 't Hoff",
      title: "Degree of Dissociation of CaCl₂",
      statement:
        "A 0.05 m aqueous solution of CaCl₂ freezes at -0.260 °C. Calculate the Van 't Hoff factor (i) and the degree of dissociation (α) of CaCl₂. (K_f for water = 1.86 K kg mol⁻¹)",
      given: [
        { label: "Molality (m)", value: "0.05 mol kg⁻¹" },
        { label: "Observed ΔT_f", value: "0.260 K" },
        { label: "K_f for water", value: "1.86 K kg mol⁻¹" },
        { label: "Number of ions (n)", value: "CaCl₂ → Ca²⁺ + 2Cl⁻ (n = 3)" },
      ],
      formula: "ΔT_f(calc) = K_f · m;  i = ΔT_f(obs) / ΔT_f(calc);  α = (i - 1) / (n - 1)",
      hint: "First calculate theoretical ΔT_f for a non-electrolyte. Then find i = 0.260 / ΔT_f(calc). Finally, find α in %.",
      steps: [
        "Step 1: Theoretical ΔT_f = 1.86 × 0.05 = 0.093 K",
        "Step 2: Van 't Hoff factor i = ΔT_f(obs) / ΔT_f(calc) = 0.260 / 0.093 = 2.796 ≈ 2.80",
        "Step 3: Degree of dissociation α = (i - 1) / (3 - 1) = (2.796 - 1) / 2 = 1.796 / 2 = 0.898 (89.8% or ~90%)",
      ],
      expectedAnswer: 2.8,
      unit: "value of i",
      tolerance: 0.05,
    },
    {
      id: "prob-3",
      category: "Osmotic Pressure",
      title: "Molar Mass of a Protein",
      statement:
        "200 cm³ of an aqueous solution of a protein contains 1.26 g of the protein. The osmotic pressure of such a solution at 300 K is found to be 2.57 × 10⁻³ bar. Calculate the molar mass of the protein. (R = 0.083 L bar mol⁻¹ K⁻¹)",
      given: [
        { label: "Volume (V)", value: "200 cm³ = 0.200 L" },
        { label: "Solute mass (w₂)", value: "1.26 g" },
        { label: "Osmotic pressure (Π)", value: "2.57 × 10⁻³ bar" },
        { label: "Temperature (T)", value: "300 K" },
        { label: "Gas constant (R)", value: "0.083 L bar K⁻¹ mol⁻¹" },
      ],
      formula: "Π = (w₂ · R · T) / (M₂ · V)  ⟹  M₂ = (w₂ · R · T) / (Π · V)",
      hint: "Remember to keep volume in liters (0.2 L). Substitute all terms into the rearranged formula.",
      steps: [
        "Step 1: Convert units: V = 0.200 L, T = 300 K, Π = 0.00257 bar",
        "Step 2: Formulate M₂ = (1.26 g × 0.083 L bar K⁻¹ mol⁻¹ × 300 K) / (2.57 × 10⁻³ bar × 0.200 L)",
        "Step 3: Numerator = 31.374; Denominator = 5.14 × 10⁻⁴; M₂ = 31.374 / 0.000514 ≈ 61,038 g/mol",
      ],
      expectedAnswer: 61038,
      unit: "g/mol",
      tolerance: 0.03,
    },
  ];

  const [activeProblemIndex, setActiveProblemIndex] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [showHint, setShowHint] = useState<boolean>(false);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [verificationResult, setVerificationResult] = useState<"CORRECT" | "INCORRECT" | null>(null);

  const current = problems[activeProblemIndex];

  const handleVerify = () => {
    const val = parseFloat(userAnswer.trim());
    if (isNaN(val)) {
      setVerificationResult("INCORRECT");
      return;
    }

    const diff = Math.abs(val - current.expectedAnswer);
    const maxDiff = current.expectedAnswer * current.tolerance;

    if (diff <= maxDiff) {
      setVerificationResult("CORRECT");
    } else {
      setVerificationResult("INCORRECT");
    }
  };

  const handleSelectProblem = (idx: number) => {
    setActiveProblemIndex(idx);
    setUserAnswer("");
    setShowHint(false);
    setShowSolution(false);
    setVerificationResult(null);
  };

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      <div className="pb-5 border-b border-[#E5E5E5] mb-6">
        <span
          className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 mb-1.5"
          style={{
            background: "var(--brand-tint)",
            color: "var(--brand)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <Award className="w-3.5 h-3.5" />
          <span>NCERT BOARD NUMERICAL WORKBENCH</span>
        </span>
        <h4 className="text-xl font-bold text-black tracking-tight">
          Step-by-Step Chemistry Numerical Practice
        </h4>
        <p className="text-xs text-[#555555]">
          Master standard NCERT numerical problems with real-time validation, hints, and complete step-by-step solutions.
        </p>
      </div>

      {/* Problem Selection Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {problems.map((prob, idx) => (
          <button
            key={prob.id}
            onClick={() => handleSelectProblem(idx)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeProblemIndex === idx
                ? "bg-[#C0222E] text-white shadow-xs"
                : "bg-[#F8F9FA] text-[#555555] hover:bg-neutral-100 border border-[#E5E5E5]"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
              {idx + 1}
            </span>
            <span>{prob.category}</span>
          </button>
        ))}
      </div>

      {/* Problem Statement Card */}
      <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E5E5E5] mb-6">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-mono text-[#C0222E] font-bold uppercase tracking-wider">
            {current.category}
          </span>
          <span className="text-[11px] font-mono text-[#888888]">Problem {activeProblemIndex + 1} of {problems.length}</span>
        </div>
        <h5 className="text-base font-bold text-black mb-3">{current.title}</h5>
        <p className="text-xs sm:text-sm text-[#333333] leading-relaxed mb-5 bg-white p-4 rounded-xl border border-[#E5E5E5]">
          {current.statement}
        </p>

        {/* Given Parameters Table */}
        <div className="mb-4">
          <span className="text-xs font-bold text-[#888888] uppercase block mb-2">Given Parameters:</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {current.given.map((g, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-white border border-[#E5E5E5] text-xs">
                <span className="text-[#888888] block text-[10px]">{g.label}</span>
                <span className="font-mono font-bold text-black">{g.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Core Formula */}
        <div className="p-3 rounded-xl bg-white border border-[#E5E5E5] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-[#888888] font-bold">Governing Formula:</span>
          <code className="font-mono font-bold text-black bg-neutral-100 px-2 py-1 rounded">
            {current.formula}
          </code>
        </div>
      </div>

      {/* Interactive Answer Input Form */}
      <div className="p-6 rounded-2xl bg-[#1A1D20] text-white border border-neutral-800 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="text-xs font-mono text-neutral-400 block mb-1.5 uppercase tracking-wider">
              Enter Your Calculated Value ({current.unit}):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                value={userAnswer}
                onChange={(e) => {
                  setUserAnswer(e.target.value);
                  setVerificationResult(null);
                }}
                placeholder={`e.g. ${current.expectedAnswer}`}
                className="w-full max-w-xs px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#C0222E]"
              />
              <button
                onClick={handleVerify}
                className="px-5 py-2.5 rounded-xl bg-[#C0222E] hover:bg-[#a01c26] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                Check Answer
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? "Hide Hint" : "Need Hint?"}</span>
            </button>
            <button
              onClick={() => setShowSolution(!showSolution)}
              className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>{showSolution ? "Hide Solution" : "Show Full Solution"}</span>
            </button>
          </div>
        </div>

        {/* Verification Feedback */}
        {verificationResult && (
          <div
            className={`mt-4 p-3 rounded-xl text-xs flex items-center gap-2 font-medium ${
              verificationResult === "CORRECT"
                ? "bg-emerald-950/80 border border-emerald-700 text-emerald-300"
                : "bg-rose-950/80 border border-rose-700 text-rose-300"
            }`}
          >
            {verificationResult === "CORRECT" ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Excellent! Your answer is correct within rounding tolerance ({current.expectedAnswer} {current.unit}).</span>
              </>
            ) : (
              <>
                <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>Not quite. Check your units and arithmetic, or take a look at the hint below.</span>
              </>
            )}
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className="mt-4 p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200">
            <strong className="block text-amber-400 mb-1">💡 Hint:</strong>
            {current.hint}
          </div>
        )}

        {/* Step-by-Step Solution Breakdown */}
        {showSolution && (
          <div className="mt-4 p-4 rounded-xl bg-neutral-900 border border-neutral-700 space-y-2 text-xs">
            <span className="text-emerald-400 font-mono font-bold uppercase tracking-wider block mb-2">
              Detailed NCERT Step-by-Step Solution:
            </span>
            {current.steps.map((step, idx) => (
              <div key={idx} className="font-mono text-neutral-200 bg-neutral-950 p-2 rounded border border-neutral-800">
                {step}
              </div>
            ))}
            <div className="pt-2 text-[11px] text-neutral-400">
              Final Answer = <strong className="text-white font-mono">{current.expectedAnswer} {current.unit}</strong>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
