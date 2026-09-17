"use client";

import React, { useState } from "react";
import { Calculator, RotateCcw, Snowflake } from "lucide-react";

export function FreezingDepressionCalculator() {
  const [kf, setKf] = useState<number>(1.86); // K·kg/mol (water)
  const [w2, setW2] = useState<number>(45); // g ethylene glycol (C2H6O2, M = 62)
  const [m2, setM2] = useState<number>(62); // g/mol
  const [w1, setW1] = useState<number>(600); // g water
  const [tf0, setTf0] = useState<number>(0); // °C (273.15 K)

  // Molality = (w2 * 1000) / (M2 * w1)
  const molality = (m2 > 0 && w1 > 0) ? (w2 * 1000) / (m2 * w1) : 0;
  // Delta Tf = Kf * m
  const deltaTf = kf * molality;
  const tfSolution = tf0 - deltaTf;

  const handleReset = () => {
    setKf(1.86);
    setW2(45);
    setM2(62);
    setW1(600);
    setTf0(0);
  };

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5] mb-6">
        <div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 inline-flex mb-1.5"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>CRYOSCOPY CALCULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            ΔTf = Kf · m = (1000 · Kf · w₂) / (M₂ · w₁)
          </h4>
          <p className="text-xs text-[#555555]">
            Calculate freezing point depression and analyze antifreeze coolant formulations.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Kf Constant</span>
              <span className="font-mono font-bold text-cyan-600">{kf} K·kg/mol</span>
            </div>
            <input
              type="number"
              step={0.01}
              value={kf}
              onChange={(e) => setKf(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Pure Freezing Point (Tf°)</span>
              <span className="font-mono font-bold text-slate-700">{tf0} °C</span>
            </div>
            <input
              type="number"
              step={0.1}
              value={tf0}
              onChange={(e) => setTf0(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Mass of Solute (w₂)</span>
              <span className="font-mono font-bold text-[#C0222E]">{w2} g</span>
            </div>
            <input
              type="number"
              min={0.1}
              value={w2}
              onChange={(e) => setW2(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Solute Molar Mass (M₂)</span>
              <span className="font-mono font-bold text-slate-600">{m2} g/mol</span>
            </div>
            <input
              type="number"
              min={1}
              value={m2}
              onChange={(e) => setM2(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1 sm:col-span-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Mass of Solvent (w₁)</span>
              <span className="font-mono font-bold text-sky-600">{w1} g</span>
            </div>
            <input
              type="number"
              min={1}
              value={w1}
              onChange={(e) => setW1(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-5 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Freezing Point Depression (ΔTf)
            </div>
            <div className="text-3xl font-mono font-black text-cyan-400">
              {deltaTf.toFixed(4)} <span className="text-sm font-normal text-slate-300">K (or °C)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">Molality m:</span>
              <span className="font-mono font-bold text-white">{molality.toFixed(4)} mol/kg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">New Freezing Point:</span>
              <span className="font-mono font-bold text-rose-400">{tfSolution.toFixed(3)} °C</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800 space-y-1">
            <div>• m = ({w2} × 1000) / ({m2} × {w1}) = {molality.toFixed(4)} m</div>
            <div>• ΔTf = {kf} × {molality.toFixed(4)} = {deltaTf.toFixed(4)} K</div>
            <div>• Tf(soln) = {tf0}°C - {deltaTf.toFixed(4)}°C = {tfSolution.toFixed(3)} °C</div>
          </div>
        </div>
      </div>
    </div>
  );
}
