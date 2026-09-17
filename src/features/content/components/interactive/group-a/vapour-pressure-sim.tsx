"use client";

import React, { useState, useMemo } from "react";
import { Sparkles, Thermometer, RotateCcw, ArrowUp, ArrowDown, Info } from "lucide-react";

export function VapourPressureSim() {
  const [temperature, setTemperature] = useState<number>(25); // Celsius: 20 to 80
  const [hasNonVolatileSolute, setHasNonVolatileSolute] = useState<boolean>(false);

  // Pure water vapor pressure (Antoine equation approximation in mmHg)
  // log10(P) = 8.07131 - (1730.63 / (233.426 + T))
  const pureVaporPressure = useMemo(() => {
    const logP = 8.07131 - 1730.63 / (233.426 + temperature);
    return Math.pow(10, logP);
  }, [temperature]);

  // If non-volatile solute is added, Raoult's law lowers vapor pressure by e.g. 25%
  const actualVaporPressure = hasNonVolatileSolute
    ? pureVaporPressure * 0.75
    : pureVaporPressure;

  // Number of vapor molecules displayed proportional to pressure
  const vaporParticleCount = Math.max(4, Math.min(36, Math.round(actualVaporPressure / 6)));

  const handleReset = () => {
    setTemperature(25);
    setHasNonVolatileSolute(false);
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
            <Sparkles className="w-3.5 h-3.5" />
            <span>MICROSCOPIC EQUILIBRIUM SIMULATOR</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Liquid–Vapour Dynamic Equilibrium
          </h4>
          <p className="text-xs text-[#555555]">
            At equilibrium, Rate of Evaporation = Rate of Condensation. See how temperature and non-volatile solute alter vapor density.
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

      {/* Simulator Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Closed Container Chamber */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full relative rounded-2xl border-2 border-slate-400 bg-slate-900 overflow-hidden shadow-inner h-[320px] flex flex-col justify-between p-4">
            {/* Manometer / Pressure Gauge readout */}
            <div className="self-end bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl text-right z-10 shadow-xs">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Manometer Pressure
              </span>
              <span className="text-lg font-mono font-black text-amber-400">
                {actualVaporPressure.toFixed(1)} <span className="text-xs font-normal text-slate-300">mmHg</span>
              </span>
            </div>

            {/* Vapour Phase Chamber */}
            <div className="flex-1 flex flex-wrap items-center justify-center content-center gap-3 p-4">
              {Array.from({ length: vaporParticleCount }).map((_, idx) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-full bg-amber-400/90 shadow-xs animate-bounce"
                  style={{
                    animationDuration: `${1.5 + (idx % 4) * 0.4}s`,
                    animationDelay: `${(idx % 5) * 0.2}s`,
                  }}
                  title="Vapour molecule in gas phase"
                />
              ))}
            </div>

            {/* Dynamic Equilibrium arrows indicator */}
            <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col items-center text-[10px] font-mono text-slate-300 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
              <div className="flex items-center gap-1 text-emerald-400 font-bold">
                <ArrowUp className="w-3 h-3" />
                <span>Evaporation</span>
              </div>
              <div className="flex items-center gap-1 text-sky-400 font-bold">
                <ArrowDown className="w-3 h-3" />
                <span>Condensation</span>
              </div>
            </div>

            {/* Liquid Phase Layer */}
            <div className="relative w-full h-28 bg-gradient-to-t from-sky-800 to-sky-600/90 border-t-2 border-sky-400 rounded-b-xl flex flex-col justify-between p-3">
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-sky-100">
                <span>Liquid Phase Surface</span>
                <span>{hasNonVolatileSolute ? "Solution (+ Solute)" : "Pure Solvent"}</span>
              </div>

              {/* Surface Solute Blocking Visual */}
              {hasNonVolatileSolute && (
                <div className="w-full flex items-center justify-around py-1">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3.5 h-3.5 rounded-full bg-rose-500 border border-white text-[8px] font-bold text-white flex items-center justify-center shadow-xs"
                      title="Non-volatile solute particle blocking liquid surface escape"
                    >
                      S
                    </div>
                  ))}
                </div>
              )}

              <div className="text-[10px] text-sky-200 text-center">
                {hasNonVolatileSolute
                  ? "Solute particles occupy surface area → Decreased rate of evaporation"
                  : "100% surface area available for solvent molecule escape"}
              </div>
            </div>
          </div>
        </div>

        {/* Controls Column */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          {/* Temperature Slider */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-black uppercase tracking-wider flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-[#C0222E]" />
                Chamber Temperature:
              </span>
              <span className="font-mono font-bold text-[#C0222E] text-sm">
                {temperature} °C ({temperature + 273} K)
              </span>
            </div>

            <input
              type="range"
              min={20}
              max={80}
              step={5}
              value={temperature}
              onChange={(e) => setTemperature(parseInt(e.target.value))}
              className="w-full accent-[#C0222E] cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Room Temp (20°C)</span>
              <span>Hot (80°C)</span>
            </div>
          </div>

          {/* Solute Presence Toggle */}
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-black block">
                Add Non-Volatile Solute
              </span>
              <span className="text-[11px] text-[#555555]">
                e.g. Dissolving sugar or salt in water
              </span>
            </div>

            <button
              onClick={() => setHasNonVolatileSolute((prev) => !prev)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                hasNonVolatileSolute
                  ? "bg-[#C0222E] text-white shadow-2xs"
                  : "bg-white text-slate-700 border border-[#E5E5E5]"
              }`}
            >
              {hasNonVolatileSolute ? "Solute Added (-25% P)" : "Add Solute"}
            </button>
          </div>

          {/* Core Principle Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>CBSE Fundamental: </strong>
              Vapour pressure increases exponentially with temperature because more liquid molecules acquire kinetic energy greater than intermolecular attractive forces. Adding non-volatile solute lowers vapour pressure proportionally.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
