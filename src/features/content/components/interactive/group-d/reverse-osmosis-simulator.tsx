"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, ShieldCheck, ArrowRight, ArrowLeft, ArrowDown } from "lucide-react";

export function ReverseOsmosisSimulator() {
  const [appliedPressure, setAppliedPressure] = useState<number>(35); // atm
  const osmoticPressure = 26; // atm (typical seawater osmotic pressure ~26 atm)
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [freshwaterLevel, setFreshwaterLevel] = useState<number>(45); // %
  const [seawaterLevel, setSeawaterLevel] = useState<number>(55); // %

  const isReverseOsmosis = appliedPressure > osmoticPressure;
  const isEquilibrium = appliedPressure === osmoticPressure;
  const isNaturalOsmosis = appliedPressure < osmoticPressure;

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        if (isReverseOsmosis) {
          // Water flows from Seawater -> Freshwater
          setFreshwaterLevel((f) => (f < 70 ? f + 0.3 : f));
          setSeawaterLevel((s) => (s > 30 ? s - 0.3 : s));
        } else if (isNaturalOsmosis) {
          // Water flows from Freshwater -> Seawater
          setFreshwaterLevel((f) => (f > 25 ? f - 0.3 : f));
          setSeawaterLevel((s) => (s < 75 ? s + 0.3 : s));
        }
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, isReverseOsmosis, isNaturalOsmosis]);

  const handleReset = () => {
    setIsRunning(false);
    setFreshwaterLevel(45);
    setSeawaterLevel(55);
  };

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5] mb-6">
        <div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 mb-1.5"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DESALINATION SIMULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Reverse Osmosis (RO) & Desalination of Seawater
          </h4>
          <p className="text-xs text-[#555555]">
            Apply hydrostatic pressure <span className="font-mono font-bold">P</span> on the saline solution. When <span className="font-mono font-bold">P &gt; &Pi;</span>, pure water molecules are forced through the polymer membrane.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isRunning
                ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                : "bg-[#C0222E] text-white hover:bg-[#a01c26] shadow-sm"
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? "Pause Flow" : "Start RO Flow"}</span>
          </button>
          <button
            onClick={handleReset}
            className="p-2 rounded-xl border border-[#E5E5E5] hover:bg-neutral-50 text-[#555555] transition-colors cursor-pointer"
            title="Reset Levels"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Applied Pressure Control */}
      <div className="bg-[#F8F9FA] rounded-2xl p-4 border border-[#E5E5E5] mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Applied Piston Pressure (P)
            </span>
            <span
              className={`text-xs font-mono font-bold px-2 py-0.5 rounded-md ${
                isReverseOsmosis
                  ? "bg-emerald-100 text-emerald-800"
                  : isEquilibrium
                  ? "bg-sky-100 text-sky-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {appliedPressure} atm ({isReverseOsmosis ? "P > Π (Reverse Osmosis Active)" : isEquilibrium ? "P = Π (Equilibrium)" : "P < Π (Natural Osmosis)"})
            </span>
          </div>
          <span className="text-xs text-[#555555]">
            Osmotic Pressure of Seawater (&Pi;) = <span className="font-mono font-bold text-black">{osmoticPressure} atm</span>
          </span>
        </div>
        <input
          type="range"
          min={5}
          max={60}
          step={1}
          value={appliedPressure}
          onChange={(e) => setAppliedPressure(Number(e.target.value))}
          className="w-full accent-[#C0222E] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#888888] mt-1">
          <span>5 atm (Low Pressure)</span>
          <span className="font-bold text-rose-600">26 atm (Equilibrium &Pi;)</span>
          <span className="font-bold text-emerald-600">60 atm (Industrial RO Desalination)</span>
        </div>
      </div>

      {/* Simulation Vessel Graphic */}
      <div className="relative bg-[#1A1D20] rounded-2xl p-6 overflow-hidden border border-neutral-800">
        <div className="grid grid-cols-2 gap-4 h-64 relative">
          
          {/* Left Chamber: Saline Water / Seawater under Piston */}
          <div className="relative border-r-4 border-dashed border-emerald-400/80 bg-blue-950/20 rounded-l-xl overflow-hidden flex flex-col justify-end">
            <div className="absolute top-2 left-3 z-10">
              <span className="text-[11px] font-bold text-sky-300 uppercase tracking-wide bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                Seawater / Brine Solution
              </span>
              <p className="text-[10px] text-neutral-400 mt-0.5">High solute conc. + Applied pressure</p>
            </div>

            {/* Piston graphic */}
            <div
              className="absolute left-0 right-0 z-20 bg-neutral-600 border-b-4 border-neutral-400 transition-all duration-300 flex items-center justify-center"
              style={{
                top: `${Math.max(10, 100 - seawaterLevel - 15)}%`,
                height: "18px",
              }}
            >
              <div className="flex items-center gap-1 text-[9px] font-mono text-white font-bold">
                <ArrowDown className="w-3 h-3 text-emerald-400" />
                <span>PISTON P = {appliedPressure} atm</span>
              </div>
            </div>

            {/* Seawater Liquid body */}
            <div
              className="w-full bg-gradient-to-t from-sky-900/80 to-sky-700/60 transition-all duration-300 relative"
              style={{ height: `${seawaterLevel}%` }}
            >
              {/* Solute (NaCl) particles */}
              <div className="absolute inset-0 flex flex-wrap gap-2 p-3 justify-center items-center opacity-70 pointer-events-none">
                {Array.from({ length: 18 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-xs border border-amber-600 inline-block animate-pulse"
                    style={{ animationDuration: `${1.5 + (i % 3) * 0.5}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Semi-Permeable Membrane indicator in middle */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-emerald-500/90 text-white font-mono text-[9px] font-bold py-1 px-2 rounded shadow-md uppercase tracking-wider mb-2 whitespace-nowrap">
              SPM (Cellulose Acetate)
            </div>
            <div className="flex flex-col items-center gap-1">
              {isReverseOsmosis ? (
                <div className="flex items-center gap-0.5 text-emerald-400 text-xs font-bold animate-pulse">
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-[10px] font-mono">H2O</span>
                </div>
              ) : isNaturalOsmosis ? (
                <div className="flex items-center gap-0.5 text-rose-400 text-xs font-bold animate-pulse">
                  <span className="text-[10px] font-mono">H2O</span>
                  <ArrowLeft className="w-5 h-5" />
                </div>
              ) : (
                <span className="text-[10px] font-mono text-neutral-400">Equilibrium</span>
              )}
            </div>
          </div>

          {/* Right Chamber: Pure Freshwater Outlet */}
          <div className="relative bg-emerald-950/20 rounded-r-xl overflow-hidden flex flex-col justify-end">
            <div className="absolute top-2 right-3 z-10 text-right">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wide bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                Freshwater / Desalinated Water
              </span>
              <p className="text-[10px] text-neutral-400 mt-0.5">Pure solvent permeating out</p>
            </div>

            {/* Freshwater Liquid body */}
            <div
              className="w-full bg-gradient-to-t from-emerald-600/70 to-teal-400/50 transition-all duration-300 relative"
              style={{ height: `${freshwaterLevel}%` }}
            >
              {/* Pure water droplets */}
              <div className="absolute inset-0 flex flex-wrap gap-3 p-3 justify-center items-center opacity-60">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-white inline-block shadow-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Legend / Status Bar */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-300">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-amber-600" />
              <span className="text-[11px]">Salt Ions (Na+, Cl-) [Blocked]</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-white" />
              <span className="text-[11px]">Water Molecules (H2O) [Permeable]</span>
            </div>
          </div>
          <div className="font-mono text-[11px] text-emerald-400">
            {isReverseOsmosis
              ? "✓ Net Flow: Seawater → Fresh Water (Desalination)"
              : isNaturalOsmosis
              ? "⚠ Net Flow: Fresh Water → Seawater (Dilution)"
              : "⇌ No Net Flow (Dynamic Balance)"}
          </div>
        </div>
      </div>

      {/* NCERT Concept Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs">
          <span className="font-bold text-black block mb-1">Cellulose Acetate Membrane</span>
          <p className="text-[#555555] leading-relaxed">
            The membrane is permeable to water but impermeable to impurities and dissolved ions. It is supported over suitable porous backing to withstand high pressures (often 40–70 atm).
          </p>
        </div>
        <div className="p-3.5 rounded-xl bg-neutral-50 border border-[#E5E5E5] text-xs">
          <span className="font-bold text-black block mb-1">Industrial & Domestic Significance</span>
          <p className="text-[#555555] leading-relaxed">
            Widely deployed across arid coastal regions (e.g., Middle East, desalination plants) to supply potable drinking water directly from oceans, as well as in household RO purifiers.
          </p>
        </div>
      </div>
    </div>
  );
}
