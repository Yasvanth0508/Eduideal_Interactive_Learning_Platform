"use client";

import React, { useState } from "react";
import { Calculator, Sparkles, Sliders, CheckCircle2 } from "lucide-react";

export function VantHoffCalculator() {
  const [processType, setProcessType] = useState<"DISSOCIATION" | "ASSOCIATION">("DISSOCIATION");
  const [ionsCountN, setIonsCountN] = useState<number>(2); // n: ions or associating molecules
  const [alphaPercent, setAlphaPercent] = useState<number>(85); // degree of dissociation/association in %

  const alpha = alphaPercent / 100;

  // Compute i:
  // Dissociation: i = 1 + (n - 1) * alpha
  // Association: i = 1 + (1/n - 1) * alpha
  const vantHoffFactor =
    processType === "DISSOCIATION"
      ? 1 + (ionsCountN - 1) * alpha
      : 1 + (1 / ionsCountN - 1) * alpha;

  const presets = [
    { label: "NaCl (n=2, strong)", type: "DISSOCIATION" as const, n: 2, alpha: 95 },
    { label: "CaCl₂ (n=3, strong)", type: "DISSOCIATION" as const, n: 3, alpha: 90 },
    { label: "Al₂(SO₄)₃ (n=5)", type: "DISSOCIATION" as const, n: 5, alpha: 80 },
    { label: "CH₃COOH in Benzene (n=2 dimer)", type: "ASSOCIATION" as const, n: 2, alpha: 90 },
  ];

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
          <Calculator className="w-3.5 h-3.5" />
          <span>INTERACTIVE QUANTITATIVE CALCULATOR</span>
        </span>
        <h4 className="text-xl font-bold text-black tracking-tight">
          Van &apos;t Hoff Factor (i) & Degree of Ionization (&alpha;)
        </h4>
        <p className="text-xs text-[#555555]">
          Simulate incomplete ionization or dimerization. Calculate the exact multiplier for all 4 colligative properties.
        </p>
      </div>

      {/* Preset Quick Selectors */}
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="text-xs font-bold text-[#888888] self-center mr-1">Presets:</span>
        {presets.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setProcessType(preset.type);
              setIonsCountN(preset.n);
              setAlphaPercent(preset.alpha);
            }}
            className="px-3 py-1.5 rounded-lg border border-[#E5E5E5] hover:bg-neutral-50 text-xs font-semibold text-neutral-800 transition-colors cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-2xl bg-[#F8F9FA] border border-[#E5E5E5] mb-6">
        {/* Process Type Selection */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-black uppercase tracking-wider block">
            Phenomenon Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setProcessType("DISSOCIATION")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                processType === "DISSOCIATION"
                  ? "bg-[#C0222E] text-white shadow-xs"
                  : "bg-white text-[#555555] border border-[#E5E5E5] hover:bg-neutral-50"
              }`}
            >
              Dissociation (i &gt; 1)
            </button>
            <button
              onClick={() => setProcessType("ASSOCIATION")}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                processType === "ASSOCIATION"
                  ? "bg-[#C0222E] text-white shadow-xs"
                  : "bg-white text-[#555555] border border-[#E5E5E5] hover:bg-neutral-50"
              }`}
            >
              Association (i &lt; 1)
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-black block mb-1">
              {processType === "DISSOCIATION"
                ? "Number of Ions per Molecule (n)"
                : "Number of Associating Molecules (n)"}
            </label>
            <select
              value={ionsCountN}
              onChange={(e) => setIonsCountN(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-white border border-[#E5E5E5] text-xs font-semibold text-black focus:outline-none focus:ring-2 focus:ring-[#C0222E]/20"
            >
              {processType === "DISSOCIATION" ? (
                <>
                  <option value={2}>n = 2 (e.g. NaCl, KCl, MgSO₄)</option>
                  <option value={3}>n = 3 (e.g. CaCl₂, Na₂SO₄)</option>
                  <option value={4}>n = 4 (e.g. FeCl₃, AlCl₃)</option>
                  <option value={5}>n = 5 (e.g. K₄[Fe(CN)₆], Al₂(SO₄)₃)</option>
                </>
              ) : (
                <>
                  <option value={2}>n = 2 (Dimerization: 2 A ⇌ A₂)</option>
                  <option value={3}>n = 3 (Trimerization: 3 A ⇌ A₃)</option>
                  <option value={4}>n = 4 (Tetramerization: 4 A ⇌ A₄)</option>
                </>
              )}
            </select>
          </div>
        </div>

        {/* Degree of Dissociation / Association Slider */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-black uppercase tracking-wider">
              Degree of {processType === "DISSOCIATION" ? "Dissociation" : "Association"} (&alpha;)
            </label>
            <span className="text-sm font-mono font-bold text-[#C0222E] bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              {alphaPercent}% (&alpha; = {alpha.toFixed(2)})
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={alphaPercent}
            onChange={(e) => setAlphaPercent(Number(e.target.value))}
            className="w-full accent-[#C0222E] cursor-pointer mt-3"
          />

          <div className="flex justify-between text-[10px] font-mono text-[#888888]">
            <span>0% (No reaction, i = 1.00)</span>
            <span>50%</span>
            <span>100% (Complete conversion)</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#E5E5E5] text-xs text-[#555555]">
            <strong className="text-black block mb-0.5">Formula:</strong>
            {processType === "DISSOCIATION" ? (
              <span className="font-mono text-neutral-800">
                i = 1 + (n - 1)&alpha; = 1 + ({ionsCountN} - 1) &times; {alpha.toFixed(2)}
              </span>
            ) : (
              <span className="font-mono text-neutral-800">
                i = 1 + (1/n - 1)&alpha; = 1 + (1/{ionsCountN} - 1) &times; {alpha.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      <div className="p-6 rounded-2xl bg-[#1A1D20] text-white border border-neutral-800 mb-6 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
            Calculated Van &apos;t Hoff Factor
          </span>
          <div className="text-4xl sm:text-5xl font-mono font-black text-white">
            i = {vantHoffFactor.toFixed(3)}
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            {processType === "DISSOCIATION"
              ? `Solution contains ${vantHoffFactor.toFixed(2)} moles of particles for every 1 mole of solute added.`
              : `Solution contains only ${vantHoffFactor.toFixed(2)} moles of active particles due to molecular dimerization.`}
          </p>
        </div>

        <div className="flex flex-col gap-2 min-w-[220px]">
          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700 text-xs">
            <span className="text-neutral-400 text-[10px] uppercase font-mono block">Colligative Property Multiplier</span>
            <span className="text-emerald-400 font-mono font-bold">Property_obs = {vantHoffFactor.toFixed(2)} &times; Property_calc</span>
          </div>
          <div className="bg-neutral-800/80 p-2.5 rounded-xl border border-neutral-700 text-xs">
            <span className="text-neutral-400 text-[10px] uppercase font-mono block">Apparent Molar Mass Ratio</span>
            <span className="text-amber-400 font-mono font-bold">M_obs = M_normal / {vantHoffFactor.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Modified Colligative Formulas */}
      <div>
        <h5 className="text-xs font-bold text-black uppercase tracking-wider mb-3">
          Modified Colligative Equations (NCERT Form)
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
            <span className="text-[10px] font-bold text-[#888888] uppercase block mb-1">Relative Lowering VP</span>
            <div className="font-mono text-xs font-bold text-black">(p₁° - p₁) / p₁° = i · x₂</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
            <span className="text-[10px] font-bold text-[#888888] uppercase block mb-1">Elevation of Boiling Pt</span>
            <div className="font-mono text-xs font-bold text-black">ΔT_b = i · K_b · m</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
            <span className="text-[10px] font-bold text-[#888888] uppercase block mb-1">Depression of Freezing Pt</span>
            <div className="font-mono text-xs font-bold text-black">ΔT_f = i · K_f · m</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50 border border-[#E5E5E5]">
            <span className="text-[10px] font-bold text-[#888888] uppercase block mb-1">Osmotic Pressure</span>
            <div className="font-mono text-xs font-bold text-black">Π = i · C · R · T</div>
          </div>
        </div>
      </div>
    </div>
  );
}
