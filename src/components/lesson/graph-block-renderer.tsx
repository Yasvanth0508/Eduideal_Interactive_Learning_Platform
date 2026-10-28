"use client";

import React, { useState, useMemo, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { LineChart, Sliders, Info } from "lucide-react";
import { ContentBlockWithDetails, GraphBlock } from "@/types/content";
import {
  SubsectionTitle,
  CaptionText,
  Heading4,
} from "@/components/ui/typography";

// Dynamically import ReactECharts to avoid SSR issues with window/canvas
const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[360px] flex items-center justify-center bg-[#FAFAFA] rounded-2xl border border-[#E5E5E5] type-caption text-[#555555]">
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
  generateOption: (paramValues: Record<string, number>) => Record<string, unknown>;
}

interface GraphBlockRendererProps {
  block?: GraphBlock | ContentBlockWithDetails;
  config?: GraphBlockConfig;
}

function emptySubscribe() {
  return () => {};
}

export function GraphBlockRenderer({ block, config: propConfig }: GraphBlockRendererProps) {
  const rawGraphData = (block && "data" in block && block.data ? block.data : undefined) ||
    (block && "graphConfig" in block ? block.graphConfig : undefined) ||
    (block && "content" in block ? block.content : undefined);

  const derivedConfig: GraphBlockConfig | null = (rawGraphData && typeof rawGraphData === "object") ? {
    graphType: "CUSTOM",
    title: (rawGraphData as { title?: string }).title || block?.title || "Scientific Graph",
    description: (rawGraphData as { description?: string }).description || block?.description || "",
    xAxisLabel: (rawGraphData as { xAxis?: { label: string } }).xAxis?.label || (rawGraphData as { xAxisLabel?: string }).xAxisLabel || "",
    yAxisLabel: (rawGraphData as { yAxis?: { label: string } }).yAxis?.label || (rawGraphData as { yAxisLabel?: string }).yAxisLabel || "",
    params: (rawGraphData as { parameters?: Array<{ key: string; label: string; min: number; max: number; step: number; defaultValue: number; unit?: string }> }).parameters?.map((p) => ({
      key: p.key,
      label: p.label,
      min: p.min,
      max: p.max,
      step: p.step,
      defaultValue: p.defaultValue,
      unit: p.unit || "",
    })) || (rawGraphData as { params?: GraphParam[] }).params,
    generateOption: typeof (rawGraphData as { generateOption?: unknown }).generateOption === "function"
      ? ((rawGraphData as { generateOption: (p: Record<string, number>) => Record<string, unknown> }).generateOption)
      : () => ({
          xAxis: { type: "value", name: (rawGraphData as { xAxis?: { label: string } }).xAxis?.label || "" },
          yAxis: { type: "value", name: (rawGraphData as { yAxis?: { label: string } }).yAxis?.label || "" },
          series: (rawGraphData as { series?: unknown[] }).series || [],
        }),
  } : null;

  const config = propConfig || derivedConfig;

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

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
              className="type-metadata font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
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

          <SubsectionTitle className="tracking-tight">
            {config.title}
          </SubsectionTitle>
          <CaptionText className="text-[#555555] mt-0.5">
            {config.description}
          </CaptionText>
        </div>
      </div>

      {/* Main Grid: Parameters on Left, Graph on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Interactive Parameter Controls (if any) */}
        {config.params && config.params.length > 0 && (
          <div className="space-y-4">
            <Heading4 className="type-metadata font-bold font-mono uppercase tracking-wider text-black flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#C0222E]" />
              <span>Graph Parameters</span>
            </Heading4>

            <div className="space-y-3">
              {config.params.map((param) => {
                const currentVal = paramValues[param.key] ?? param.defaultValue;
                return (
                  <div
                    key={param.key}
                    className="p-3.5 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] space-y-2"
                  >
                    <div className="flex items-center justify-between type-caption font-semibold text-black">
                      <span>{param.label}</span>
                      <span className="type-code text-[#C0222E]">
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
                      className="w-full accent-[#C0222E] h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />

                    <div className="flex justify-between type-metadata font-mono text-[#555555]">
                      <span>
                        {param.min} {param.unit}
                      </span>
                      <span>
                        {param.max} {param.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-[#E5E5E5] flex items-start gap-2 type-caption text-slate-600">
              <Info className="w-4 h-4 text-[#C0222E] flex-shrink-0 mt-0.5" />
              <span>
                Move sliders to observe real-time curves and slope changes.
              </span>
            </div>
          </div>
        )}

        {/* ECharts Canvas Container */}
        <div
          className={`${
            config.params && config.params.length > 0 ? "lg:col-span-2" : "lg:col-span-3"
          } rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] p-3 sm:p-5`}
        >
          {isMounted ? (
            <ReactECharts
              option={chartOption}
              style={{ height: "380px", width: "100%" }}
              notMerge={true}
              lazyUpdate={true}
            />
          ) : (
            <div className="w-full h-[380px] flex items-center justify-center type-caption text-[#555555]">
              Initializing scientific graph visualization...
            </div>
          )}

          <div className="mt-3 pt-3 border-t border-[#E5E5E5] flex flex-wrap items-center justify-between type-metadata text-[#555555] gap-2">
            <span>
              X-Axis: <strong className="text-black">{config.xAxisLabel || "Independent"}</strong>
            </span>
            <span>
              Y-Axis: <strong className="text-black">{config.yAxisLabel || "Dependent"}</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
