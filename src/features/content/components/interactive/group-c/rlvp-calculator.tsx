"use client";

import React, { useState } from "react";
import { Calculator, RotateCcw, ArrowRight } from "lucide-react";

export function RLVPCalculator() {
  const [p10, setP10] = useState<number>(32); // mmHg (pure water at 25°C)
  const [w2, setW2] = useState<number>(10); // g solute (e.g. glucose)
  const [w1, setW1] = useState<number>(100); // g solvent (water)
  const [m1, setM1] = useState<number>(18); // g/mol (water)
  const [m2, setM2] = useState<number>(180); // g/mol (glucose)

  // Moles
  const n2 = m2 > 0 ? w2 / m2 : 0;
  const n1 = m1 > 0 ? w1 / m1 : 0;

  // Relative Lowering = x2 = n2 / (n1 + n2) ~ (w2 * M1) / (M2 * w1) for dilute solutions
  const rlvpExact = (n1 + n2) > 0 ? (n2 / (n1 + n2)) : 0;
  const p1Solution = p10 * (1 - rlvpExact);
  const loweringDeltaP = p10 - p1Solution;

  const handleReset = () => {
    setP10(32);
    setW2(10);
    setW1(100);
    setM1(18);
    setM2(180);
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
            <Calculator className="w-3.5 h-3.5" />
            <span>RLVP FORMULA CALCULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            (p₁° - p₁) / p₁° = x₂
          </h4>
          <p className="text-xs text-[#555555]">
            Calculate relative lowering of vapour pressure and determine unknown solute molar mass M₂.
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
        {/* Inputs */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Pure Vapour Pressure (p₁°)</span>
              <span className="font-mono font-bold text-[#C0222E]">{p10} mmHg</span>
            </div>
            <input
              type="number"
              min={1}
              value={p10}
              onChange={(e) => setP10(parseFloat(e.target.value) || 0)}
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
              <span className="font-semibold text-slate-700">Molar Mass Solute (M₂)</span>
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

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
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
              Relative Lowering (RLVP)
            </div>
            <div className="text-3xl font-mono font-black text-amber-400">
              {rlvpExact.toFixed(4)} <span className="text-xs font-normal text-slate-300">(Dimensionless)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-800">
            <div>
              <span className="text-slate-400 block text-[10px]">ΔP Lowering:</span>
              <span className="font-mono font-bold text-white">{loweringDeltaP.toFixed(3)} mmHg</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">Solution Pressure p₁:</span>
              <span className="font-mono font-bold text-emerald-400">{p1Solution.toFixed(3)} mmHg</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800 space-y-1">
            <div>• n₂ = {w2}g / {m2} = {n2.toFixed(4)} mol</div>
            <div>• n₁ = {w1}g / {m1} = {n1.toFixed(4)} mol</div>
            <div>• x₂ = {n2.toFixed(4)} / ({(n1 + n2).toFixed(4)}) = {rlvpExact.toFixed(4)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
