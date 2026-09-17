"use client";

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { ThreeDCanvas, ThreeDSceneController } from "../three-d-canvas";
import { Gauge, ArrowDown, Sparkles } from "lucide-react";

export function HenrysLawChamber3D() {
  const [pressure, setPressure] = useState<number>(2.5); // bar
  const gasParticlesRef = useRef<{ mesh: THREE.Mesh; vel: THREE.Vector3 }[]>([]);
  const pistonMeshRef = useRef<THREE.Mesh | null>(null);

  const initScene = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // 1. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
      dirLight1.position.set(5, 8, 7);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.8);
      dirLight2.position.set(-5, -4, -5);
      scene.add(dirLight2);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Materials
      const cylinderGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        transmission: 0.85,
      });

      const pistonMaterial = new THREE.MeshStandardMaterial({
        color: 0x475569, // Slate steel piston
        metalness: 0.8,
        roughness: 0.25,
      });

      const rodMaterial = new THREE.MeshStandardMaterial({
        color: 0x94a3b8,
        metalness: 0.9,
        roughness: 0.2,
      });

      const liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0369a1, // Deep cyan-blue liquid
        transparent: true,
        opacity: 0.55,
        roughness: 0.15,
      });

      const gasMaterial = new THREE.MeshStandardMaterial({
        color: 0x22c55e, // Green gas molecules (e.g. CO2/O2)
        emissive: 0x15803d,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      });

      const dissolvedMaterial = new THREE.MeshStandardMaterial({
        color: 0x4ade80, // Lighter dissolved gas
        emissive: 0x16a34a,
        emissiveIntensity: 0.3,
        roughness: 0.3,
      });

      // 2. Outer Glass Cylinder (Radius = 1.6, Height = 4.4)
      const cylGeo = new THREE.CylinderGeometry(1.6, 1.6, 4.4, 36, 1, true);
      const cylMesh = new THREE.Mesh(cylGeo, cylinderGlassMaterial);
      rootGroup.add(cylMesh);

      // Base
      const baseGeo = new THREE.CylinderGeometry(1.7, 1.7, 0.2, 36);
      const baseMesh = new THREE.Mesh(baseGeo, pistonMaterial);
      baseMesh.position.set(0, -2.2, 0);
      rootGroup.add(baseMesh);

      // 3. Liquid Layer (Bottom half, height = 1.8)
      const liquidGeo = new THREE.CylinderGeometry(1.56, 1.56, 1.8, 36);
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
      liquidMesh.position.set(0, -1.25, 0);
      rootGroup.add(liquidMesh);

      // 4. Piston Assembly
      // Higher pressure = lower piston height
      // At pressure 1 bar: piston y = 1.8
      // At pressure 5 bar: piston y = 0.2
      const pistonY = 2.2 - (pressure / 5) * 1.8;

      const pistonGeo = new THREE.CylinderGeometry(1.58, 1.58, 0.25, 36);
      const pistonMesh = new THREE.Mesh(pistonGeo, pistonMaterial);
      pistonMesh.position.set(0, pistonY, 0);
      pistonMeshRef.current = pistonMesh;
      rootGroup.add(pistonMesh);

      // Piston Rod
      const rodGeo = new THREE.CylinderGeometry(0.18, 0.18, 2.0, 16);
      const rodMesh = new THREE.Mesh(rodGeo, rodMaterial);
      rodMesh.position.set(0, 1.1, 0);
      pistonMesh.add(rodMesh);

      // Weight disk on top of rod
      const weightGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.15, 24);
      const weightMesh = new THREE.Mesh(weightGeo, pistonMaterial);
      weightMesh.position.set(0, 2.1, 0);
      pistonMesh.add(weightMesh);

      // 5. Gas Particles in Headspace (Active bouncing)
      const gasParticles: { mesh: THREE.Mesh; vel: THREE.Vector3 }[] = [];
      const gasGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const gasCount = 35;

      for (let i = 0; i < gasCount; i++) {
        const mesh = new THREE.Mesh(gasGeo, gasMaterial);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.3;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = -0.3 + Math.random() * (pistonY - (-0.3) - 0.2);

        mesh.position.set(x, y, z);
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0,
          (Math.random() - 0.5) * 2.0
        );

        rootGroup.add(mesh);
        gasParticles.push({ mesh, vel });
      }
      gasParticlesRef.current = gasParticles;

      // 6. Dissolved Gas Particles in Liquid (Proportional to pressure: Henry's Law x = p / K_H)
      const dissolvedCount = Math.round(pressure * 14);
      for (let i = 0; i < dissolvedCount; i++) {
        const dMesh = new THREE.Mesh(gasGeo, dissolvedMaterial);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.35;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = -2.1 + Math.random() * 1.6;

        dMesh.position.set(x, y, z);
        rootGroup.add(dMesh);
      }

      camera.position.set(0, 1.0, 5.8);

      const controller: ThreeDSceneController = {
        update: (time, delta) => {
          rootGroup.rotation.y = time * 0.15;

          // Animate gas particle bounces within headspace boundaries
          const minY = -0.3;
          const maxY = pistonY - 0.15;

          gasParticles.forEach((p) => {
            p.mesh.position.addScaledVector(p.vel, delta);

            // Cylinder radius bounce (r = 1.35)
            const r2 = p.mesh.position.x ** 2 + p.mesh.position.z ** 2;
            if (r2 > 1.35 ** 2) {
              p.vel.x *= -1;
              p.vel.z *= -1;
            }

            // Top/bottom bounce (piston surface & liquid surface)
            if (p.mesh.position.y > maxY) {
              p.mesh.position.y = maxY;
              p.vel.y *= -1;
            } else if (p.mesh.position.y < minY) {
              p.mesh.position.y = minY;
              p.vel.y *= -1;
            }
          });
        },
      };

      return controller;
    },
    [pressure]
  );

  return (
    <ThreeDCanvas
      title="3D Piston Solvation Chamber: Henry's Law (p = K_H · x)"
      badge="TOPIC 4 • 3D GAS SOLUBILITY"
      subtitle="Increase external piston pressure (p). Observe how gas compression forces gas molecules across the interface into the liquid solution."
      cameraPosition={[0, 1.0, 5.8]}
      initScene={initScene}
    >
      {/* Piston Pressure Slider */}
      <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E5E5E5] mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-[#C0222E]" />
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Applied Piston Pressure (p)
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#C0222E] text-white">
              {pressure.toFixed(1)} bar
            </span>
          </div>
          <span className="text-xs text-[#555555]">
            Henry&apos;s Constant (K_H) = <strong className="text-black font-mono">35.0 kbar</strong>
          </span>
        </div>

        <input
          type="range"
          min={1.0}
          max={5.0}
          step={0.5}
          value={pressure}
          onChange={(e) => setPressure(parseFloat(e.target.value))}
          className="w-full accent-[#C0222E] cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#888888] mt-1.5">
          <span>1.0 bar (Atmospheric)</span>
          <span>3.0 bar (Elevated)</span>
          <span>5.0 bar (High Soda Bottling Pressure)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Dissolved Mole Fraction (x)</span>
          <div className="text-base font-bold font-mono text-emerald-600">
            {((pressure / 35000) * 1000).toFixed(3)} × 10⁻³
          </div>
          <span className="text-[10px] text-[#555555]">x = p / K_H (Directly proportional)</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Liquid Dissolved State</span>
          <div className="text-base font-bold font-mono text-black">
            {Math.round(pressure * 14)} Molecules
          </div>
          <span className="text-[10px] text-[#555555]">Hydrated within solvent body</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Industrial Analogy</span>
          <div className="text-base font-bold font-mono text-black">
            Sealed Soda Bottle
          </div>
          <span className="text-[10px] text-[#555555]">CO₂ held in liquid under pressure</span>
        </div>
      </div>
    </ThreeDCanvas>
  );
}
