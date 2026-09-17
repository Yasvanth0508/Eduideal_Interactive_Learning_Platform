"use client";

import React, { useState } from "react";
import { GraphBlockRenderer, GraphBlockConfig } from "../../graph-block-renderer";

export function AzeotropePhaseDiagram() {
  const [azeotropeType, setAzeotropeType] = useState<"MINIMUM" | "MAXIMUM">("MINIMUM");

  const graphConfig: GraphBlockConfig = {
    graphType: "AZEOTROPE",
    title: `${azeotropeType === "MINIMUM" ? "Minimum" : "Maximum"} Boiling Azeotrope Phase Diagram (T–x–y)`,
    description: azeotropeType === "MINIMUM"
      ? "Large positive deviation produces a boiling point minimum (e.g. Ethanol-Water at 95.4% ethanol, Tb = 351.15 K). Liquid and vapour compositions coincide at this minimum."
      : "Large negative deviation produces a boiling point maximum (e.g. Nitric acid-Water at 68% HNO₃, Tb = 393.5 K).",
    xAxisLabel: "Mole Fraction xA",
    yAxisLabel: "Boiling Temperature (K)",
    generateOption: () => {
      // Liquid and Vapor curves
      const liquidCurve: [number, number][] = [];
      const vaporCurve: [number, number][] = [];

      const xAzeo = azeotropeType === "MINIMUM" ? 0.95 : 0.68;
      const tA = azeotropeType === "MINIMUM" ? 351.5 : 359;
      const tB = 373.15; // Water
      const tAzeo = azeotropeType === "MINIMUM" ? 351.15 : 393.5;

      for (let i = 0; i <= 20; i++) {
        const x = i / 20;
        let tLiq = 0;
        let tVap = 0;

        if (azeotropeType === "MINIMUM") {
          // Drops to azeotrope at xAzeo
          const dist = Math.abs(x - xAzeo);
          tLiq = tAzeo + 22 * Math.pow(dist, 1.4);
          tVap = tAzeo + 26 * Math.pow(dist, 1.2);
        } else {
          // Rises to azeotrope at xAzeo
          const dist = Math.abs(x - xAzeo);
          tLiq = tAzeo - 28 * Math.pow(dist, 1.3);
          tVap = tAzeo - 24 * Math.pow(dist, 1.1);
        }

        liquidCurve.push([x, parseFloat(tLiq.toFixed(1))]);
        vaporCurve.push([x, parseFloat(tVap.toFixed(1))]);
      }

      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const x = params[0].value[0];
            return `Composition xA = ${x.toFixed(2)}<br/>` +
              `<span style="color:#0284c7">■ Liquid Boiling Temp: ${params[0].value[1]} K</span><br/>` +
              `<span style="color:#C0222E">■ Vapour Condensation Temp: ${params[1].value[1]} K</span>`;
          },
        },
        legend: {
          data: ["Liquid Phase Boundary (Bubble Line)", "Vapour Phase Boundary (Dew Line)"],
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
          name: azeotropeType === "MINIMUM" ? "Mole Fraction Ethanol (x_EtOH)" : "Mole Fraction HNO₃ (x_acid)",
          nameLocation: "middle",
          nameGap: 30,
          min: 0,
          max: 1,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        yAxis: {
          type: "value",
          name: "Boiling Temperature (K)",
          nameLocation: "middle",
          nameGap: 38,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        series: [
          {
            name: "Liquid Phase Boundary (Bubble Line)",
            type: "line",
            data: liquidCurve,
            smooth: true,
            lineStyle: { color: "#0284c7", width: 2.5 },
            itemStyle: { color: "#0284c7" },
          },
          {
            name: "Vapour Phase Boundary (Dew Line)",
            type: "line",
            data: vaporCurve,
            smooth: true,
            lineStyle: { color: "#C0222E", width: 2.5, type: "dashed" },
            itemStyle: { color: "#C0222E" },
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
            onClick={() => setAzeotropeType("MINIMUM")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              azeotropeType === "MINIMUM"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "bg-white text-slate-700 border border-[#E5E5E5]"
            }`}
          >
            Minimum Boiling Azeotrope (+ve deviation: Ethanol + Water)
          </button>
          <button
            onClick={() => setAzeotropeType("MAXIMUM")}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              azeotropeType === "MAXIMUM"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "bg-white text-slate-700 border border-[#E5E5E5]"
            }`}
          >
            Maximum Boiling Azeotrope (-ve deviation: HNO₃ + Water)
          </button>
        </div>
      </div>

      <GraphBlockRenderer config={graphConfig} />
    </div>
  );
}
