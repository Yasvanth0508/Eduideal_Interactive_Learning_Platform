"use client";

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { ThreeDCanvas, ThreeDSceneController } from "../three-d-canvas";
import { ShieldAlert, Flame, Gauge } from "lucide-react";

export function EvaporationEquilibrium3D() {
  const [hasSolute, setHasSolute] = useState<boolean>(false);
  const vaporParticlesRef = useRef<{ mesh: THREE.Mesh; vel: THREE.Vector3 }[]>([]);

  const initScene = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // 1. Lighting
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
      const vesselGlassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.28,
        roughness: 0.1,
        transmission: 0.85,
      });

      const stopperMaterial = new THREE.MeshStandardMaterial({
        color: 0x78350f, // Amber-brown cork/rubber stopper
        roughness: 0.7,
        metalness: 0.1,
      });

      const liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7, // Sky blue liquid
        transparent: true,
        opacity: 0.55,
        roughness: 0.2,
      });

      const solventVaporMaterial = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.5,
        roughness: 0.3,
      });

      const nonVolatileSoluteMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Gold/amber non-volatile solute (e.g. glucose, urea)
        emissive: 0xb45309,
        emissiveIntensity: 0.4,
        roughness: 0.2,
      });

      // 2. Sealed Glass Vessel Geometry (Rounded box/cylinder with neck and stopper)
      const vesselGeo = new THREE.CylinderGeometry(1.6, 1.6, 3.6, 32, 1, true);
      const vesselMesh = new THREE.Mesh(vesselGeo, vesselGlassMaterial);
      rootGroup.add(vesselMesh);

      // Base
      const baseGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.15, 32);
      const baseMesh = new THREE.Mesh(baseGeo, vesselGlassMaterial);
      baseMesh.position.set(0, -1.8, 0);
      rootGroup.add(baseMesh);

      // Top Dome
      const domeGeo = new THREE.SphereGeometry(1.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
      const domeMesh = new THREE.Mesh(domeGeo, vesselGlassMaterial);
      domeMesh.position.set(0, 1.8, 0);
      rootGroup.add(domeMesh);

      // Neck & Stopper
      const neckGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.6, 24);
      const neckMesh = new THREE.Mesh(neckGeo, vesselGlassMaterial);
      neckMesh.position.set(0, 3.2, 0);
      rootGroup.add(neckMesh);

      const stopperGeo = new THREE.CylinderGeometry(0.48, 0.42, 0.7, 24);
      const stopperMesh = new THREE.Mesh(stopperGeo, stopperMaterial);
      stopperMesh.position.set(0, 3.4, 0);
      rootGroup.add(stopperMesh);

      // 3. Liquid Body (Bottom half, height = 1.6)
      const liquidGeo = new THREE.CylinderGeometry(1.56, 1.56, 1.6, 32);
      const liquidMesh = new THREE.Mesh(liquidGeo, liquidMaterial);
      liquidMesh.position.set(0, -1.0, 0);
      rootGroup.add(liquidMesh);

      // 4. Surface Molecules (At interface y = -0.2)
      const surfaceGroup = new THREE.Group();
      rootGroup.add(surfaceGroup);

      // Solute blocking sites on the surface if hasSolute is true
      if (hasSolute) {
        // Place 12 prominent golden solute molecules on surface
        const soluteGeo = new THREE.SphereGeometry(0.18, 16, 16);
        const surfacePositions = [
          [0, 0],
          [0.6, 0.4],
          [-0.7, 0.3],
          [0.3, -0.7],
          [-0.5, -0.6],
          [1.0, -0.2],
          [-1.0, -0.1],
          [0.8, 0.8],
          [-0.8, 0.7],
          [0.1, 1.0],
          [-0.1, -1.1],
          [0.5, -1.0],
        ];

        surfacePositions.forEach(([x, z]) => {
          const sMesh = new THREE.Mesh(soluteGeo, nonVolatileSoluteMaterial);
          sMesh.position.set(x, -0.2, z);
          surfaceGroup.add(sMesh);
        });
      }

      // 5. Headspace Vapor Molecules
      // If pure solvent: 40 vapor molecules (high vapor pressure p0)
      // If solution with solute: 22 vapor molecules (lowered vapor pressure p)
      const vaporCount = hasSolute ? 20 : 42;
      const vaporParticles: { mesh: THREE.Mesh; vel: THREE.Vector3 }[] = [];
      const vaporGeo = new THREE.SphereGeometry(0.08, 12, 12);

      for (let i = 0; i < vaporCount; i++) {
        const mesh = new THREE.Mesh(vaporGeo, solventVaporMaterial);
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 1.3;
        const x = r * Math.cos(theta);
        const z = r * Math.sin(theta);
        const y = 0.2 + Math.random() * 2.2;

        mesh.position.set(x, y, z);
        const vel = new THREE.Vector3(
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 1.8
        );

        rootGroup.add(mesh);
        vaporParticles.push({ mesh, vel });
      }
      vaporParticlesRef.current = vaporParticles;

      camera.position.set(0, 1.2, 5.8);

      const controller: ThreeDSceneController = {
        update: (time, delta) => {
          rootGroup.rotation.y = time * 0.15;

          // Animate vapor bounce within headspace
          const minY = 0.0;
          const maxY = 2.6;

          vaporParticles.forEach((p) => {
            p.mesh.position.addScaledVector(p.vel, delta);

            const r2 = p.mesh.position.x ** 2 + p.mesh.position.z ** 2;
            if (r2 > 1.35 ** 2) {
              p.vel.x *= -1;
              p.vel.z *= -1;
            }

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
    [hasSolute]
  );

  return (
    <ThreeDCanvas
      title="3D Closed Evaporation Chamber: Vapour Pressure & Surface Blocking"
      badge="TOPIC 5 • 3D DYNAMIC EQUILIBRIUM"
      subtitle="Observe dynamic equilibrium (Rate of Evaporation = Rate of Condensation). Notice how non-volatile solute particles block the liquid surface, decreasing vapor pressure."
      cameraPosition={[0, 1.2, 5.8]}
      initScene={initScene}
    >
      {/* State Toggle Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setHasSolute(false)}
          className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            !hasSolute
              ? "bg-sky-50 text-sky-950 border-sky-300 shadow-2xs"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <Flame className="w-4 h-4 text-sky-600" />
          <div className="text-left">
            <div>Pure Volatile Solvent (Water)</div>
            <div className="text-[10px] font-normal opacity-80">Full surface available • High VP (p₁°)</div>
          </div>
        </button>

        <button
          onClick={() => setHasSolute(true)}
          className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            hasSolute
              ? "bg-amber-50 text-amber-950 border-amber-300 shadow-2xs"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-600" />
          <div className="text-left">
            <div>Solution with Non-Volatile Solute</div>
            <div className="text-[10px] font-normal opacity-80">Solute blocks surface • Lowered VP (p₁)</div>
          </div>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Surface State</span>
          <div className="text-base font-bold font-mono text-black">
            {hasSolute ? "40% Solute Blocked" : "100% Free Solvent"}
          </div>
          <span className="text-[10px] text-[#555555]">
            {hasSolute ? "Fewer escape trajectories" : "Maximum evaporation rate"}
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Headspace Vapor Count</span>
          <div
            className={`text-base font-bold font-mono ${
              hasSolute ? "text-amber-600" : "text-sky-600"
            }`}
          >
            {hasSolute ? "20 Molecules" : "42 Molecules"}
          </div>
          <span className="text-[10px] text-[#555555]">Active molecules exerting pressure</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Vapour Pressure</span>
          <div className="text-base font-bold font-mono text-black">
            {hasSolute ? "p₁ < p₁° (Depressed)" : "p₁° = 23.8 mm Hg"}
          </div>
          <span className="text-[10px] text-[#555555]">At equilibrium (25 °C)</span>
        </div>
      </div>
    </ThreeDCanvas>
  );
}
