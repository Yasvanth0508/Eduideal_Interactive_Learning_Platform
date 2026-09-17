"use client";

import React, { useState } from "react";
import { GitFork, Link2, Sparkles, AlertCircle, ArrowRight } from "lucide-react";

type Mode = "DISSOCIATION_NACL" | "DISSOCIATION_MGCL2" | "ASSOCIATION_ACETIC_ACID";

export function AssociationDissociationVisualizer() {
  const [mode, setMode] = useState<Mode>("DISSOCIATION_NACL");

  const modeConfig = {
    DISSOCIATION_NACL: {
      name: "NaCl in Water (Electrolyte Dissociation)",
      formula: "NaCl(s) → Na⁺(aq) + Cl⁻(aq)",
      particlesPerFormula: 2,
      normalMass: 58.5,
      abnormalMass: 29.25,
      behavior: "Dissociation",
      summary: "1 mole of NaCl breaks into 2 moles of ions in solution. Total number of particles doubles.",
      reason: "Colligative property ∝ number of particles. Since particle count doubles, measured ΔT or Π doubles, resulting in apparent Molar Mass being halved.",
      iValue: "2.0 (complete dissociation)",
    },
    DISSOCIATION_MGCL2: {
      name: "MgCl₂ in Water (Ternary Electrolyte)",
      formula: "MgCl₂(s) → Mg²⁺(aq) + 2Cl⁻(aq)",
      particlesPerFormula: 3,
      normalMass: 95.2,
      abnormalMass: 31.73,
      behavior: "Dissociation",
      summary: "1 formula unit produces 3 ions (1 Mg²⁺ + 2 Cl⁻). Colligative effect triples.",
      reason: "Measured colligative property is 3× higher. Apparent Molar Mass = M_normal / 3.",
      iValue: "3.0 (complete dissociation)",
    },
    ASSOCIATION_ACETIC_ACID: {
      name: "Ethanoic Acid (CH₃COOH) in Benzene",
      formula: "2 CH₃COOH ⇌ (CH₃COOH)₂ (Dimer)",
      particlesPerFormula: 0.5,
      normalMass: 60.0,
      abnormalMass: 120.0,
      behavior: "Association (Dimerization)",
      summary: "Two molecules associate into a single dimer held by two intermolecular hydrogen bonds.",
      reason: "Effective particle count is cut by half. Therefore, colligative effect is halved and calculated molar mass is doubled (~120 g/mol).",
      iValue: "0.5 (complete dimerization)",
    },
  };

  const current = modeConfig[mode];

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      <div className="pb-5 border-b border-[#E5E5E5] mb-6">
        <span
          className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 mb-1.5"
          style={{
            background: "var(--brand-tint)",
            color: "var(--brand)",
            border: "1px solid var(--brand-border)",
          }}
        >
          <GitFork className="w-3.5 h-3.5" />
          <span>ABNORMAL MOLAR MASS EXPLORER</span>
        </span>
        <h4 className="text-xl font-bold text-black tracking-tight">
          Molecular Association vs. Dissociation in Solutions
        </h4>
        <p className="text-xs text-[#555555]">
          Discover why experimental molar masses calculated from colligative properties deviate from theoretical molecular weights.
        </p>
      </div>

      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
        <button
          onClick={() => setMode("DISSOCIATION_NACL")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
            mode === "DISSOCIATION_NACL"
              ? "bg-[#C0222E] text-white shadow-sm"
              : "bg-[#F8F9FA] text-[#555555] hover:bg-neutral-100 border border-[#E5E5E5]"
          }`}
        >
          <GitFork className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-bold">NaCl in Water</div>
            <div className="text-[10px] opacity-80">Dissociation (i = 2)</div>
          </div>
        </button>

        <button
          onClick={() => setMode("DISSOCIATION_MGCL2")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
            mode === "DISSOCIATION_MGCL2"
              ? "bg-[#C0222E] text-white shadow-sm"
              : "bg-[#F8F9FA] text-[#555555] hover:bg-neutral-100 border border-[#E5E5E5]"
          }`}
        >
          <GitFork className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-bold">MgCl₂ in Water</div>
            <div className="text-[10px] opacity-80">Dissociation (i = 3)</div>
          </div>
        </button>

        <button
          onClick={() => setMode("ASSOCIATION_ACETIC_ACID")}
          className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left flex items-center gap-2 cursor-pointer ${
            mode === "ASSOCIATION_ACETIC_ACID"
              ? "bg-[#C0222E] text-white shadow-sm"
              : "bg-[#F8F9FA] text-[#555555] hover:bg-neutral-100 border border-[#E5E5E5]"
          }`}
        >
          <Link2 className="w-4 h-4 flex-shrink-0" />
          <div>
            <div className="font-bold">CH₃COOH in Benzene</div>
            <div className="text-[10px] opacity-80">Association (Dimer, i = 0.5)</div>
          </div>
        </button>
      </div>

      {/* Visual Simulation Display */}
      <div className="p-6 rounded-2xl bg-[#1A1D20] text-white border border-neutral-800 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-neutral-800 mb-5">
          <div>
            <span className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
              {current.behavior}
            </span>
            <h5 className="text-base font-bold text-white mt-0.5">{current.formula}</h5>
          </div>
          <div className="bg-neutral-800/90 px-3 py-1.5 rounded-lg border border-neutral-700 text-right">
            <span className="text-[10px] text-neutral-400 block">Van &apos;t Hoff Factor (i)</span>
            <span className="text-xs font-mono font-bold text-amber-400">{current.iValue}</span>
          </div>
        </div>

        {/* Visual Particle Cluster representation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider block mb-2">
              Before Solution (Pure Solute)
            </span>
            <div className="h-28 flex items-center justify-center gap-4">
              {mode === "ASSOCIATION_ACETIC_ACID" ? (
                <>
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-mono">
                    CH₃COOH (M₁ = 60)
                  </div>
                  <div className="p-2.5 rounded-lg bg-rose-950/80 border border-rose-700 text-rose-300 text-xs font-mono">
                    CH₃COOH (M₂ = 60)
                  </div>
                </>
              ) : mode === "DISSOCIATION_NACL" ? (
                <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-700 text-sky-300 text-xs font-mono flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded bg-sky-800 text-white font-bold">Na</span>
                  <span className="text-neutral-400">+</span>
                  <span className="px-2 py-1 rounded bg-emerald-800 text-white font-bold">Cl</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-sky-950/80 border border-sky-700 text-sky-300 text-xs font-mono flex items-center gap-1.5">
                  <span className="px-2 py-1 rounded bg-purple-800 text-white font-bold">Mg</span>
                  <span className="text-neutral-400">+</span>
                  <span className="px-2 py-1 rounded bg-emerald-800 text-white font-bold">2Cl</span>
                </div>
              )}
            </div>
            <span className="text-[11px] text-neutral-400">Normal Molar Mass = <strong className="text-white">{current.normalMass} g/mol</strong></span>
          </div>

          <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-center">
            <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider block mb-2">
              In Solution (Dissolved State)
            </span>
            <div className="h-28 flex items-center justify-center gap-3">
              {mode === "ASSOCIATION_ACETIC_ACID" ? (
                <div className="p-3 rounded-xl bg-amber-950/70 border-2 border-dashed border-amber-500 text-amber-300 text-xs font-mono flex flex-col items-center gap-1">
                  <div className="flex items-center gap-2">
                    <span>CH₃—C(=O)—O—H</span>
                    <span className="text-neutral-400 font-bold">···</span>
                    <span>O=C</span>
                  </div>
                  <div className="text-[10px] text-amber-400 font-bold">Dimerized via 2 H-Bonds</div>
                </div>
              ) : mode === "DISSOCIATION_NACL" ? (
                <div className="flex items-center gap-4">
                  <div className="p-2.5 rounded-lg bg-sky-700 text-white text-xs font-mono font-bold shadow-md">
                    Na⁺ (Hydrated)
                  </div>
                  <div className="p-2.5 rounded-lg bg-emerald-700 text-white text-xs font-mono font-bold shadow-md">
                    Cl⁻ (Hydrated)
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-700 text-white text-[11px] font-mono font-bold">
                    Mg²⁺
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white text-[11px] font-mono font-bold">
                    Cl⁻
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-700 text-white text-[11px] font-mono font-bold">
                    Cl⁻
                  </div>
                </div>
              )}
            </div>
            <span className="text-[11px] text-amber-300">Observed Apparent Mass = <strong className="text-white">{current.abnormalMass} g/mol</strong></span>
          </div>
        </div>

        <p className="text-xs text-neutral-300 leading-relaxed mt-2">
          {current.reason}
        </p>
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
          <span className="text-xs font-bold text-[#888888] uppercase block mb-1">Theoretical Molar Mass</span>
          <div className="text-xl font-bold font-mono text-black">{current.normalMass} g/mol</div>
          <span className="text-[11px] text-[#555555] mt-1 block">From periodic table sum</span>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-200">
          <span className="text-xs font-bold text-rose-900 uppercase block mb-1">Observed (Abnormal) Mass</span>
          <div className="text-xl font-bold font-mono text-rose-700">{current.abnormalMass} g/mol</div>
          <span className="text-[11px] text-rose-800 mt-1 block">Calculated via colligative property</span>
        </div>

        <div className="p-4 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
          <span className="text-xs font-bold text-[#888888] uppercase block mb-1">Relationship Formula</span>
          <div className="text-xs font-mono font-bold text-black mt-2">
            M_observed = M_normal / i
          </div>
          <span className="text-[11px] text-[#555555] mt-1 block">i = Normal Mass / Abnormal Mass</span>
        </div>
      </div>
    </div>
  );
}
