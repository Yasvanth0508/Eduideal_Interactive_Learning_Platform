"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import { ContentBlockWithDetails } from "../types";

export interface FormulaVariableInput {
  symbol: string;
  label: string;
  unit: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export interface FormulaConfigPayload {
  formulaName: string;
  expression: string; // e.g. "ΔTb = Kb × m"
  description: string;
  resultLabel: string;
  resultUnit: string;
  resultSymbol: string;
  variables: FormulaVariableInput[];
  calculate: (values: Record<string, number>) => {
    result: number;
    steps: string[];
  };
}

interface FormulaBlockRendererProps {
  block?: ContentBlockWithDetails;
  config?: FormulaConfigPayload;
}

export function FormulaBlockRenderer({ block, config: propConfig }: FormulaBlockRendererProps) {
  // Config can be passed as a prop or retrieved from block.content
  const config = propConfig || (block?.content as unknown as FormulaConfigPayload);

  if (!config || !config.variables) {
    return null;
  }

  // Initialize input state with default values
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    config.variables.forEach((v) => {
      initial[v.symbol] = v.defaultValue;
    });
    return initial;
  });

  const handleInputChange = (symbol: string, value: string) => {
    const num = parseFloat(value);
    setInputs((prev) => ({
      ...prev,
      [symbol]: isNaN(num) ? 0 : num,
    }));
  };

  const handleReset = () => {
    const initial: Record<string, number> = {};
    config.variables.forEach((v) => {
      initial[v.symbol] = v.defaultValue;
    });
    setInputs(initial);
  };

  // Perform calculation
  let calculationResult: { result: number; steps: string[] } = { result: 0, steps: [] };
  try {
    if (typeof config.calculate === "function") {
      calculationResult = config.calculate(inputs);
    }
  } catch (err) {
    calculationResult = { result: 0, steps: ["Calculation error. Please check your inputs."] };
  }

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5] mb-6">
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
              <Calculator className="w-3.5 h-3.5" />
              <span>DYNAMIC FORMULA CALCULATOR</span>
            </span>
          </div>

          <h4 className="text-xl font-bold text-black tracking-tight">
            {config.formulaName}
          </h4>
          <p className="text-xs text-[#555555]">
            {config.description}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95"
          title="Reset to default values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Formula Display Banner */}
      <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Governing CBSE Equation
          </span>
          <div className="text-lg sm:text-xl font-mono font-black text-black tracking-wide">
            {config.expression}
          </div>
        </div>

        <div className="text-xs text-[#555555] max-w-xs">
          Modify input parameters below to see instantaneous real-time recalculation and step-by-step substitution.
        </div>
      </div>

      {/* Inputs & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Parameters Column */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-black uppercase tracking-wider block mb-2">
            Input Variables:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.variables.map((v) => (
              <div
                key={v.symbol}
                className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-col gap-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 truncate" title={v.label}>
                    {v.label}
                  </span>
                  <span className="font-mono font-bold text-[#C0222E]">
                    {v.symbol}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={inputs[v.symbol] !== undefined ? inputs[v.symbol] : ""}
                    min={v.min}
                    max={v.max}
                    step={v.step || "any"}
                    onChange={(e) => handleInputChange(v.symbol, e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold text-black focus:outline-none focus:border-[#C0222E]"
                  />
                  <span className="text-xs font-mono text-slate-500 min-w-[36px] text-right">
                    {v.unit}
                  </span>
                </div>

                {v.description && (
                  <span className="text-[10px] text-slate-500 leading-tight">
                    {v.description}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Calculated Result Column */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between gap-4 shadow-md">
          <div>
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              <span>Computed Output</span>
              <span className="text-emerald-400 font-bold">Live Result</span>
            </div>

            <div className="text-xs text-slate-300 mb-1">
              {config.resultLabel} ({config.resultSymbol})
            </div>

            <div className="text-3xl sm:text-4xl font-mono font-black text-white flex items-baseline gap-2 flex-wrap">
              <span>{Number.isFinite(calculationResult.result) ? calculationResult.result.toFixed(4) : "0.0000"}</span>
              <span className="text-sm font-normal text-slate-400">
                {config.resultUnit}
              </span>
            </div>
          </div>

          {/* Step-by-step Substitution Breakdown */}
          {calculationResult.steps && calculationResult.steps.length > 0 && (
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Step-by-Step Substitution:
              </span>
              <div className="space-y-1">
                {calculationResult.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="text-[11px] font-mono text-slate-300 flex items-start gap-1.5"
                  >
                    <ArrowRight className="w-3 h-3 text-[#C0222E] flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Formulas strictly follow CBSE Class 12 standard notations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
