"use client";

import React, { useState } from "react";
import { Calculator, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import { ContentBlockWithDetails, FormulaBlock, FormulaBlockData } from "@/types/content";

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
  block?: FormulaBlock | ContentBlockWithDetails;
  config?: FormulaConfigPayload;
}

export function FormulaBlockRenderer({ block, config: propConfig }: FormulaBlockRendererProps) {
  const formulaConfigData: FormulaBlockData | undefined =
    (block && "data" in block && block.data ? (block.data as FormulaBlockData) : undefined) ||
    (block && "formulaConfig" in block && block.formulaConfig ? (block.formulaConfig as FormulaBlockData) : undefined);

  const dbConfig: FormulaConfigPayload | null = formulaConfigData
    ? {
        formulaName: formulaConfigData.formulaName || formulaConfigData.name || "Formula",
        expression: formulaConfigData.formulaExpression,
        description: formulaConfigData.description || "",
        resultLabel: formulaConfigData.formulaName || formulaConfigData.name || "Result",
        resultUnit: formulaConfigData.resultUnit || "",
        resultSymbol: "Result",
        variables: (formulaConfigData.variables || []).map(
          (v): FormulaVariableInput => ({
            symbol: v.symbol,
            label: v.label,
            unit: v.unit || "",
            defaultValue: v.defaultValue,
            min: v.minValue ?? undefined,
            max: v.maxValue ?? undefined,
          })
        ),
        calculate: () => ({
          result: 0,
          steps: ["Step-by-step substitution from database formula config."],
        }),
      }
    : null;

  const config =
    propConfig || dbConfig || (block && "content" in block ? (block.content as unknown as FormulaConfigPayload) : undefined);

  // Initialize input state with default values unconditionally (Rules of Hooks)
  const [inputs, setInputs] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (config?.variables) {
      config.variables.forEach((v) => {
        initial[v.symbol] = v.defaultValue;
      });
    }
    return initial;
  });

  if (!config || !config.variables) {
    return null;
  }

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
  } catch {
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

          <h3 className="text-xl font-bold text-black tracking-tight">
            {config.formulaName}
          </h3>
          <p className="text-xs sm:text-sm text-[#555555] mt-0.5">
            {config.description}
          </p>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAFA] hover:bg-slate-100 text-xs font-bold text-slate-700 border border-[#E5E5E5] transition-all self-start sm:self-center"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C0222E]" />
          <span>Reset Values</span>
        </button>
      </div>

      {/* Formula Mathematical Display */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center">
        <span className="text-xs font-mono font-bold text-[#555555] uppercase tracking-wider block mb-1">
          Governing Equation
        </span>
        <div className="text-xl sm:text-2xl font-black font-mono tracking-wide text-black selection:bg-[#C0222E]">
          {config.expression}
        </div>
      </div>

      {/* Two Column Grid: Inputs & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Variables Sliders & Inputs */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-black flex items-center gap-2">
            <span>Input Variables</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
              Adjust sliders or type values
            </span>
          </h4>

          {config.variables.map((variable) => {
            const val = inputs[variable.symbol] ?? variable.defaultValue;
            const min = variable.min ?? 0;
            const max = variable.max ?? 100;
            const step = variable.step ?? (max - min > 10 ? 1 : 0.01);

            return (
              <div
                key={variable.symbol}
                className="p-3.5 rounded-2xl border border-[#E5E5E5] bg-white shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <span className="font-mono text-[#C0222E] bg-rose-50 px-1.5 py-0.5 rounded">
                      {variable.symbol}
                    </span>
                    <span>{variable.label}</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step={step}
                      min={min}
                      max={max}
                      value={val}
                      onChange={(e) =>
                        handleInputChange(variable.symbol, e.target.value)
                      }
                      className="w-20 px-2 py-1 text-right font-mono text-xs border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#C0222E]"
                    />
                    <span className="text-[11px] font-mono text-[#555555] min-w-[28px]">
                      {variable.unit}
                    </span>
                  </div>
                </div>

                {/* Slider */}
                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) =>
                    handleInputChange(variable.symbol, e.target.value)
                  }
                  className="w-full accent-[#C0222E] h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />

                {variable.description && (
                  <p className="text-[11px] text-[#555555]">
                    {variable.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Calculation Result & Steps */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-black">
            Calculated Output
          </h4>

          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 text-center space-y-2">
            <span className="text-xs font-mono font-bold text-[#C0222E] uppercase tracking-wider block">
              {config.resultLabel || "Calculated Result"}
            </span>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-rose-950 tracking-tight">
                {typeof calculationResult.result === "number"
                  ? Number.isInteger(calculationResult.result)
                    ? calculationResult.result
                    : calculationResult.result.toFixed(4)
                  : calculationResult.result}
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-rose-700">
                {config.resultUnit}
              </span>
            </div>
          </div>

          {/* Step-by-Step Substitution */}
          {calculationResult.steps && calculationResult.steps.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Step-by-Step Evaluation</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-700">
                {calculationResult.steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <ArrowRight className="w-3 h-3 text-slate-400 mt-1 flex-shrink-0" />
                    <span className="break-all">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
