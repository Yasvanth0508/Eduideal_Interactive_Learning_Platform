"use client";

import React, { useState } from "react";
import { Eye, HelpCircle, ShieldAlert } from "lucide-react";

interface ExampleCard {
  id: string;
  name: string;
  description: string;
  solute: string;
  solvent: string;
  soluteState: string;
  solventState: string;
  ruleApplied: string;
  examNote?: string;
}

const EXAMPLES: ExampleCard[] = [
  {
    id: "salt-water",
    name: "Salt + Water (Saline Solution)",
    description: "Common household salt (NaCl) dissolved in a cup of water.",
    solute: "Sodium Chloride / Salt (NaCl)",
    solvent: "Water (H₂O)",
    soluteState: "Solid",
    solventState: "Liquid",
    ruleApplied:
      "Physical State Rule: The final solution is liquid. Water is liquid and present in much larger quantity, so water is the solvent and solid salt is the solute.",
  },
  {
    id: "ethanol-20",
    name: "20% Ethanol Solution in Water",
    description: "20 mL of ethanol mixed with 80 mL of water.",
    solute: "Ethanol (20 mL)",
    solvent: "Water (80 mL)",
    soluteState: "Liquid",
    solventState: "Liquid",
    ruleApplied:
      "Relative Amount Rule: Both are liquids. Water is in larger volume (80 mL vs 20 mL), hence Water is the solvent and Ethanol is the solute.",
  },
  {
    id: "ethanol-80",
    name: "80% Ethanol Solution in Water",
    description: "80 mL of ethanol mixed with 20 mL of water (Rubbing alcohol / sanitizer).",
    solute: "Water (20 mL)",
    solvent: "Ethanol (80 mL)",
    soluteState: "Liquid",
    solventState: "Liquid",
    ruleApplied:
      "Relative Amount Rule: Since both are liquids, the component in larger proportion (Ethanol at 80 mL) becomes the solvent, and Water becomes the solute!",
    examNote: "★ Classic CBSE Board Exam Question! Do not assume water is always the solvent.",
  },
  {
    id: "tincture-iodine",
    name: "Tincture of Iodine (Antiseptic)",
    description: "2–3% elemental iodine dissolved in an alcohol-water mixture.",
    solute: "Iodine crystals (I₂)",
    solvent: "Alcohol (Ethanol)",
    soluteState: "Solid",
    solventState: "Liquid",
    ruleApplied:
      "Physical State & Amount: Solid iodine is dissolved in a vast excess of liquid alcohol. Iodine is the solute; alcohol is the solvent.",
  },
  {
    id: "soda-water",
    name: "Soda Water (Aerated Soft Drink)",
    description: "Carbon dioxide gas dissolved under high pressure into liquid water.",
    solute: "Carbon Dioxide (CO₂) Gas",
    solvent: "Water (H₂O)",
    soluteState: "Gas",
    solventState: "Liquid",
    ruleApplied:
      "Physical State Rule: The solution is in the liquid state. Water is the liquid medium (solvent) in which CO₂ gas (solute) is dissolved.",
  },
  {
    id: "brass-alloy",
    name: "Brass (Solid Alloy)",
    description: "Homogeneous solid solution of approx. 30% Zinc in 70% Copper.",
    solute: "Zinc (Zn, ~30%)",
    solvent: "Copper (Cu, ~70%)",
    soluteState: "Solid",
    solventState: "Solid",
    ruleApplied:
      "Relative Amount Rule: Both components are metals (solids). Copper is present in majority (~70%), so Copper is the solvent and Zinc is the solute.",
  },
];

export function SoluteSolventExplorer() {
  const [revealedIds, setRevealedIds] = useState<Record<string, boolean>>({});

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const revealAll = () => {
    const all: Record<string, boolean> = {};
    EXAMPLES.forEach((ex) => {
      all[ex.id] = true;
    });
    setRevealedIds(all);
  };

  const hideAll = () => {
    setRevealedIds({});
  };

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-[#E5E5E5]">
        <div>
          <span
            className="text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 inline-flex mb-1"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>INTERACTIVE IDENTIFICATION</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Solute vs. Solvent Explorer
          </h4>
          <p className="text-xs text-[#555555]">
            Click any example below to test your understanding and reveal the scientific breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={revealAll}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] cursor-pointer transition-all active:scale-95"
          >
            Reveal All
          </button>
          <button
            onClick={hideAll}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-black bg-white border border-[#E5E5E5] cursor-pointer transition-all active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Grid of Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EXAMPLES.map((ex) => {
          const isRevealed = !!revealedIds[ex.id];

          return (
            <div
              key={ex.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isRevealed
                  ? "border-[#C0222E]/40 bg-white shadow-sm"
                  : "border-[#E5E5E5] bg-[#FAFAFA] hover:border-slate-300"
              }`}
            >
              {/* Card Header */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="text-sm font-bold text-black">
                      {ex.name}
                    </h5>
                    <p className="text-xs text-[#555555] mt-0.5">
                      {ex.description}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleReveal(ex.id)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                    style={{
                      background: isRevealed ? "var(--brand-tint)" : "#ffffff",
                      color: isRevealed ? "var(--brand)" : "#000000",
                      border: isRevealed
                        ? "1px solid var(--brand-border)"
                        : "1px solid #E5E5E5",
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{isRevealed ? "Hide" : "Reveal"}</span>
                  </button>
                </div>

                {/* Revealed Answer Box */}
                {isRevealed ? (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {/* Solute Pill */}
                      <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80">
                        <div className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-wider mb-0.5">
                          Solute ({ex.soluteState})
                        </div>
                        <div className="text-xs font-bold text-amber-950">
                          {ex.solute}
                        </div>
                      </div>

                      {/* Solvent Pill */}
                      <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200/80">
                        <div className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-wider mb-0.5">
                          Solvent ({ex.solventState})
                        </div>
                        <div className="text-xs font-bold text-sky-950">
                          {ex.solvent}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700 leading-relaxed bg-[#FAFAFA] p-3 rounded-xl border border-[#E5E5E5]">
                      <strong className="text-black">Scientific Rationale: </strong>
                      {ex.ruleApplied}
                    </div>

                    {ex.examNote && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-semibold flex items-center gap-1.5">
                        <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{ex.examNote}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => toggleReveal(ex.id)}
                    className="mt-4 p-3 rounded-xl bg-white border border-dashed border-[#E5E5E5] text-center text-xs text-slate-400 cursor-pointer hover:border-slate-400 transition-colors"
                  >
                    Click to reveal which is the solute and which is the solvent &rarr;
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
