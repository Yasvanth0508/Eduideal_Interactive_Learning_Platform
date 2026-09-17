"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Sparkles, Droplets, Info } from "lucide-react";

export function OsmosisSimulation() {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soluteConcentrationB, setSoluteConcentrationB] = useState<number>(18); // Number of solute particles in Compartment B
  const [solventLevelA, setSolventLevelA] = useState<number>(50); // Height % in compartment A (Pure solvent)
  const [solventLevelB, setSolventLevelB] = useState<number>(50); // Height % in compartment B (Solution)

  useEffect(() => {
    let interval: any;
    if (isRunning) {
      interval = setInterval(() => {
        setSolventLevelA((prevA) => {
          // Flow from A to B until equilibrium
          if (prevA > 32) {
            return prevA - 0.4;
          }
          return prevA;
        });
        setSolventLevelB((prevB) => {
          if (prevB < 68) {
            return prevB + 0.4;
          }
          return prevB;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleReset = () => {
    setIsRunning(false);
    setSolventLevelA(50);
    setSolventLevelB(50);
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
            <Droplets className="w-3.5 h-3.5" />
            <span>INTERACTIVE MEMBRANE SIMULATION</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">
            Osmosis Across a Semi-Permeable Membrane (SPM)
          </h4>
          <p className="text-xs text-[#555555]">
            Observe the spontaneous net migration of solvent molecules from pure solvent (low solute conc.) to solution (high solute conc.).
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => setIsRunning((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer active:scale-95 shadow-2xs"
            style={{ background: "var(--brand)" }}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? "Pause Flux" : "Start Osmosis"}</span>
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-[#FAFAFA] hover:bg-slate-100 border border-[#E5E5E5] transition-all cursor-pointer active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* U-Tube Vessel Simulation Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 flex flex-col items-center">
          <div className="w-full relative h-[320px] rounded-2xl border-2 border-slate-400 bg-slate-900 p-4 flex items-end justify-center overflow-hidden shadow-inner">
            {/* U-Tube Left Arm (Compartment A: Pure Solvent) */}
            <div className="w-40 h-full flex flex-col justify-end items-center relative border-r border-dashed border-slate-600">
              <div className="absolute top-2 left-2 text-[10px] font-mono text-sky-400 uppercase tracking-wider font-bold">
                Compartment A<br />(Pure Water Solvent)
              </div>

              {/* Liquid Level Column */}
              <div
                className="w-full bg-gradient-to-t from-sky-700 to-sky-500/80 transition-all duration-300 relative rounded-tl-xl flex items-center justify-center"
                style={{ height: `${solventLevelA}%` }}
              >
                <span className="text-xs font-mono font-bold text-white select-none">
                  {solventLevelA.toFixed(0)}% Vol
                </span>
              </div>
            </div>

            {/* Central Semi-Permeable Membrane (SPM) */}
            <div className="w-1.5 h-full bg-amber-400/90 relative flex flex-col justify-center items-center z-10">
              <div className="absolute -top-1 px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 font-mono font-bold text-[9px] whitespace-nowrap shadow-xs">
                SPM Barrier
              </div>
            </div>

            {/* U-Tube Right Arm (Compartment B: Concentrated Solution) */}
            <div className="w-40 h-full flex flex-col justify-end items-center relative border-l border-dashed border-slate-600">
              <div className="absolute top-2 right-2 text-[10px] font-mono text-rose-400 uppercase tracking-wider font-bold text-right">
                Compartment B<br />(Concentrated Solution)
              </div>

              {/* Liquid Level Column */}
              <div
                className="w-full bg-gradient-to-t from-rose-900 via-sky-800 to-rose-600/70 transition-all duration-300 relative rounded-tr-xl flex flex-col items-center justify-center"
                style={{ height: `${solventLevelB}%` }}
              >
                {/* Floating Solute Particles */}
                <div className="w-full flex flex-wrap gap-1.5 justify-center p-2">
                  {Array.from({ length: soluteConcentrationB }).map((_, i) => (
                    <div
                      key={i}
                      className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-white shadow-xs"
                      title="Solute particle (Cannot cross SPM)"
                    />
                  ))}
                </div>

                <span className="text-xs font-mono font-bold text-white select-none mt-1">
                  {solventLevelB.toFixed(0)}% Vol
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-3 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Water level drops in pure solvent (A)</span>
            <span className="font-bold text-[#C0222E]">Net flow: A → B across SPM</span>
            <span>Water level rises in solution (B)</span>
          </div>
        </div>

        {/* Info and Solute Adjuster */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-bold text-black uppercase tracking-wider">Solute Density (Comp. B)</span>
              <span className="font-mono font-bold text-[#C0222E]">{soluteConcentrationB} Particles</span>
            </div>
            <input
              type="range"
              min={6}
              max={28}
              step={2}
              value={soluteConcentrationB}
              onChange={(e) => setSoluteConcentrationB(parseInt(e.target.value))}
              disabled={isRunning}
              className="w-full accent-[#C0222E] cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">
              Higher solute concentration produces higher osmotic pressure and faster solvent suction.
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 leading-relaxed flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Semi-Permeable Membrane (SPM): </strong>
              Submicroscopic pores allow small solvent molecules ($H_2O$) to pass through, but physically block larger hydrated solute ions/molecules ($Na^+, Cl^-$, glucose).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
