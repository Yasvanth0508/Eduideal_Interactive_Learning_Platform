"use client";

import React, { useState } from "react";
import { Snowflake, Car, HeartPulse, Apple, ShieldCheck, Microscope, ArrowRight } from "lucide-react";

type ApplicationKey = "ANTIFREEZE" | "DEICING" | "PRESERVATION" | "ISOTONIC_IV" | "MACROMOLECULES";

export function ColligativeApplicationsShowcase() {
  const [activeTab, setActiveTab] = useState<ApplicationKey>("ANTIFREEZE");

  const applications = {
    ANTIFREEZE: {
      title: "Automobile Radiator Antifreeze",
      property: "Depression of Freezing Point & Elevation of Boiling Point",
      solute: "Ethylene Glycol (CH₂OH—CH₂OH)",
      formula: "ΔT_f = K_f · m & ΔT_b = K_b · m",
      icon: Car,
      metrics: [
        { label: "Optimal Concentration", value: "35% (v/v) in Water" },
        { label: "Depressed Freezing Point", value: "-17.6 °C (255.4 K)" },
        { label: "Elevated Boiling Point", value: "106 °C (Summer Protection)" },
      ],
      description:
        "Water alone would freeze at 0 °C in sub-zero winters, cracking car engine blocks due to volume expansion of ice. Adding ethylene glycol drastically lowers the liquid-solid phase boundary, keeping engine coolant liquid down to -17.6 °C while also preventing boiling over in hot summers.",
      examTip: "CBSE Board Favorite: Explain why ethylene glycol is added to water in car radiators during winter.",
    },
    DEICING: {
      title: "De-icing Roads & Runways in Snowy Climates",
      property: "Depression of Freezing Point",
      solute: "Common Salt (NaCl) or Calcium Chloride (CaCl₂)",
      formula: "ΔT_f = i · K_f · m",
      icon: Snowflake,
      metrics: [
        { label: "NaCl Van 't Hoff (i)", value: "i ≈ 2.0 (effective to -9 °C)" },
        { label: "CaCl₂ Van 't Hoff (i)", value: "i ≈ 3.0 (effective to -29 °C)" },
        { label: "Dissolution Enthalpy", value: "CaCl₂ ΔH < 0 (Exothermic)" },
      ],
      description:
        "Sprinkling salt onto icy roads creates a thin layer of salt solution on contact. Because the solution has a much lower freezing point than pure water, ice melts spontaneously even at sub-zero ambient temperatures. CaCl₂ is superior to NaCl because it produces 3 ions per unit and releases dissolution heat.",
      examTip: "Why is CaCl₂ preferred over NaCl for clearing ice from roads at extremely low temperatures? (Reason: higher 'i' = 3 and exothermic dissolution).",
    },
    PRESERVATION: {
      title: "Food Preservation via High Osmotic Pressure",
      property: "Osmotic Pressure & Exoosmosis",
      solute: "High Salt (Brine) or Concentrated Sugar (Syrup)",
      formula: "Π = C · R · T (High external osmolarity)",
      icon: Apple,
      metrics: [
        { label: "Action on Bacteria", value: "Severe Exoosmosis" },
        { label: "Bacterial State", value: "Plasmolysis & Dehydration" },
        { label: "Common Examples", value: "Pickles (Salt), Jams/Jellies (Sugar)" },
      ],
      description:
        "Bacterial cells and mold spores that land on salted pickles or high-sugar fruit jams experience intense osmotic pressure from the hypertonic surroundings. Water rapidly leaves the bacterial cells via exoosmosis, shriveling them (plasmolysis) and arresting metabolic activity without synthetic preservatives.",
      examTip: "NCERT Concept: Explain how adding excess salt to pickles or sugar to jams prevents bacterial spoilage.",
    },
    ISOTONIC_IV: {
      title: "Intravenous (IV) Fluid Administration",
      property: "Osmotic Pressure & Tonicity",
      solute: "0.9% (m/v) Aqueous Sodium Chloride (Saline)",
      formula: "Π_blood = Π_saline (Isotonic Condition)",
      icon: HeartPulse,
      metrics: [
        { label: "Blood Osmotic Pressure", value: "~7.7 atm at 37 °C (310 K)" },
        { label: "If Solution is < 0.9%", value: "Hypotonic → RBCs swell/burst (Hemolysis)" },
        { label: "If Solution is > 0.9%", value: "Hypertonic → RBCs shrink (Crenation)" },
      ],
      description:
        "Intravenous injections must strictly match the osmotic pressure of blood plasma. If pure distilled water were injected into a vein, water would rush into erythrocytes until they burst (hemolysis). Conversely, hypertonic injections cause cells to lose water and collapse (crenation).",
      examTip: "Explain what happens when red blood cells (RBCs) are placed in: (i) 0.5% NaCl solution, (ii) 1.5% NaCl solution.",
    },
    MACROMOLECULES: {
      title: "Molecular Weight of Proteins & Polymers",
      property: "Osmotic Pressure (Method of Choice)",
      solute: "Biomolecules, Proteins, Synthetic Polymers",
      formula: "M₂ = (w₂ · R · T) / (Π · V)",
      icon: Microscope,
      metrics: [
        { label: "Working Temperature", value: "Room Temp (298 K, no denaturation)" },
        { label: "Measurement Magnitude", value: "Large mm-scale liquid column rise" },
        { label: "Molar Mass Range", value: "10,000 to > 1,000,000 g/mol" },
      ],
      description:
        "Why is osmotic pressure preferred over ΔT_b, ΔT_f, and RLVP for determining molar masses of macromolecules? 1) Measurement occurs at room temperature without denaturing fragile proteins; 2) For large molar masses (low molality), ΔT_b and ΔT_f are vanishingly small (~0.001 K), whereas osmotic pressure is large and easily measured via manometer.",
      examTip: "NCERT Question: State two reasons why osmotic pressure is preferred over other colligative properties for determining the molar mass of polymers and proteins.",
    },
  };

  const current = applications[activeTab];
  const Icon = current.icon;

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
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>REAL-WORLD PHENOMENA SHOWCASE</span>
        </span>
        <h4 className="text-xl font-bold text-black tracking-tight">
          Practical & Industrial Applications of Colligative Properties
        </h4>
        <p className="text-xs text-[#555555]">
          Explore real-life applications frequently tested in CBSE Class 12 Board examinations.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(applications) as ApplicationKey[]).map((key) => {
          const item = applications[key];
          const TabIcon = item.icon;
          const isSelected = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                isSelected
                  ? "bg-[#C0222E] text-white shadow-xs"
                  : "bg-[#F8F9FA] text-[#555555] hover:bg-neutral-100 border border-[#E5E5E5]"
              }`}
            >
              <TabIcon className="w-3.5 h-3.5" />
              <span>{item.title.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Card Content */}
      <div className="p-6 rounded-2xl bg-[#F8F9FA] border border-[#E5E5E5] mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E5] mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#E5E5E5] shadow-2xs flex items-center justify-center text-[#C0222E]">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-lg font-bold text-black">{current.title}</h5>
              <span className="text-xs font-mono text-[#C0222E] font-semibold">{current.property}</span>
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-lg border border-[#E5E5E5] text-xs font-mono text-[#555555]">
            <strong className="text-black">Formula:</strong> {current.formula}
          </div>
        </div>

        {/* Real-world Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
          {current.metrics.map((metric, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
              <span className="text-[10px] uppercase font-bold text-[#888888] block mb-1">
                {metric.label}
              </span>
              <div className="text-xs font-mono font-bold text-black">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Detailed Explanation */}
        <p className="text-xs sm:text-sm text-[#444444] leading-relaxed mb-4">
          {current.description}
        </p>

        {/* CBSE Exam Tip Callout */}
        <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-2.5">
          <span className="font-bold text-[#C0222E] uppercase font-mono tracking-wider flex-shrink-0">
            [CBSE Exam Tip]
          </span>
          <span className="leading-relaxed">{current.examTip}</span>
        </div>
      </div>
    </div>
  );
}
