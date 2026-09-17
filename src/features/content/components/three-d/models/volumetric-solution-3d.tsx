"use client";

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { ThreeDCanvas, ThreeDSceneController } from "../three-d-canvas";
import { FlaskConical, Sparkles } from "lucide-react";

export function VolumetricSolution3D() {
  const [molarity, setMolarity] = useState<number>(1.0); // mol/L
  const particlesGroupRef = useRef<THREE.Group | null>(null);

  const initScene = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // 1. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight1.position.set(5, 8, 8);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 1.0);
      dirLight2.position.set(-5, -2, -5);
      scene.add(dirLight2);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Glass Material (translucent)
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.85,
        transparent: true,
        opacity: 0.35,
        reflectivity: 0.9,
      });

      // Liquid Material (translucent blue)
      const liquidMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        metalness: 0.1,
        roughness: 0.2,
        transparent: true,
        opacity: 0.6,
      });

      // Calibration Mark Ring (Red neon)
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xef4444,
      });

      // Solute Particle Material (Amber glow)
      const soluteMaterial = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        metalness: 0.3,
        roughness: 0.3,
        emissive: 0xd97706,
        emissiveIntensity: 0.4,
      });

      // 2. Glass Flask Body (Compound mesh: Bottom sphere + neck cylinder)
      const flaskBulbGeo = new THREE.SphereGeometry(1.6, 32, 32);
      const flaskBulb = new THREE.Mesh(flaskBulbGeo, glassMaterial);
      flaskBulb.position.set(0, -0.2, 0);
      rootGroup.add(flaskBulb);

      const flaskNeckGeo = new THREE.CylinderGeometry(0.4, 0.4, 2.4, 32, 1, true);
      const flaskNeck = new THREE.Mesh(flaskNeckGeo, glassMaterial);
      flaskNeck.position.set(0, 1.8, 0);
      rootGroup.add(flaskNeck);

      // Flat base
      const baseGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.1, 32);
      const baseMesh = new THREE.Mesh(baseGeo, glassMaterial);
      baseMesh.position.set(0, -1.7, 0);
      rootGroup.add(baseMesh);

      // Calibration Ring at Neck
      const ringGeo = new THREE.TorusGeometry(0.41, 0.02, 16, 64);
      const ringMesh = new THREE.Mesh(ringGeo, ringMaterial);
      ringMesh.rotation.x = Math.PI / 2;
      ringMesh.position.set(0, 2.2, 0);
      rootGroup.add(ringMesh);

      // 3. Liquid Body inside Flask
      const liquidBulbGeo = new THREE.SphereGeometry(1.52, 32, 32);
      const liquidBulb = new THREE.Mesh(liquidBulbGeo, liquidMaterial);
      liquidBulb.position.set(0, -0.2, 0);
      rootGroup.add(liquidBulb);

      const liquidNeckGeo = new THREE.CylinderGeometry(0.38, 0.38, 1.6, 32);
      const liquidNeck = new THREE.Mesh(liquidNeckGeo, liquidMaterial);
      liquidNeck.position.set(0, 1.4, 0);
      rootGroup.add(liquidNeck);

      // 4. Solute Particle Cloud
      const particlesGroup = new THREE.Group();
      particlesGroupRef.current = particlesGroup;
      rootGroup.add(particlesGroup);

      const particleCount = Math.round(molarity * 70);
      const pGeo = new THREE.SphereGeometry(0.065, 12, 12);

      for (let i = 0; i < particleCount; i++) {
        // Random point inside sphere bulb (r < 1.35)
        const u = Math.random();
        const r = 1.35 * Math.cbrt(u);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta) - 0.2;
        const z = r * Math.cos(phi);

        const pMesh = new THREE.Mesh(pGeo, soluteMaterial);
        pMesh.position.set(x, y, z);
        particlesGroup.add(pMesh);
      }

      camera.position.set(0, 1.2, 5.5);

      const controller: ThreeDSceneController = {
        update: (time) => {
          rootGroup.rotation.y = time * 0.2;
        },
      };

      return controller;
    },
    [molarity]
  );

  return (
    <ThreeDCanvas
      title="3D Volumetric Flask: Solute Concentration (Molarity)"
      badge="TOPIC 3 • 3D VOLUMETRIC SOLUTION"
      subtitle="Observe how increasing Molarity increases solute particle density within a standard calibrated 1.000 Liter volumetric flask."
      cameraPosition={[0, 1.2, 5.5]}
      initScene={initScene}
    >
      {/* Slider Control for Molarity */}
      <div className="bg-[#F8F9FA] rounded-2xl p-5 border border-[#E5E5E5] mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-black uppercase tracking-wider">
              Solution Molarity (M = moles / Liter)
            </span>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-[#C0222E] text-white">
              {molarity.toFixed(1)} M
            </span>
          </div>
          <span className="text-xs text-[#555555]">
            Flask Volume = <strong className="text-black font-mono">1.000 L (at 20 °C)</strong>
          </span>
        </div>

        <input
          type="range"
          min={0.2}
          max={2.0}
          step={0.2}
          value={molarity}
          onChange={(e) => setMolarity(parseFloat(e.target.value))}
          className="w-full accent-[#C0222E] cursor-pointer"
        />

        <div className="flex justify-between text-[10px] font-mono text-[#888888] mt-1.5">
          <span>0.2 M (Dilute)</span>
          <span>1.0 M (Standard Decinormal / Normal)</span>
          <span>2.0 M (Concentrated)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Solute Amount (n)</span>
          <div className="text-base font-bold font-mono text-black">
            {(molarity * 1.0).toFixed(2)} moles
          </div>
          <span className="text-[10px] text-[#555555]">In 1.000 L volume</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Total Particle Count</span>
          <div className="text-base font-bold font-mono text-amber-600">
            {(molarity * 6.022).toFixed(2)} × 10²³
          </div>
          <span className="text-[10px] text-[#555555]">Individual dissolved molecules</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-[#E5E5E5]">
          <span className="text-[10px] uppercase font-bold text-[#888888] block mb-0.5">Calibration Mark</span>
          <div className="text-base font-bold font-mono text-rose-600">
            Red Meniscus Ring
          </div>
          <span className="text-[10px] text-[#555555]">Calibrated at bottom of curve</span>
        </div>
      </div>
    </ThreeDCanvas>
  );
}
