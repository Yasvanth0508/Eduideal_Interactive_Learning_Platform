"use client";

import React, { useState } from "react";
import { Calculator, RotateCcw, ArrowRight, CheckCircle2 } from "lucide-react";
import { ContentBlockWithDetails, FormulaBlock, FormulaBlockData } from "@/types/content";
import { MathFormula } from "@/components/ui/math-formula";
import {
  SubsectionTitle,
  CaptionText,
  MetadataText,
  Heading4,
} from "@/components/ui/typography";

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
  expression: string; // e.g. "ΔTb = Kb × m" or "\Delta T_b = i \times K_b \times m"
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
        calculate: (values: Record<string, number>) => {
          // Check for boiling point elevation: ΔTb = i × Kb × m
          if ("Kb" in values || "m" in values) {
            const kb = values["Kb"] ?? 0.512;
            const m = values["m"] ?? 1;
            const i = values["i"] ?? 1;
            const result = i * kb * m;
            return {
              result,
              steps: [
                `Formula: ΔTb = i × Kb × m`,
                `Given: i = ${i}, Kb = ${kb} K·kg/mol, m = ${m} mol/kg`,
                `Substitution: ΔTb = ${i} × ${kb} × ${m}`,
                `Result: ${result.toFixed(4)} K elevation`,
              ],
            };
          }
          // Check for molarity: M = n / V
          if ("n" in values && "V" in values) {
            const n = values["n"] ?? 1;
            const V = values["V"] ?? 1;
            const result = V !== 0 ? n / V : 0;
            return {
              result,
              steps: [
                `Formula: M = n / V`,
                `Given: moles n = ${n} mol, volume V = ${V} L`,
                `Substitution: M = ${n} / ${V}`,
                `Result: ${result.toFixed(4)} mol/L (M)`,
              ],
            };
          }
          // Fallback generic multiplier
          const entries = Object.entries(values);
          const mult = entries.reduce((acc, [, val]) => acc * (val || 1), 1);
          return {
            result: mult,
            steps: [
              `Calculated based on product of ${entries.length} variables.`,
              `Result: ${mult.toFixed(2)}`,
            ],
          };
        },
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
              className="type-metadata font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
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

          <SubsectionTitle className="tracking-tight">
            {config.formulaName}
          </SubsectionTitle>
          <CaptionText className="text-[#555555] mt-0.5">
            {config.description}
          </CaptionText>
        </div>

        <button
          onClick={handleReset}
          className="type-button flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAFAFA] hover:bg-slate-100 text-slate-700 border border-[#E5E5E5] transition-all self-start sm:self-center cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#C0222E]" />
          <span>Reset Values</span>
        </button>
      </div>

      {/* Formula Mathematical Display (KaTeX) */}
      <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center">
        <MetadataText className="font-mono font-bold text-[#555555] uppercase tracking-wider block mb-1">
          Governing Equation
        </MetadataText>
        <MathFormula
          expression={config.expression}
          display={true}
          className="type-math text-xl sm:text-2xl font-bold"
        />
      </div>

      {/* Two Column Grid: Inputs & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Variables Sliders & Inputs */}
        <div className="space-y-4">
          <Heading4 className="type-metadata font-bold font-mono uppercase tracking-wider text-black flex items-center gap-2">
            <span>Input Variables</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-normal">
              Adjust sliders or type values
            </span>
          </Heading4>

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
                <div className="flex items-center justify-between type-caption">
                  <span className="font-bold text-black flex items-center gap-1.5">
                    <span className="type-code text-[#C0222E] bg-rose-50 px-1.5 py-0.5 rounded">
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
                      className="w-20 px-2 py-1 text-right border border-[#E5E5E5] rounded-lg type-code bg-[#FAFAFA] text-black focus:outline-none focus:border-[#C0222E]"
                    />
                    <MetadataText className="text-slate-500 font-medium w-8">
                      {variable.unit}
                    </MetadataText>
                  </div>
                </div>

                <input
                  type="range"
                  min={min}
                  max={max}
                  step={step}
                  value={val}
                  onChange={(e) =>
                    handleInputChange(variable.symbol, e.target.value)
                  }
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#C0222E]"
                />
              </div>
            );
          })}
        </div>

        {/* Calculation Result & Steps */}
        <div className="space-y-4">
          <Heading4 className="type-metadata font-bold font-mono uppercase tracking-wider text-black">
            Calculated Output
          </Heading4>

          <div className="p-6 rounded-2xl bg-rose-50/50 border border-rose-200 text-center space-y-2">
            <MetadataText className="font-mono font-bold text-[#C0222E] uppercase tracking-wider block">
              {config.resultLabel || "Calculated Result"}
            </MetadataText>

            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl sm:text-5xl font-black font-mono text-rose-950 tracking-tight">
                {typeof calculationResult.result === "number"
                  ? Number.isInteger(calculationResult.result)
                    ? calculationResult.result
                    : calculationResult.result.toFixed(4)
                  : calculationResult.result}
              </span>
              <span className="type-caption font-bold font-mono text-rose-700">
                {config.resultUnit}
              </span>
            </div>
          </div>

          {/* Step-by-Step Substitution */}
          {calculationResult.steps && calculationResult.steps.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2.5">
              <div className="flex items-center gap-1.5 type-metadata font-bold text-black uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Step-by-Step Evaluation</span>
              </div>
              <div className="space-y-1.5 type-code text-slate-700">
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
