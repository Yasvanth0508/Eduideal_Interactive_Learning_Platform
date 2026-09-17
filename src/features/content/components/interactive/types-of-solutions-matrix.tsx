"use client";

import React, { useState } from "react";
import { Layers, Check } from "lucide-react";

type SolutionCategory = "ALL" | "GASEOUS" | "LIQUID" | "SOLID";

interface SolutionTypeItem {
  id: string;
  category: "GASEOUS" | "LIQUID" | "SOLID";
  solute: string;
  solvent: string;
  example: string;
  commonExamples: string[];
  particleVisual: {
    soluteColor: string;
    solventColor: string;
    soluteDesc: string;
    solventDesc: string;
  };
  examTip: string;
}

const SOLUTION_TYPES: SolutionTypeItem[] = [
  // Gaseous Solutions (Solvent is Gas)
  {
    id: "gas-in-gas",
    category: "GASEOUS",
    solute: "Gas",
    solvent: "Gas",
    example: "Mixture of Oxygen (O₂) and Nitrogen (N₂) gases (Air)",
    commonExamples: ["Atmospheric air (78% N₂, 21% O₂)", "Helium-Oxygen mixture for deep-sea divers"],
    particleVisual: {
      soluteColor: "bg-amber-400",
      solventColor: "bg-sky-400",
      soluteDesc: "Gas molecules freely roaming with high kinetic energy",
      solventDesc: "Surrounding gas molecules forming continuous medium",
    },
    examTip: "All gas mixtures are completely miscible and form true homogeneous solutions at any ratio.",
  },
  {
    id: "liquid-in-gas",
    category: "GASEOUS",
    solute: "Liquid",
    solvent: "Gas",
    example: "Chloroform (CHCl₃) vapors mixed with Nitrogen (N₂) gas",
    commonExamples: ["Water vapor in air (Atmospheric humidity)", "Perfume vapors in room air"],
    particleVisual: {
      soluteColor: "bg-rose-400",
      solventColor: "bg-sky-400",
      soluteDesc: "Evaporated liquid micro-droplets/vapors dispersed molecularly",
      solventDesc: "Bulk gaseous nitrogen carrier",
    },
    examTip: "Frequently tested in CBSE multiple choice questions: Chloroform in N₂ gas is Liquid in Gas.",
  },
  {
    id: "solid-in-gas",
    category: "GASEOUS",
    solute: "Solid",
    solvent: "Gas",
    example: "Camphor vapors in Nitrogen (N₂) gas",
    commonExamples: ["Sublimed Iodine vapors in air", "Naphthalene balls subliming in air"],
    particleVisual: {
      soluteColor: "bg-purple-400",
      solventColor: "bg-sky-400",
      soluteDesc: "Sublimed solid molecules dispersed in gaseous matrix",
      solventDesc: "Bulk carrier gas",
    },
    examTip: "Camphor sublimes directly from solid to vapor, dispersing homogeneously in nitrogen gas.",
  },

  // Liquid Solutions (Solvent is Liquid)
  {
    id: "gas-in-liquid",
    category: "LIQUID",
    solute: "Gas",
    solvent: "Liquid",
    example: "Oxygen (O₂) dissolved in Water, or Carbon dioxide (CO₂) in Soda Water",
    commonExamples: ["Dissolved oxygen vital for aquatic life", "CO₂ in carbonated aerated drinks"],
    particleVisual: {
      soluteColor: "bg-amber-400",
      solventColor: "bg-blue-500",
      soluteDesc: "Dissolved gas molecules interacting with water molecules",
      solventDesc: "Liquid water forming solvent cage",
    },
    examTip: "The solubility of gas in liquid is governed by Henry's Law (studied in Topic 8).",
  },
  {
    id: "liquid-in-liquid",
    category: "LIQUID",
    solute: "Liquid",
    solvent: "Liquid",
    example: "Ethanol (C₂H₅OH) dissolved in Water",
    commonExamples: ["Alcoholic beverages", "Methanol in water", "Acetic acid in water (Vinegar)"],
    particleVisual: {
      soluteColor: "bg-emerald-400",
      solventColor: "bg-blue-500",
      soluteDesc: "Liquid ethanol molecules forming hydrogen bonds with water",
      solventDesc: "Bulk liquid water medium",
    },
    examTip: "Ethanol and water mix in all proportions because both form intermolecular hydrogen bonds.",
  },
  {
    id: "solid-in-liquid",
    category: "LIQUID",
    solute: "Solid",
    solvent: "Liquid",
    example: "Glucose or Sodium Chloride (NaCl) dissolved in Water",
    commonExamples: ["Saline IV drip (0.9% NaCl in water)", "Sugar syrup"],
    particleVisual: {
      soluteColor: "bg-amber-500",
      solventColor: "bg-blue-500",
      soluteDesc: "Dissociated Na⁺ and Cl⁻ ions hydrated by water dipoles",
      solventDesc: "Bulk aqueous liquid water",
    },
    examTip: "This is the most common type of solution encountered in CBSE laboratory experiments and colligative property problems.",
  },

  // Solid Solutions (Solvent is Solid)
  {
    id: "gas-in-solid",
    category: "SOLID",
    solute: "Gas",
    solvent: "Solid",
    example: "Solution of Hydrogen (H₂) gas in Palladium (Pd) metal",
    commonExamples: ["Hydrogen occluded in Platinum or Palladium", "Gases trapped in volcanic pumice stone"],
    particleVisual: {
      soluteColor: "bg-sky-400",
      solventColor: "bg-slate-600",
      soluteDesc: "Small hydrogen atoms interstitial within metal lattice",
      solventDesc: "Solid palladium crystal lattice",
    },
    examTip: "★ High-yield CBSE Board Question: H₂ in Pd is an interstitial solid solution where solute is gas and solvent is solid.",
  },
  {
    id: "liquid-in-solid",
    category: "SOLID",
    solute: "Liquid",
    solvent: "Solid",
    example: "Amalgam of Mercury with Sodium (Na-Hg)",
    commonExamples: ["Dental amalgam (liquid Hg in solid silver/tin alloy)", "Zinc amalgam (Zn-Hg)"],
    particleVisual: {
      soluteColor: "bg-rose-400",
      solventColor: "bg-slate-600",
      soluteDesc: "Liquid mercury atoms diffusing into solid metal matrix",
      solventDesc: "Solid sodium/silver bulk lattice",
    },
    examTip: "Mercury is liquid at room temperature; when mixed with solid metals, it forms an amalgam (Liquid in Solid).",
  },
  {
    id: "solid-in-solid",
    category: "SOLID",
    solute: "Solid",
    solvent: "Solid",
    example: "Copper dissolved in Gold (22-carat gold), or Brass (Zn in Cu)",
    commonExamples: ["Brass (30% Zn in 70% Cu)", "Bronze (Sn in Cu)", "German silver (Cu + Zn + Ni)"],
    particleVisual: {
      soluteColor: "bg-amber-400",
      solventColor: "bg-amber-600",
      soluteDesc: "Solute metal atoms substituting in host crystal positions",
      solventDesc: "Host solid metal crystal lattice",
    },
    examTip: "Alloys are substitutional or interstitial solid solutions with uniform composition throughout the metallic grain.",
  },
];

export function TypesOfSolutionsMatrix() {
  const [activeCategory, setActiveCategory] = useState<SolutionCategory>("ALL");
  const [selectedTypeId, setSelectedTypeId] = useState<string>("gas-in-solid");

  const filteredList =
    activeCategory === "ALL"
      ? SOLUTION_TYPES
      : SOLUTION_TYPES.filter((item) => item.category === activeCategory);

  const selectedItem =
    SOLUTION_TYPES.find((item) => item.id === selectedTypeId) ||
    SOLUTION_TYPES[0];

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      {/* Widget Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#E5E5E5]">
        <div>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 inline-flex mb-1"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>INTERACTIVE NCERT MATRIX (TABLE 1.1)</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            The 9 Types of Binary Solutions
          </h4>
          <p className="text-xs text-[#555555]">
            Filter by solvent class and click each card to explore its particle architecture and CBSE exam importance.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-[#FAFAFA] p-1 rounded-xl border border-[#E5E5E5] self-start sm:self-center">
          <button
            onClick={() => setActiveCategory("ALL")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === "ALL"
                ? "bg-white text-black shadow-xs font-bold"
                : "text-slate-500 hover:text-black"
            }`}
          >
            All (9)
          </button>
          <button
            onClick={() => setActiveCategory("GASEOUS")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === "GASEOUS"
                ? "bg-white text-black shadow-xs font-bold"
                : "text-slate-500 hover:text-black"
            }`}
          >
            Gaseous (3)
          </button>
          <button
            onClick={() => setActiveCategory("LIQUID")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === "LIQUID"
                ? "bg-white text-black shadow-xs font-bold"
                : "text-slate-500 hover:text-black"
            }`}
          >
            Liquid (3)
          </button>
          <button
            onClick={() => setActiveCategory("SOLID")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === "SOLID"
                ? "bg-white text-black shadow-xs font-bold"
                : "text-slate-500 hover:text-black"
            }`}
          >
            Solid (3)
          </button>
        </div>
      </div>

      {/* Main Layout: List on Left, Active Detail on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Solution Cards Grid */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredList.map((item) => {
            const isSelected = item.id === selectedTypeId;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedTypeId(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between gap-3 select-none ${
                  isSelected
                    ? "border-[#C0222E] bg-rose-50/20 shadow-xs ring-1 ring-[#C0222E]/20"
                    : "border-[#E5E5E5] bg-[#FAFAFA] hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                      {item.category} SOLUTION
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected
                          ? "bg-[#C0222E] text-white"
                          : "bg-slate-200/80 text-slate-700"
                      }`}
                    >
                      {item.solute} in {item.solvent}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-black line-clamp-2">
                    {item.example}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-[#555555] pt-2 border-t border-slate-100">
                  <span>Click to inspect &rarr;</span>
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-[#C0222E]" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Solution Detail Inspector Panel */}
        <div className="lg:col-span-5 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] p-5 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-3">
            <span className="text-xs font-mono font-bold text-[#C0222E] uppercase tracking-wider">
              {selectedItem.solute} in {selectedItem.solvent}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-800">
              {selectedItem.category}
            </span>
          </div>

          <div>
            <h5 className="text-sm font-bold text-black mb-1">
              {selectedItem.example}
            </h5>
            <p className="text-xs text-[#555555] leading-relaxed">
              Solute is in the <strong>{selectedItem.solute}</strong> phase; Solvent is in the <strong>{selectedItem.solvent}</strong> phase.
            </p>
          </div>

          {/* Microscopic Particle Representation Box */}
          <div className="p-3.5 rounded-xl bg-slate-900 text-white flex flex-col gap-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Microscopic Representation
            </span>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center gap-1 p-1">
                <div className={`w-3 h-3 rounded-full ${selectedItem.particleVisual.soluteColor}`} />
                <div className={`w-3 h-3 rounded-full ${selectedItem.particleVisual.solventColor}`} />
              </div>
              <div className="text-[11px] text-slate-300 leading-snug">
                <div>
                  <strong className="text-white">Solute: </strong>
                  {selectedItem.particleVisual.soluteDesc}
                </div>
                <div>
                  <strong className="text-white">Solvent: </strong>
                  {selectedItem.particleVisual.solventDesc}
                </div>
              </div>
            </div>
          </div>

          {/* Common NCERT Examples List */}
          <div>
            <span className="text-xs font-bold text-black block mb-1">
              Curriculum Examples:
            </span>
            <ul className="space-y-1">
              {selectedItem.commonExamples.map((ex, idx) => (
                <li
                  key={idx}
                  className="text-xs text-[#555555] flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C0222E] flex-shrink-0" />
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Tip Callout */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
            <strong>Board Exam Tip: </strong>
            {selectedItem.examTip}
          </div>
        </div>
      </div>
    </div>
  );
}
