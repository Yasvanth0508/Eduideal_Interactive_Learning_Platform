"use client";

import React, { useState } from "react";
import { Sparkles, Layers } from "lucide-react";

interface ComparisonProperty {
  property: string;
  trueSolution: string;
  colloid: string;
  suspension: string;
  detail: string;
}

const COMPARISON_DATA: ComparisonProperty[] = [
  {
    property: "Particle Size (Diameter)",
    trueSolution: "< 1 nm (< 10⁻⁹ m or < 10 Å)",
    colloid: "1 nm to 1000 nm (10⁻⁹ to 10⁻⁶ m)",
    suspension: "> 1000 nm (> 10⁻⁶ m or > 1 μm)",
    detail:
      "True solution particles exist as individual ions or molecules. Colloidal particles are aggregates. Suspension particles are macroscopic grains.",
  },
  {
    property: "Homogeneity & Phases",
    trueSolution: "Homogeneous (Single phase)",
    colloid: "Heterogeneous (Two phases: dispersed & medium)",
    suspension: "Heterogeneous (Two visible phases)",
    detail:
      "Although colloids often appear uniform to the naked eye, under an ultramicroscope they clearly exhibit distinct phase boundaries.",
  },
  {
    property: "Optical Appearance",
    trueSolution: "Transparent and clear",
    colloid: "Translucent to slightly cloudy",
    suspension: "Opaque",
    detail:
      "True solutions allow light to pass through unimpeded without scattering.",
  },
  {
    property: "Tyndall Effect (Light Scattering)",
    trueSolution: "Does not exhibit Tyndall effect",
    colloid: "Exhibits distinct Tyndall effect",
    suspension: "May exhibit scattering or block light",
    detail:
      "Because true solution particles (< 1 nm) are much smaller than visible light wavelengths (400–700 nm), they cannot scatter light.",
  },
  {
    property: "Filterability (Ordinary Filter Paper)",
    trueSolution: "Passes through completely",
    colloid: "Passes through completely",
    suspension: "Retained on filter paper",
    detail:
      "Ordinary filter paper pore sizes (~1000 nm) permit both true solution and colloid particles to pass.",
  },
  {
    property: "Filterability (Ultrafilter / Cellophane)",
    trueSolution: "Passes through",
    colloid: "Retained by ultrafilters",
    suspension: "Retained completely",
    detail:
      "Semipermeable membranes and parchment membranes hold back colloidal aggregates while letting true solutes pass.",
  },
  {
    property: "Stability under Gravity",
    trueSolution: "Completely stable (Never settles)",
    colloid: "Stable (Does not settle on standing)",
    suspension: "Unstable (Particles settle out)",
    detail:
      "Solute particles in true solutions undergo incessant thermal collisions that permanently prevent sedimentation.",
  },
  {
    property: "Representative Example",
    trueSolution: "NaCl or Sugar in Water",
    colloid: "Milk, Fog, Starch in Water",
    suspension: "Chalk powder or Sand in Water",
    detail:
      "Our entire CBSE Chapter on Solutions focuses strictly on True Solutions.",
  },
];

export function SolutionColloidSuspensionComparison() {
  const [activePropertyIndex, setActivePropertyIndex] = useState<number>(0);

  const selected = COMPARISON_DATA[activePropertyIndex];

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
            <Layers className="w-3.5 h-3.5" />
            <span>DISPERSION SYSTEMS COMPARISON</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            True Solution vs. Colloid vs. Suspension
          </h4>
          <p className="text-xs text-[#555555]">
            Compare how particle dimensions govern the optical, filtration, and phase characteristics of mixtures.
          </p>
        </div>
      </div>

      {/* Interactive Property Highlights Carousel / Clicker */}
      <div className="overflow-x-auto pb-2 mb-6">
        <div className="flex items-center gap-2 min-w-max">
          {COMPARISON_DATA.map((item, idx) => {
            const isActive = idx === activePropertyIndex;
            return (
              <button
                key={item.property}
                onClick={() => setActivePropertyIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer select-none ${
                  isActive
                    ? "bg-[#C0222E] text-white shadow-xs font-bold"
                    : "bg-[#FAFAFA] text-[#555555] hover:text-black border border-[#E5E5E5]"
                }`}
              >
                {item.property}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3-Column Comparison Spotlight Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* True Solution */}
        <div className="p-5 rounded-2xl border-2 border-sky-400 bg-sky-50/30 flex flex-col justify-between gap-3">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-800">
                CLASS 12 SYLLABUS FOCUS
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse" />
            </div>
            <h5 className="text-base font-black text-slate-900">
              True Solution
            </h5>
            <div className="mt-3 p-3 rounded-xl bg-white border border-sky-200 text-xs font-semibold text-sky-950">
              {selected.trueSolution}
            </div>
          </div>
          <div className="text-[11px] text-slate-600">
            &lt; 1 nm • Molecularly Dispersed
          </div>
        </div>

        {/* Colloid */}
        <div className="p-5 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              INTERMEDIATE DISPERSION
            </span>
            <h5 className="text-base font-bold text-slate-900">
              Colloid
            </h5>
            <div className="mt-3 p-3 rounded-xl bg-white border border-[#E5E5E5] text-xs font-medium text-slate-800">
              {selected.colloid}
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            1 nm – 1000 nm • Shows Tyndall Effect
          </div>
        </div>

        {/* Suspension */}
        <div className="p-5 rounded-2xl border border-[#E5E5E5] bg-[#FAFAFA] flex flex-col justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              COARSE MIXTURE
            </span>
            <h5 className="text-base font-bold text-slate-900">
              Suspension
            </h5>
            <div className="mt-3 p-3 rounded-xl bg-white border border-[#E5E5E5] text-xs font-medium text-slate-800">
              {selected.suspension}
            </div>
          </div>
          <div className="text-[11px] text-slate-500">
            &gt; 1000 nm • Settles under Gravity
          </div>
        </div>
      </div>

      {/* Explanatory Deep Dive for the Active Property */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-black">Scientific Insight ({selected.property}): </strong>
          {selected.detail}
        </div>
      </div>
    </div>
  );
}
