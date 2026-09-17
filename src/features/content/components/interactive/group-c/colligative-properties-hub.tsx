"use client";

import React, { useState } from "react";
import { Layers, ArrowRight, Sparkles, Droplets, Flame, Snowflake, ShieldCheck } from "lucide-react";

interface ColligativePropDetail {
  id: string;
  name: string;
  symbol: string;
  formula: string;
  governingConstant: string;
  physicalCause: string;
  practicalApp: string;
  iconColor: string;
}

const COLLIGATIVE_PROPS: ColligativePropDetail[] = [
  {
    id: "rlvp",
    name: "Relative Lowering of Vapour Pressure",
    symbol: "(p₁° - p₁) / p₁°",
    formula: "(p₁° - p₁) / p₁° = x₂ = (w₂ · M₁) / (M₂ · w₁)",
    governingConstant: "Independent of solvent constants (equals x₂ directly)",
    physicalCause: "Non-volatile solute particles occupy liquid surface sites, reducing the rate of solvent molecule escape.",
    practicalApp: "Determining molecular mass of non-volatile solutes at room temperature.",
    iconColor: "text-sky-500",
  },
  {
    id: "ebullioscopy",
    name: "Elevation of Boiling Point (Ebullioscopy)",
    symbol: "ΔTb",
    formula: "ΔTb = Tb - Tb° = Kb · m = (1000 · Kb · w₂) / (M₂ · w₁)",
    governingConstant: "Kb (Molal elevation constant / Ebullioscopic constant)",
    physicalCause: "Because vapour pressure is lowered by solute, a higher temperature is needed to make vapour pressure equal atmospheric pressure.",
    practicalApp: "Radiator coolants and cooking in salted water.",
    iconColor: "text-amber-500",
  },
  {
    id: "cryoscopy",
    name: "Depression of Freezing Point (Cryoscopy)",
    symbol: "ΔTf",
    formula: "ΔTf = Tf° - Tf = Kf · m = (1000 · Kf · w₂) / (M₂ · w₁)",
    governingConstant: "Kf (Molal depression constant / Cryoscopic constant)",
    physicalCause: "At freezing point, liquid and solid have the same vapour pressure. Lowered liquid vapour pressure intersects solid curve at a lower temperature.",
    practicalApp: "Ethylene glycol antifreeze in vehicle engines; spreading rock salt or CaCl₂ on snow-covered roads.",
    iconColor: "text-cyan-500",
  },
  {
    id: "osmometry",
    name: "Osmotic Pressure (Osmometry)",
    symbol: "π",
    formula: "π = C · R · T = (w₂ · R · T) / (M₂ · V)",
    governingConstant: "R (Universal gas constant = 0.0821 L·atm·K⁻¹·mol⁻¹)",
    physicalCause: "Chemical potential difference across a semipermeable membrane drives solvent flow until balanced by hydrostatic pressure.",
    practicalApp: "Gold standard method for determining molar mass of proteins, polymers, and biomolecules at room temperature.",
    iconColor: "text-emerald-500",
  },
];

export function ColligativePropertiesHub() {
  const [activePropId, setActivePropId] = useState<string>("rlvp");

  const active = COLLIGATIVE_PROPS.find((p) => p.id === activePropId) || COLLIGATIVE_PROPS[0];

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
            <span>COLLIGATIVE PROPERTIES HUB</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            The 4 Fundamental Colligative Properties
          </h4>
          <p className="text-xs text-[#555555]">
            All 4 properties depend exclusively on the number of solute particles, irrespective of their chemical nature.
          </p>
        </div>
      </div>

      {/* Central Interactive Grid of 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {COLLIGATIVE_PROPS.map((prop) => {
          const isSelected = prop.id === activePropId;

          return (
            <div
              key={prop.id}
              onClick={() => setActivePropId(prop.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 select-none ${
                isSelected
                  ? "border-[#C0222E] bg-rose-50/20 shadow-xs ring-1 ring-[#C0222E]/20"
                  : "border-[#E5E5E5] bg-[#FAFAFA] hover:border-slate-300 hover:bg-white"
              }`}
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Symbol: {prop.symbol}
                </span>
                <h5 className="text-xs font-bold text-black leading-snug">
                  {prop.name}
                </h5>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                <span>Inspect &rarr;</span>
                {isSelected && <span className="w-2 h-2 rounded-full bg-[#C0222E]" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive Panel for Selected Property */}
      <div className="p-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
          <span className="text-sm font-bold text-black">{active.name}</span>
          <span className="text-xs font-mono font-bold text-[#C0222E]">{active.symbol}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5] space-y-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
              Core Working Equation
            </span>
            <div className="font-mono font-bold text-[#C0222E] text-xs">
              {active.formula}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5] space-y-1">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
              Constant & Dependency
            </span>
            <div className="text-slate-700">
              {active.governingConstant}
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-[#E5E5E5]">
          <strong className="text-black">Microscopic Physical Origin: </strong>
          {active.physicalCause}
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
          <div>
            <strong>CBSE Practical Importance: </strong>
            {active.practicalApp}
          </div>
        </div>
      </div>
    </div>
  );
}
