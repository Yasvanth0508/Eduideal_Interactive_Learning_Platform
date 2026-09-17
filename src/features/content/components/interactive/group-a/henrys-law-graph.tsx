"use client";

import React, { useState } from "react";
import { GraphBlockRenderer, GraphBlockConfig } from "../../graph-block-renderer";

interface GasData {
  name: string;
  formula: string;
  khAt293K: number; // kbar
  khAt298K: number;
  khAt303K: number;
}

const GASES: GasData[] = [
  { name: "Oxygen", formula: "O₂", khAt293K: 34.86, khAt298K: 46.82, khAt303K: 60.1 },
  { name: "Nitrogen", formula: "N₂", khAt293K: 76.48, khAt298K: 86.4, khAt303K: 98.2 },
  { name: "Carbon Dioxide", formula: "CO₂", khAt293K: 1.45, khAt298K: 1.67, khAt303K: 1.95 },
];

export function HenrysLawGraph() {
  const [selectedGas, setSelectedGas] = useState<string>("Oxygen");
  const [temperature, setTemperature] = useState<number>(298); // Kelvin

  const gas = GASES.find((g) => g.name === selectedGas) || GASES[0];

  // Estimate KH based on temperature interpolation
  const tempRatio = (temperature - 293) / 10;
  const currentKh =
    gas.khAt293K + tempRatio * (gas.khAt303K - gas.khAt293K);

  const graphConfig: GraphBlockConfig = {
    graphType: "HENRY_LAW",
    title: "Henry's Law: Partial Pressure vs. Mole Fraction in Solution",
    description: `Examining p = KH · x for ${gas.name} (${gas.formula}). Higher KH yields lower gas solubility at a given pressure.`,
    xAxisLabel: "Mole Fraction of Gas in Solution (x × 10⁻⁵)",
    yAxisLabel: "Partial Pressure p (bar)",
    params: [],
    generateOption: () => {
      // Generate linear points for p = KH * x
      // x from 0 to 5 * 10^-5
      const dataPoints: [number, number][] = [];
      for (let xScaled = 0; xScaled <= 5; xScaled += 0.5) {
        const xReal = xScaled * 1e-5;
        // p in bar = KH (kbar) * 1000 * xReal
        const p = currentKh * 1000 * xReal;
        dataPoints.push([xScaled, parseFloat(p.toFixed(2))]);
      }

      return {
        tooltip: {
          trigger: "axis",
          formatter: (params: any) => {
            const pt = params[0];
            return `Mole Fraction x: ${pt.value[0]} × 10⁻⁵<br/>Partial Pressure: <strong>${pt.value[1]} bar</strong>`;
          },
        },
        grid: {
          left: "8%",
          right: "8%",
          top: "12%",
          bottom: "12%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          name: "Mole Fraction (x × 10⁻⁵)",
          nameLocation: "middle",
          nameGap: 28,
          min: 0,
          max: 5,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        yAxis: {
          type: "value",
          name: "Partial Pressure p (bar)",
          nameLocation: "middle",
          nameGap: 38,
          splitLine: { lineStyle: { color: "#E5E5E5" } },
        },
        series: [
          {
            name: `${gas.name} at ${temperature}K`,
            type: "line",
            data: dataPoints,
            smooth: false,
            symbol: "circle",
            symbolSize: 6,
            lineStyle: { color: "#C0222E", width: 3 },
            itemStyle: { color: "#C0222E" },
          },
        ],
      };
    },
  };

  return (
    <div className="space-y-4">
      {/* Gas Selector and Temperature Controls */}
      <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            Select Solute Gas:
          </span>
          <div className="flex items-center gap-1">
            {GASES.map((g) => (
              <button
                key={g.name}
                onClick={() => setSelectedGas(g.name)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedGas === g.name
                    ? "bg-[#C0222E] text-white shadow-2xs"
                    : "bg-white text-slate-700 hover:text-black border border-[#E5E5E5]"
                }`}
              >
                {g.name} ({g.formula})
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-black uppercase tracking-wider">
            Temperature:
          </span>
          <input
            type="range"
            min={293}
            max={303}
            step={1}
            value={temperature}
            onChange={(e) => setTemperature(parseInt(e.target.value))}
            className="w-28 accent-[#C0222E] cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-[#C0222E]">
            {temperature} K
          </span>
        </div>
      </div>

      <GraphBlockRenderer config={graphConfig} />
    </div>
  );
}
