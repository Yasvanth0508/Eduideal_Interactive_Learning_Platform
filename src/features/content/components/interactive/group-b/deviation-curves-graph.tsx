"use client";

import React, { useState } from "react";
import { GraphBlockRenderer, GraphBlockConfig } from "../../graph-block-renderer";

export function DeviationCurvesGraph() {
  const [deviationType, setDeviationType] = useState<"POSITIVE" | "NEGATIVE">("POSITIVE");
  const [magnitude, setMagnitude] = useState<number>(40); // mmHg deviation amplitude

  const pA0 = 300;
  const pB0 = 180;

  const graphConfig: GraphBlockConfig = {
    graphType: "DEVIATION",
    title: `${deviationType === "POSITIVE" ? "Positive" : "Negative"} Deviation from Raoult's Law`,
    description: `Comparing observed vapour pressure curve against theoretical ideal Raoult straight line (${deviationType === "POSITIVE" ? "Higher P due to weaker A-B forces" : "Lower P due to stronger A-B attractions"}).`,
    xAxisLabel: "Mole Fraction of A (xA)",
    yAxisLabel: "Vapour Pressure (mmHg)",
    generateOption: () => {
      const idealTotal: [number, number][] = [];
      const actualTotal: [number, number][] = [];

      for (let i = 0; i <= 20; i++) {
        const xA = i / 20;
        const xB = 1 - xA;
        const pIdeal = pA0 * xA + pB0 * xB;

        // Deviation parabola: delta = 4 * magnitude * xA * (1 - xA)
        const sign = deviationType === "POSITIVE" ? 1 : -1;
        const delta = sign * (4 * magnitude * xA * xB);
        const pActual = pIdeal + delta;

        idealTotal.push([xA, parseFloat(pIdeal.toFixed(1))]);
        actualTotal.push([xA, parseFloat(pActual.toFixed(1))]);
      }

      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const xA = params[0].value[0];
            return `xA = ${xA.toFixed(2)}<br/>` +
              `<span style="color:#C0222E">■ Actual Total Pressure: <strong>${params[0].value[1]} mmHg</strong></span><br/>` +
              `<span style="color:#64748b">--- Ideal Raoult's Line: ${params[1].value[1]} mmHg</span>`;
          },
        },
        legend: {
          data: ["Actual Observed Pressure", "Ideal Raoult's Line"],
          top: "4%",
        },
        grid: {
          left: "8%",
          right: "8%",
          top: "16%",
          bottom: "12%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "Mole Fraction xA (0 to 1)",
          nameLocation: "middle",
          nameGap: 30,
          min: 0,
          max: 1,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        yAxis: {
          type: "value",
          name: "Vapour Pressure (mmHg)",
          nameLocation: "middle",
          nameGap: 38,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        series: [
          {
            name: "Actual Observed Pressure",
            type: "line",
            data: actualTotal,
            smooth: true,
            lineStyle: { color: "#C0222E", width: 3.5 },
            itemStyle: { color: "#C0222E" },
          },
          {
            name: "Ideal Raoult's Line",
            type: "line",
            data: idealTotal,
            lineStyle: { color: "#64748b", width: 2, type: "dashed" },
            itemStyle: { color: "#64748b" },
          },
        ],
      };
    },
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDeviationType("POSITIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviationType === "POSITIVE"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "bg-white text-slate-700 border border-[#E5E5E5]"
            }`}
          >
            Positive Deviation (P_actual &gt; P_ideal)
          </button>
          <button
            onClick={() => setDeviationType("NEGATIVE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              deviationType === "NEGATIVE"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "bg-white text-slate-700 border border-[#E5E5E5]"
            }`}
          >
            Negative Deviation (P_actual &lt; P_ideal)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-black">Deviation Intensity:</span>
          <input
            type="range"
            min={15}
            max={70}
            step={5}
            value={magnitude}
            onChange={(e) => setMagnitude(parseInt(e.target.value))}
            className="w-28 accent-[#C0222E] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#C0222E]">±{magnitude} mmHg</span>
        </div>
      </div>

      <GraphBlockRenderer config={graphConfig} />
    </div>
  );
}
