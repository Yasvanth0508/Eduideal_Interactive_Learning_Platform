"use client";

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { ThreeDCanvas, ThreeDSceneController } from "../three-d-canvas";
import { Layers, Zap, Info } from "lucide-react";

export function HydrationShell3D() {
  const [showDipoleVectors, setShowDipoleVectors] = useState<boolean>(true);
  const [showClShell, setShowClShell] = useState<boolean>(true);
  const vectorsGroupRef = useRef<THREE.Group | null>(null);
  const clGroupRef = useRef<THREE.Group | null>(null);

  // Sync state with Three.js scene groups
  const handleToggleVectors = () => {
    const next = !showDipoleVectors;
    setShowDipoleVectors(next);
    if (vectorsGroupRef.current) {
      vectorsGroupRef.current.visible = next;
    }
  };

  const handleToggleCl = () => {
    const next = !showClShell;
    setShowClShell(next);
    if (clGroupRef.current) {
      clGroupRef.current.visible = next;
    }
  };

  const initScene = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // 1. Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
      dirLight1.position.set(5, 10, 7);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0x38bdf8, 0.6);
      dirLight2.position.set(-5, -5, -5);
      scene.add(dirLight2);

      // Root container for slow animation
      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Group for dipole interaction lines
      const vectorsGroup = new THREE.Group();
      vectorsGroup.visible = showDipoleVectors;
      vectorsGroupRef.current = vectorsGroup;
      rootGroup.add(vectorsGroup);

      // Material definitions
      const naMaterial = new THREE.MeshStandardMaterial({
        color: 0x2563eb,
        roughness: 0.2,
        metalness: 0.3,
      });

      const clMaterial = new THREE.MeshStandardMaterial({
        color: 0x16a34a,
        roughness: 0.3,
        metalness: 0.2,
      });

      const oxygenMaterial = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.3,
      });

      const hydrogenMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8fafc,
        roughness: 0.1,
      });

      const bondMaterial = new THREE.MeshBasicMaterial({
        color: 0x94a3b8,
      });

      const vectorLineMaterial = new THREE.LineDashedMaterial({
        color: 0xfbbf24,
        dashSize: 0.1,
        gapSize: 0.05,
      });

      // Helper to build a 3D bent water molecule
      const createWaterMolecule = (
        targetCenter: THREE.Vector3,
        distance: number,
        polarAngle: number,
        azimuthAngle: number,
        orientOxygenInward: boolean
      ) => {
        const waterGroup = new THREE.Group();

        // Oxygen sphere
        const oGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const oMesh = new THREE.Mesh(oGeo, oxygenMaterial);
        waterGroup.add(oMesh);

        // Hydrogens
        const hGeo = new THREE.SphereGeometry(0.12, 12, 12);
        const h1Mesh = new THREE.Mesh(hGeo, hydrogenMaterial);
        const h2Mesh = new THREE.Mesh(hGeo, hydrogenMaterial);

        // H-O-H geometry (104.5 degrees)
        const bondLength = 0.28;
        const angle = (104.5 * Math.PI) / 360;
        h1Mesh.position.set(
          Math.sin(angle) * bondLength,
          orientOxygenInward ? Math.cos(angle) * bondLength : -Math.cos(angle) * bondLength,
          0
        );
        h2Mesh.position.set(
          -Math.sin(angle) * bondLength,
          orientOxygenInward ? Math.cos(angle) * bondLength : -Math.cos(angle) * bondLength,
          0
        );
        waterGroup.add(h1Mesh);
        waterGroup.add(h2Mesh);

        // Position water around center
        const pos = new THREE.Vector3(
          distance * Math.sin(polarAngle) * Math.cos(azimuthAngle),
          distance * Math.cos(polarAngle),
          distance * Math.sin(polarAngle) * Math.sin(azimuthAngle)
        );
        waterGroup.position.copy(targetCenter).add(pos);

        // Orient oxygen toward or away from ion
        waterGroup.lookAt(targetCenter);
        if (!orientOxygenInward) {
          waterGroup.rotateX(Math.PI);
        }

        // Electrostatic attraction line
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          targetCenter,
          waterGroup.position,
        ]);
        const line = new THREE.Line(lineGeo, vectorLineMaterial);
        line.computeLineDistances();
        vectorsGroup.add(line);

        return waterGroup;
      };

      // ---------------------------------------------
      // 2. Na+ Cation & Hydration Sphere (Center = -1.8, 0, 0)
      // ---------------------------------------------
      const naCenter = new THREE.Vector3(-1.8, 0, 0);
      const naGeo = new THREE.SphereGeometry(0.48, 32, 32);
      const naMesh = new THREE.Mesh(naGeo, naMaterial);
      naMesh.position.copy(naCenter);
      rootGroup.add(naMesh);

      // Octahedral 6 water molecules for Na+ (Oxygen faces inward towards Na+)
      const shellDirections = [
        [0, 0],
        [Math.PI, 0],
        [Math.PI / 2, 0],
        [Math.PI / 2, Math.PI / 2],
        [Math.PI / 2, Math.PI],
        [Math.PI / 2, (3 * Math.PI) / 2],
      ];

      shellDirections.forEach(([polar, azim]) => {
        const water = createWaterMolecule(naCenter, 1.1, polar, azim, true);
        rootGroup.add(water);
      });

      // ---------------------------------------------
      // 3. Cl- Anion & Hydration Sphere (Center = +1.8, 0, 0)
      // ---------------------------------------------
      const clGroup = new THREE.Group();
      clGroup.visible = showClShell;
      clGroupRef.current = clGroup;
      rootGroup.add(clGroup);

      const clCenter = new THREE.Vector3(1.8, 0, 0);
      const clGeo = new THREE.SphereGeometry(0.68, 32, 32);
      const clMesh = new THREE.Mesh(clGeo, clMaterial);
      clMesh.position.copy(clCenter);
      clGroup.add(clMesh);

      // Octahedral 6 water molecules for Cl- (Hydrogens face inward towards Cl-)
      shellDirections.forEach(([polar, azim]) => {
        const water = createWaterMolecule(clCenter, 1.35, polar, azim, false);
        clGroup.add(water);
      });

      // Camera start
      camera.position.set(0, 1.5, 6);

      const controller: ThreeDSceneController = {
        update: (time) => {
          rootGroup.rotation.y = time * 0.2;
        },
      };

      return controller;
    },
    [showDipoleVectors, showClShell]
  );

  return (
    <ThreeDCanvas
      title="3D Ionic Solvation: Na⁺ and Cl⁻ Hydration Shells"
      badge="TOPIC 1 • 3D MOLECULAR SOLVATION"
      subtitle="Observe how dipolar water molecules surround separated ions. Oxygen (δ⁻) coordinates toward Na⁺, while Hydrogen (δ⁺) coordinates toward Cl⁻."
      initScene={initScene}
    >
      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          onClick={handleToggleVectors}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            showDipoleVectors
              ? "bg-amber-50 text-amber-900 border-amber-300"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-amber-500" />
          <span>{showDipoleVectors ? "Hide Ion-Dipole Vectors" : "Show Ion-Dipole Vectors"}</span>
        </button>

        <button
          onClick={handleToggleCl}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            showClShell
              ? "bg-emerald-50 text-emerald-900 border-emerald-300"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-emerald-600" />
          <span>{showClShell ? "Displaying Both Na⁺ & Cl⁻" : "Displaying Na⁺ Only"}</span>
        </button>
      </div>

      {/* Atomic Legend */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F8F9FA] p-3 rounded-2xl border border-[#E5E5E5] text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 inline-block shadow-xs" />
          <span className="font-semibold text-neutral-800">Na⁺ Cation (Small)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-emerald-600 inline-block shadow-xs" />
          <span className="font-semibold text-neutral-800">Cl⁻ Anion (Large)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500 inline-block shadow-xs" />
          <span className="font-semibold text-neutral-800">Oxygen (δ⁻ Dipole)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-white border border-neutral-400 inline-block shadow-xs" />
          <span className="font-semibold text-neutral-800">Hydrogen (δ⁺ Dipole)</span>
        </div>
      </div>
    </ThreeDCanvas>
  );
}
