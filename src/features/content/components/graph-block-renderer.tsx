"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { LineChart, Sparkles, Sliders, Info } from "lucide-react";
import { ContentBlockWithDetails } from "../types";

// Dynamically import ReactECharts to avoid SSR issues with window/canvas
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] text-xs text-[#555555]">
      Loading scientific graph...
    </div>
  ),
});

export interface GraphParam {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit: string;
}

export interface GraphBlockConfig {
  graphType: "HENRY_LAW" | "RAOULT_LAW" | "DEVIATION" | "AZEOTROPE" | "CUSTOM";
  title: string;
  description: string;
  xAxisLabel: string;
  yAxisLabel: string;
  params?: GraphParam[];
  generateOption: (paramValues: Record<string, number>) => any;
}

interface GraphBlockRendererProps {
  block?: ContentBlockWithDetails;
  config?: GraphBlockConfig;
}

export function GraphBlockRenderer({ block, config: propConfig }: GraphBlockRendererProps) {
  const config = propConfig || (block?.content as unknown as GraphBlockConfig);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    config?.params?.forEach((p) => {
      initial[p.key] = p.defaultValue;
    });
    return initial;
  });

  const handleParamChange = (key: string, value: number) => {
    setParamValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const chartOption = useMemo(() => {
    if (!config || typeof config.generateOption !== "function") {
      return {};
    }
    try {
      return config.generateOption(paramValues);
    } catch {
      return {};
    }
  }, [config, paramValues]);

  if (!config) return null;

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
              <LineChart className="w-3.5 h-3.5" />
              <span>DYNAMIC SCIENTIFIC GRAPH</span>
            </span>
          </div>

          <h4 className="text-xl font-bold text-black tracking-tight">
            {config.title}
          </h4>
          <p className="text-xs text-[#555555]">
            {config.description}
          </p>
        </div>
      </div>

      {/* Main Grid: Chart and Parameter Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Graph Display Column */}
        <div className="lg:col-span-8 bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] p-3 sm:p-4">
          {mounted ? (
            <ReactECharts
              option={chartOption}
              style={{ height: "360px", width: "100%" }}
              opts={{ renderer: "svg" }}
            />
          ) : (
            <div className="w-full h-[360px] flex items-center justify-center text-xs text-[#555555]">
              Initializing graph canvas...
            </div>
          )}
        </div>

        {/* Parameter Sliders Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {config.params && config.params.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-black uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-[#C0222E]" />
                <span>Interactive Controls</span>
              </div>

              {config.params.map((param) => {
                const currentVal = paramValues[param.key] ?? param.defaultValue;

                return (
                  <div key={param.key} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">
                        {param.label}
                      </span>
                      <span className="font-mono font-bold text-[#C0222E]">
                        {currentVal} {param.unit}
                      </span>
                    </div>

                    <input
                      type="range"
                      min={param.min}
                      max={param.max}
                      step={param.step}
                      value={currentVal}
                      onChange={(e) =>
                        handleParamChange(param.key, parseFloat(e.target.value))
                      }
                      className="w-full accent-[#C0222E] cursor-pointer"
                    />

                    <div className="flex justify-between text-[10px] font-mono text-slate-400">
                      <span>{param.min} {param.unit}</span>
                      <span>{param.max} {param.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Graph Analysis Tip */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Graph Interpretation: </strong>
              Observe how the thermodynamic curves respond to composition and temperature changes in accordance with CBSE NCERT theory.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
