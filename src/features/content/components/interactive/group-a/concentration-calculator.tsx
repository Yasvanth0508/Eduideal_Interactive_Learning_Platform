"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, RotateCcw, ArrowRight, Thermometer, Info } from "lucide-react";

type CalcMode = "MOLARITY" | "MOLALITY" | "MOLE_FRACTION" | "PPM" | "MASS_PERCENT";

export function ConcentrationCalculator() {
  const [mode, setMode] = useState<CalcMode>("MOLARITY");

  // State inputs
  const [soluteMass, setSoluteMass] = useState<number>(5); // grams (e.g. NaOH)
  const [soluteMolarMass, setSoluteMolarMass] = useState<number>(40); // g/mol (NaOH)
  const [solutionVolume, setSolutionVolume] = useState<number>(250); // mL
  const [solventMass, setSolventMass] = useState<number>(500); // grams
  const [solventMolarMass, setSolventMolarMass] = useState<number>(18); // g/mol (Water)
  const [solutionMass, setSolutionMass] = useState<number>(1000); // grams

  // Calculations
  const molesSolute = soluteMolarMass > 0 ? soluteMass / soluteMolarMass : 0;
  const molesSolvent = solventMolarMass > 0 ? solventMass / solventMolarMass : 0;

  // Molarity: moles of solute / volume of solution (L)
  const molarity = solutionVolume > 0 ? (molesSolute / (solutionVolume / 1000)) : 0;

  // Molality: moles of solute / mass of solvent (kg)
  const molality = solventMass > 0 ? (molesSolute / (solventMass / 1000)) : 0;

  // Mole fraction of solute
  const totalMoles = molesSolute + molesSolvent;
  const moleFractionSolute = totalMoles > 0 ? (molesSolute / totalMoles) : 0;
  const moleFractionSolvent = totalMoles > 0 ? (molesSolvent / totalMoles) : 0;

  // Parts per million: (mass of solute / total mass of solution) * 10^6
  const ppm = solutionMass > 0 ? (soluteMass / solutionMass) * 1e6 : 0;

  // Mass percentage: (mass of solute / total mass of solution) * 100
  const massPercent = solutionMass > 0 ? (soluteMass / solutionMass) * 100 : 0;

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
            <span>INTERACTIVE FORMULA CALCULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Concentration Units Explorer
          </h4>
          <p className="text-xs text-[#555555]">
            Select a concentration unit below, adjust chemical quantities, and observe step-by-step NCERT computations.
          </p>
        </div>

        {/* Temperature Sensitivity Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-[#E5E5E5] text-[11px] font-medium text-slate-700">
          <Thermometer className="w-3.5 h-3.5 text-[#C0222E]" />
          <span>
            {mode === "MOLARITY"
              ? "Varies with Temperature (Volume-dependent)"
              : "Temperature-Independent (Mass-dependent)"}
          </span>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-6">
        <button
          onClick={() => setMode("MOLARITY")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === "MOLARITY"
              ? "bg-[#C0222E] text-white shadow-xs"
              : "bg-[#FAFAFA] text-slate-600 hover:text-black border border-[#E5E5E5]"
          }`}
        >
          Molarity (M)
        </button>
        <button
          onClick={() => setMode("MOLALITY")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === "MOLALITY"
              ? "bg-[#C0222E] text-white shadow-xs"
              : "bg-[#FAFAFA] text-slate-600 hover:text-black border border-[#E5E5E5]"
          }`}
        >
          Molality (m)
        </button>
        <button
          onClick={() => setMode("MOLE_FRACTION")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === "MOLE_FRACTION"
              ? "bg-[#C0222E] text-white shadow-xs"
              : "bg-[#FAFAFA] text-slate-600 hover:text-black border border-[#E5E5E5]"
          }`}
        >
          Mole Fraction (x)
        </button>
        <button
          onClick={() => setMode("MASS_PERCENT")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === "MASS_PERCENT"
              ? "bg-[#C0222E] text-white shadow-xs"
              : "bg-[#FAFAFA] text-slate-600 hover:text-black border border-[#E5E5E5]"
          }`}
        >
          Mass % (w/w)
        </button>
        <button
          onClick={() => setMode("PPM")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            mode === "PPM"
              ? "bg-[#C0222E] text-white shadow-xs"
              : "bg-[#FAFAFA] text-slate-600 hover:text-black border border-[#E5E5E5]"
          }`}
        >
          Parts Per Million (ppm)
        </button>
      </div>

      {/* Grid: Inputs and Calculation Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Input Controls */}
        <div className="lg:col-span-7 space-y-3">
          <span className="text-xs font-bold text-black uppercase tracking-wider block">
            Adjust Parameters:
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Solute Mass */}
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Mass of Solute (w₂)</span>
                <span className="font-mono font-bold text-[#C0222E]">{soluteMass} g</span>
              </div>
              <input
                type="number"
                min={0.1}
                step={0.5}
                value={soluteMass}
                onChange={(e) => setSoluteMass(Math.max(0.01, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
              />
            </div>

            {/* Solute Molar Mass */}
            <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-700">Molar Mass Solute (M₂)</span>
                <span className="font-mono font-bold text-slate-600">{soluteMolarMass} g/mol</span>
              </div>
              <input
                type="number"
                min={1}
                value={soluteMolarMass}
                onChange={(e) => setSoluteMolarMass(Math.max(1, parseFloat(e.target.value) || 1))}
                className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
              />
            </div>

            {/* Mode-specific secondary input */}
            {mode === "MOLARITY" && (
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1 sm:col-span-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Volume of Solution (V)</span>
                  <span className="font-mono font-bold text-sky-600">{solutionVolume} mL</span>
                </div>
                <input
                  type="number"
                  min={10}
                  step={25}
                  value={solutionVolume}
                  onChange={(e) => setSolutionVolume(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
                />
              </div>
            )}

            {mode === "MOLALITY" && (
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1 sm:col-span-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Mass of Solvent (w₁)</span>
                  <span className="font-mono font-bold text-emerald-600">{solventMass} g</span>
                </div>
                <input
                  type="number"
                  min={10}
                  step={50}
                  value={solventMass}
                  onChange={(e) => setSolventMass(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
                />
              </div>
            )}

            {mode === "MOLE_FRACTION" && (
              <>
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Mass of Solvent (w₁)</span>
                    <span className="font-mono font-bold text-emerald-600">{solventMass} g</span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={solventMass}
                    onChange={(e) => setSolventMass(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">Solvent Molar Mass (M₁)</span>
                    <span className="font-mono font-bold text-slate-600">{solventMolarMass} g/mol</span>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={solventMolarMass}
                    onChange={(e) => setSolventMolarMass(Math.max(1, parseFloat(e.target.value) || 1))}
                    className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
                  />
                </div>
              </>
            )}

            {(mode === "MASS_PERCENT" || mode === "PPM") && (
              <div className="p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1 sm:col-span-2">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-700">Total Mass of Solution</span>
                  <span className="font-mono font-bold text-purple-600">{solutionMass} g</span>
                </div>
                <input
                  type="number"
                  min={1}
                  step={100}
                  value={solutionMass}
                  onChange={(e) => setSolutionMass(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
                />
              </div>
            )}
          </div>
        </div>

        {/* Calculation Result */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-5 flex flex-col justify-between gap-4 shadow-md">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-2">
              Calculated Value
            </div>

            {mode === "MOLARITY" && (
              <div>
                <div className="text-xs text-slate-300">Molarity (M)</div>
                <div className="text-3xl font-mono font-black text-white">
                  {molarity.toFixed(4)} <span className="text-sm font-normal text-slate-400">mol/L (or M)</span>
                </div>
              </div>
            )}

            {mode === "MOLALITY" && (
              <div>
                <div className="text-xs text-slate-300">Molality (m)</div>
                <div className="text-3xl font-mono font-black text-white">
                  {molality.toFixed(4)} <span className="text-sm font-normal text-slate-400">mol/kg (or m)</span>
                </div>
              </div>
            )}

            {mode === "MOLE_FRACTION" && (
              <div className="space-y-2">
                <div>
                  <div className="text-xs text-slate-300">Mole Fraction Solute (x₂)</div>
                  <div className="text-2xl font-mono font-black text-white">
                    {moleFractionSolute.toFixed(4)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-300">Mole Fraction Solvent (x₁)</div>
                  <div className="text-lg font-mono font-bold text-slate-300">
                    {moleFractionSolvent.toFixed(4)} <span className="text-xs text-emerald-400">(x₁ + x₂ = 1.000)</span>
                  </div>
                </div>
              </div>
            )}

            {mode === "MASS_PERCENT" && (
              <div>
                <div className="text-xs text-slate-300">Mass Percentage (% w/w)</div>
                <div className="text-3xl font-mono font-black text-white">
                  {massPercent.toFixed(3)} <span className="text-sm font-normal text-slate-400">%</span>
                </div>
              </div>
            )}

            {mode === "PPM" && (
              <div>
                <div className="text-xs text-slate-300">Parts Per Million (ppm)</div>
                <div className="text-3xl font-mono font-black text-white">
                  {ppm.toFixed(1)} <span className="text-sm font-normal text-slate-400">ppm</span>
                </div>
              </div>
            )}
          </div>

          {/* Step by Step Breakdown */}
          <div className="pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-300 space-y-1.5">
            <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
              Step-by-Step Substitution:
            </span>
            <div>• n₂ = {soluteMass}g / {soluteMolarMass}g·mol⁻¹ = {molesSolute.toFixed(4)} mol</div>
            {mode === "MOLARITY" && (
              <div>• M = {molesSolute.toFixed(4)} mol / {(solutionVolume / 1000).toFixed(3)} L = {molarity.toFixed(4)} M</div>
            )}
            {mode === "MOLALITY" && (
              <div>• m = {molesSolute.toFixed(4)} mol / {(solventMass / 1000).toFixed(3)} kg = {molality.toFixed(4)} m</div>
            )}
            {mode === "MOLE_FRACTION" && (
              <div>• n₁ = {solventMass}g / {solventMolarMass}g·mol⁻¹ = {molesSolvent.toFixed(4)} mol</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
