"use client";

import React, { useState, useMemo } from "react";
import {
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Info,
  FlaskConical,
} from "lucide-react";

export function ParticleSolutionSimulator() {
  const INITIAL_SOLVENT = 40;
  const INITIAL_SOLUTE = 8;
  const MAX_SOLVENT = 60;
  const MIN_SOLVENT = 20;
  const MAX_SOLUTE = 25;
  const MIN_SOLUTE = 0;

  const [solventCount, setSolventCount] = useState<number>(INITIAL_SOLVENT);
  const [soluteCount, setSoluteCount] = useState<number>(INITIAL_SOLUTE);
  const [isJittering, setIsJittering] = useState<boolean>(true);

  const handleReset = () => {
    setSolventCount(INITIAL_SOLVENT);
    setSoluteCount(INITIAL_SOLUTE);
  };

  const handleAddSolute = () => {
    setSoluteCount((prev) => Math.min(prev + 2, MAX_SOLUTE));
  };

  const handleRemoveSolute = () => {
    setSoluteCount((prev) => Math.max(prev - 2, MIN_SOLUTE));
  };

  const handleSolventChange = (newVal: number) => {
    setSolventCount(Math.max(MIN_SOLVENT, Math.min(MAX_SOLVENT, newVal)));
  };

  // Concentration calculations
  const totalParticles = solventCount + soluteCount;
  const soluteRatioPercent = totalParticles > 0
    ? ((soluteCount / totalParticles) * 100).toFixed(1)
    : "0.0";

  const concentrationState = useMemo(() => {
    if (soluteCount === 0) {
      return {
        label: "Pure Solvent",
        badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
        description:
          "Only solvent molecules are present. No solute is dissolved.",
      };
    }
    const ratio = soluteCount / solventCount;
    if (ratio < 0.1) {
      return {
        label: "Very Dilute Solution",
        badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
        description:
          "Small number of solute particles widely dispersed among solvent particles.",
      };
    }
    if (ratio <= 0.25) {
      return {
        label: "Moderately Dilute",
        badgeColor: "bg-teal-50 text-teal-700 border-teal-200",
        description:
          "Uniformly distributed solute particles with ample solvent separation.",
      };
    }
    if (ratio <= 0.45) {
      return {
        label: "Concentrated Solution",
        badgeColor: "bg-amber-50 text-amber-800 border-amber-200",
        description:
          "High density of solute particles interacting closely with solvent molecules.",
      };
    }
    return {
      label: "Near Saturation Limit",
      badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
      description:
        "High solute-to-solvent ratio. Solute particles occupy most intermolecular spaces.",
    };
  }, [soluteCount, solventCount]);

  // Generate uniformly intermingled particle positions (Homogeneity demonstration)
  // Deterministic pattern so it does not jump erratically on unrelated re-renders
  const particleList = useMemo(() => {
    const list: Array<{ id: string; type: "solute" | "solvent" }> = [];
    let solutePlaced = 0;
    let solventPlaced = 0;

    for (let i = 0; i < totalParticles; i++) {
      // Interleave solute evenly to simulate homogeneous mixing
      const targetSoluteRatio = soluteCount / totalParticles;
      const currentSoluteRatio = (solutePlaced + 1) / (i + 1);

      if (
        solutePlaced < soluteCount &&
        (currentSoluteRatio <= targetSoluteRatio || solventPlaced >= solventCount)
      ) {
        list.push({ id: `solute-${solutePlaced}`, type: "solute" });
        solutePlaced++;
      } else if (solventPlaced < solventCount) {
        list.push({ id: `solvent-${solventPlaced}`, type: "solvent" });
        solventPlaced++;
      }
    }
    return list;
  }, [soluteCount, solventCount, totalParticles]);

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-[#E5E5E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"
              style={{
                background: "var(--brand-tint)",
                color: "var(--brand)",
                border: "1px solid var(--brand-border)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>INTERACTIVE SIMULATOR</span>
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${concentrationState.badgeColor}`}
            >
              {concentrationState.label}
            </span>
          </div>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Molecular Particle Simulation
          </h4>
          <p className="text-xs text-[#555555]">
            Observe how solute particles uniformly disperse among solvent particles in a homogeneous mixture.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95"
          title="Reset simulation to default"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Simulator Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Particle Canvas / Beaker View */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Beaker Container */}
          <div className="w-full relative rounded-2xl border-2 border-slate-300 bg-slate-900/95 p-6 overflow-hidden shadow-inner flex flex-col items-center justify-center min-h-[300px]">
            {/* Beaker Measurement Marks */}
            <div className="absolute left-2 top-4 bottom-4 w-4 flex flex-col justify-between text-[9px] font-mono text-slate-400 select-none pointer-events-none">
              <span>60mL</span>
              <span>45mL</span>
              <span>30mL</span>
              <span>15mL</span>
            </div>

            {/* Particle Grid Container */}
            <div className="w-full pl-6 pr-2 flex flex-wrap items-center justify-center gap-2.5 max-w-sm py-4">
              {particleList.map((p, index) => {
                const isSolute = p.type === "solute";
                return (
                  <div
                    key={`${p.id}-${index}`}
                    className={`relative rounded-full transition-all duration-300 flex items-center justify-center select-none ${
                      isSolute
                        ? "w-6 h-6 bg-gradient-to-tr from-amber-500 to-rose-500 border-2 border-white shadow-sm ring-2 ring-rose-500/30"
                        : "w-5 h-5 bg-sky-500/80 border border-sky-300"
                    } ${isJittering ? "animate-pulse" : ""}`}
                    style={{
                      animationDuration: isSolute ? "2.5s" : "3.5s",
                      animationDelay: `${(index % 7) * 0.2}s`,
                    }}
                    title={
                      isSolute
                        ? `Solute Particle (Dissolved component)`
                        : `Solvent Particle (Liquid medium)`
                    }
                  >
                    {isSolute && (
                      <span className="text-[9px] font-black text-white leading-none">
                        S
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Liquid Surface Water Line Indicator */}
            <div className="absolute bottom-2 left-8 right-8 text-center">
              <span className="text-[10px] font-mono font-medium text-slate-400">
                Homogeneous Liquid Phase • Uniform Composition (&lt; 1 nm)
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="w-full mt-4 flex items-center justify-between text-xs text-[#555555] px-2 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-sky-500 border border-sky-300 flex-shrink-0" />
              <span>
                <strong>Solvent</strong> ({solventCount} particles)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 border border-white ring-1 ring-rose-400 flex-shrink-0 flex items-center justify-center text-[8px] text-white font-bold">
                S
              </div>
              <span>
                <strong>Solute</strong> ({soluteCount} particles)
              </span>
            </div>
            <button
              onClick={() => setIsJittering((prev) => !prev)}
              className="text-[11px] text-slate-500 hover:text-black underline cursor-pointer"
            >
              {isJittering ? "Pause Brownian motion" : "Resume motion"}
            </button>
          </div>
        </div>

        {/* Controls & Metrics Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Solute Control */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                Solute Amount (○)
              </span>
              <span className="text-xs font-mono font-black text-rose-600">
                {soluteCount} Particles
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={handleRemoveSolute}
                disabled={soluteCount <= MIN_SOLUTE}
                className="flex-1 py-2 rounded-xl text-xs font-bold bg-white border border-[#E5E5E5] text-black hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
              >
                <Minus className="w-3.5 h-3.5" />
                <span>Remove Solute</span>
              </button>
              <button
                onClick={handleAddSolute}
                disabled={soluteCount >= MAX_SOLUTE}
                className="flex-1 py-2 rounded-xl text-xs font-bold text-white hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1 cursor-pointer transition-all active:scale-95 shadow-2xs"
                style={{ background: "var(--brand)" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Solute</span>
              </button>
            </div>
          </div>

          {/* Solvent Control */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-black uppercase tracking-wider">
                Solvent Volume (●)
              </span>
              <span className="text-xs font-mono font-black text-sky-600">
                {solventCount} Particles
              </span>
            </div>
            <input
              type="range"
              min={MIN_SOLVENT}
              max={MAX_SOLVENT}
              step={5}
              value={solventCount}
              onChange={(e) => handleSolventChange(Number(e.target.value))}
              className="w-full accent-[#C0222E] cursor-pointer mt-1"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#555555]">
              <span>Low (20)</span>
              <span>Medium (40)</span>
              <span>High (60)</span>
            </div>
          </div>

          {/* Concentration Metric Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#E5E5E5] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#555555] font-medium flex items-center gap-1.5">
                <FlaskConical className="w-4 h-4 text-[#C0222E]" />
                Solute Particle Proportion
              </span>
              <span className="font-mono font-bold text-black text-sm">
                {soluteRatioPercent}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-500 via-amber-500 to-rose-600 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(Number(soluteRatioPercent) * 2.5, 100)}%` }}
              />
            </div>
            <p className="text-xs text-[#555555] leading-relaxed pt-1">
              {concentrationState.description}
            </p>
          </div>

          {/* Key Principle Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Homogeneity In Action:</strong> Notice how solute particles do not cluster at the bottom or top. In a true solution, thermal motion keeps them completely intermingled throughout.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
