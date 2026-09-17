"use client";

import React, { useState } from "react";
import { Layers, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export function IdealVsNonIdealComparator() {
  const [selectedType, setSelectedType] = useState<"IDEAL" | "POSITIVE" | "NEGATIVE">("IDEAL");

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
            <Layers className="w-3.5 h-3.5" />
            <span>THERMODYNAMIC COMPARISON</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Ideal vs. Non-Ideal Solutions Explorer
          </h4>
          <p className="text-xs text-[#555555]">
            Compare molecular interactions, enthalpy of mixing, and volume changes across solution classes.
          </p>
        </div>

        {/* Category Switcher */}
        <div className="flex items-center gap-1.5 bg-[#FAFAFA] p-1 rounded-xl border border-[#E5E5E5] self-start sm:self-center">
          <button
            onClick={() => setSelectedType("IDEAL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "IDEAL"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "text-slate-600 hover:text-black"
            }`}
          >
            Ideal Solution
          </button>
          <button
            onClick={() => setSelectedType("POSITIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "POSITIVE"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "text-slate-600 hover:text-black"
            }`}
          >
            +ve Deviation
          </button>
          <button
            onClick={() => setSelectedType("NEGATIVE")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedType === "NEGATIVE"
                ? "bg-[#C0222E] text-white shadow-2xs"
                : "text-slate-600 hover:text-black"
            }`}
          >
            -ve Deviation
          </button>
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Intermolecular Attractions */}
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Intermolecular Forces
          </span>
          <div className="text-sm font-bold text-black">
            {selectedType === "IDEAL" && "A—B ≈ A—A ≈ B—B"}
            {selectedType === "POSITIVE" && "A—B < A—A or B—B (Weaker)"}
            {selectedType === "NEGATIVE" && "A—B > A—A or B—B (Stronger)"}
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            {selectedType === "IDEAL" && "Interactions between unlike molecules are virtually identical to pure like molecules."}
            {selectedType === "POSITIVE" && "Molecules experience weaker attractions after mixing, escaping into vapour phase more easily."}
            {selectedType === "NEGATIVE" && "New stronger interactions (e.g. hydrogen bonding) form upon mixing, holding molecules tightly in liquid."}
          </p>
        </div>

        {/* Enthalpy of Mixing */}
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Enthalpy of Mixing (ΔH_mix)
          </span>
          <div className="text-sm font-bold text-black">
            {selectedType === "IDEAL" && "ΔH_mix = 0 (Athermal)"}
            {selectedType === "POSITIVE" && "ΔH_mix > 0 (Endothermic, absorbs heat)"}
            {selectedType === "NEGATIVE" && "ΔH_mix < 0 (Exothermic, releases heat)"}
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            {selectedType === "IDEAL" && "No heat is absorbed or evolved when the components are mixed."}
            {selectedType === "POSITIVE" && "Heat is required to break the strong pure interactions (mixture cools down slightly)."}
            {selectedType === "NEGATIVE" && "Heat is released due to new bond formation (e.g. mixing chloroform with acetone warms up)."}
          </p>
        </div>

        {/* Volume Change */}
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
            Volume of Mixing (ΔV_mix)
          </span>
          <div className="text-sm font-bold text-black">
            {selectedType === "IDEAL" && "ΔV_mix = 0"}
            {selectedType === "POSITIVE" && "ΔV_mix > 0 (Volume Expands)"}
            {selectedType === "NEGATIVE" && "ΔV_mix < 0 (Volume Contracts)"}
          </div>
          <p className="text-xs text-[#555555] leading-relaxed">
            {selectedType === "IDEAL" && "Total volume equals the exact sum of individual liquid volumes (e.g. 50mL + 50mL = 100mL)."}
            {selectedType === "POSITIVE" && "Weaker A-B forces mean molecules sit further apart; total volume slightly exceeds 100mL."}
            {selectedType === "NEGATIVE" && "Stronger A-B attraction pulls molecules closer together; total volume is slightly less than 100mL."}
          </p>
        </div>
      </div>

      {/* Canonical NCERT Examples Bar */}
      <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950">
        <div>
          <strong>Classic CBSE NCERT Examples: </strong>
          {selectedType === "IDEAL" && "n-hexane + n-heptane, bromoethane + chloroethane, benzene + toluene."}
          {selectedType === "POSITIVE" && "Ethanol + Acetone, Carbon disulfide (CS₂) + Acetone, Ethanol + Water."}
          {selectedType === "NEGATIVE" && "Chloroform + Acetone (H-bonding forms), Phenol + Aniline, HNO₃ + Water."}
        </div>
      </div>
    </div>
  );
}
