"use client";

import React, { useState } from "react";
import { Calculator, RotateCcw, Droplets, Info } from "lucide-react";

export function OsmoticPressureCalculator() {
  const [w2, setW2] = useState<number>(1.26); // g polymer/protein
  const [volume, setVolume] = useState<number>(0.2); // L (200 mL)
  const [tempC, setTempC] = useState<number>(27); // 300 K
  const [m2, setM2] = useState<number>(60000); // g/mol (macromolecule/protein)
  const [salinePercent, setSalinePercent] = useState<number>(0.9); // % NaCl for RBC test

  const tempK = tempC + 273.15;
  const R = 0.0821; // L·atm·K⁻¹·mol⁻¹

  // pi = (w2 * R * T) / (M2 * V)
  const moles = m2 > 0 ? w2 / m2 : 0;
  const concentrationM = volume > 0 ? moles / volume : 0;
  const piAtm = concentrationM * R * tempK;
  const piMmHg = piAtm * 760;

  // RBC tonicity comparison
  const tonicity =
    salinePercent === 0.9
      ? { type: "ISOTONIC", desc: "Same osmotic pressure as blood plasma. Red blood cells maintain normal biconcave disc shape.", color: "text-emerald-700 bg-emerald-50 border-emerald-200" }
      : salinePercent < 0.9
      ? { type: "HYPOTONIC", desc: "Lower osmotic pressure. Water rushes into red blood cells, causing them to swell and burst (Hemolysis).", color: "text-sky-700 bg-sky-50 border-sky-200" }
      : { type: "HYPERTONIC", desc: "Higher osmotic pressure. Water flows out of red blood cells, causing them to shrink and shrivel (Plasmolysis / Crenation).", color: "text-rose-700 bg-rose-50 border-rose-200" };

  const handleReset = () => {
    setW2(1.26);
    setVolume(0.2);
    setTempC(27);
    setM2(60000);
    setSalinePercent(0.9);
  };

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
            <Calculator className="w-3.5 h-3.5" />
            <span>OSMOMETRY CALCULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            π = CRT = (w₂ · R · T) / (M₂ · V)
          </h4>
          <p className="text-xs text-[#555555]">
            Calculate osmotic pressure and evaluate cellular tonicity in biological systems.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 self-start sm:self-center px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-black bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Inputs */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Mass of Solute (w₂)</span>
              <span className="font-mono font-bold text-[#C0222E]">{w2} g</span>
            </div>
            <input
              type="number"
              step={0.1}
              value={w2}
              onChange={(e) => setW2(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Molar Mass M₂</span>
              <span className="font-mono font-bold text-slate-600">{m2} g/mol</span>
            </div>
            <input
              type="number"
              min={100}
              step={1000}
              value={m2}
              onChange={(e) => setM2(parseFloat(e.target.value) || 1)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Solution Volume (V)</span>
              <span className="font-mono font-bold text-sky-600">{volume} L</span>
            </div>
            <input
              type="number"
              step={0.05}
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value) || 0.01)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Temperature</span>
              <span className="font-mono font-bold text-amber-600">{tempC} °C ({tempK.toFixed(1)} K)</span>
            </div>
            <input
              type="number"
              step={1}
              value={tempC}
              onChange={(e) => setTempC(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-1.5 rounded-xl border border-[#E5E5E5] bg-white text-xs font-mono font-bold"
            />
          </div>

          {/* Biological Tonicity Slider */}
          <div className="p-3 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2 sm:col-span-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Saline Infusion (% NaCl w/v)</span>
              <span className="font-mono font-bold text-purple-600">{salinePercent}% NaCl</span>
            </div>
            <input
              type="range"
              min={0.1}
              max={2.0}
              step={0.1}
              value={salinePercent}
              onChange={(e) => setSalinePercent(parseFloat(e.target.value))}
              className="w-full accent-[#C0222E] cursor-pointer"
            />
            <div className={`p-2.5 rounded-xl border text-xs leading-relaxed ${tonicity.color}`}>
              <strong>{tonicity.type} Solution: </strong>
              {tonicity.desc}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="lg:col-span-5 rounded-2xl bg-slate-900 text-white p-5 space-y-4">
          <div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
              Osmotic Pressure (π)
            </div>
            <div className="text-3xl font-mono font-black text-emerald-400">
              {piAtm < 0.01 ? (piAtm * 1000).toFixed(2) + " ×10⁻³" : piAtm.toFixed(4)} <span className="text-sm font-normal text-slate-300">atm</span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              ≈ {piMmHg.toFixed(2)} mmHg (torr)
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800 space-y-1">
            <div>• C = {moles.toExponential(3)} mol / {volume} L = {concentrationM.toExponential(3)} M</div>
            <div>• π = ({concentrationM.toExponential(3)}) × 0.0821 × {tempK.toFixed(1)} K</div>
            <div>• Significant readable pressure even for macromolecules!</div>
          </div>
        </div>
      </div>
    </div>
  );
}
