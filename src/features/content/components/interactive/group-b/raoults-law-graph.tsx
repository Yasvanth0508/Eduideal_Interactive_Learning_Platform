"use client";

import React, { useState } from "react";
import { GraphBlockRenderer, GraphBlockConfig } from "../../graph-block-renderer";

export function RaoultsLawGraph() {
  const [pA0, setPA0] = useState<number>(300); // mmHg (pure component A, e.g. Benzene)
  const [pB0, setPB0] = useState<number>(150); // mmHg (pure component B, e.g. Toluene)

  const graphConfig: GraphBlockConfig = {
    graphType: "RAOULT_LAW",
    title: "Raoult's Law: Dual-Component Vapour Pressure vs. Liquid Composition",
    description: "Plotting partial pressures pA, pB and Total Vapour Pressure P_total = pA + pB as mole fraction xA varies from 0 to 1.",
    xAxisLabel: "Mole Fraction of Component A (xA)",
    yAxisLabel: "Vapour Pressure (mmHg)",
    generateOption: () => {
      const dataA: [number, number][] = [];
      const dataB: [number, number][] = [];
      const dataTotal: [number, number][] = [];

      for (let i = 0; i <= 10; i++) {
        const xA = i / 10;
        const xB = 1 - xA;
        const pA = pA0 * xA;
        const pB = pB0 * xB;
        const pTot = pA + pB;

        dataA.push([xA, parseFloat(pA.toFixed(1))]);
        dataB.push([xA, parseFloat(pB.toFixed(1))]);
        dataTotal.push([xA, parseFloat(pTot.toFixed(1))]);
      }

      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const xVal = params[0].value[0];
            return `<strong>xA = ${xVal.toFixed(1)} (xB = ${(1 - xVal).toFixed(1)})</strong><br/>` +
              `<span style="color:#C0222E">■ P_total: ${params[0].value[1]} mmHg</span><br/>` +
              `<span style="color:#0284c7">■ pA: ${params[1].value[1]} mmHg</span><br/>` +
              `<span style="color:#10b981">■ pB: ${params[2].value[1]} mmHg</span>`;
          },
        },
        legend: {
          data: ["Total Pressure (P_total)", "Partial Pressure pA", "Partial Pressure pB"],
          top: "3%",
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
          name: "Mole Fraction xA (0 = Pure B, 1 = Pure A)",
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
            name: "Total Pressure (P_total)",
            type: "line",
            data: dataTotal,
            lineStyle: { color: "#C0222E", width: 3 },
            itemStyle: { color: "#C0222E" },
          },
          {
            name: "Partial Pressure pA",
            type: "line",
            data: dataA,
            lineStyle: { color: "#0284c7", width: 2, type: "dashed" },
            itemStyle: { color: "#0284c7" },
          },
          {
            name: "Partial Pressure pB",
            type: "line",
            data: dataB,
            lineStyle: { color: "#10b981", width: 2, type: "dashed" },
            itemStyle: { color: "#10b981" },
          },
        ],
      };
    },
  };

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-black">Pure pA° (Component A):</span>
          <input
            type="range"
            min={100}
            max={500}
            step={25}
            value={pA0}
            onChange={(e) => setPA0(parseInt(e.target.value))}
            className="w-28 accent-[#C0222E] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#0284c7]">{pA0} mmHg</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-black">Pure pB° (Component B):</span>
          <input
            type="range"
            min={50}
            max={400}
            step={25}
            value={pB0}
            onChange={(e) => setPB0(parseInt(e.target.value))}
            className="w-28 accent-[#10b981] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#10b981]">{pB0} mmHg</span>
        </div>
      </div>

      <GraphBlockRenderer config={graphConfig} />
    </div>
  );
}
