"use client";

import React, { useState, useCallback, useRef } from "react";
import * as THREE from "three";
import { ThreeDCanvas, ThreeDSceneController } from "../three-d-canvas";
import { Sliders, CheckCircle2, RotateCw } from "lucide-react";

export function BrassLattice3D() {
  const [isSpaceFilling, setIsSpaceFilling] = useState<boolean>(false);
  const [zincPercentage, setZincPercentage] = useState<number>(30); // 30% Zn in 70% Cu (Brass)
  const atomsGroupRef = useRef<THREE.Group | null>(null);

  const initScene = useCallback(
    (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
      // 1. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
      scene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
      dirLight1.position.set(6, 8, 10);
      scene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 0.8);
      dirLight2.position.set(-6, -4, -6);
      scene.add(dirLight2);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      // Materials
      const cuMaterial = new THREE.MeshStandardMaterial({
        color: 0xc25e2e, // Copper reddish-bronze
        metalness: 0.85,
        roughness: 0.25,
      });

      const znMaterial = new THREE.MeshStandardMaterial({
        color: 0x94a3b8, // Zinc silvery-slate
        metalness: 0.75,
        roughness: 0.2,
      });

      const bondMaterial = new THREE.MeshStandardMaterial({
        color: 0x475569,
        metalness: 0.5,
        roughness: 0.5,
      });

      // Lattice parameters
      const a = 1.8; // half edge length of cell
      const atomRadius = isSpaceFilling ? 0.63 : 0.35; // Space-filling touches along face diagonals

      // FCC Lattice points (8 corners + 6 face centers)
      const positions: { pos: [number, number, number]; isZinc: boolean }[] = [
        // 8 Corners
        { pos: [-a, -a, -a], isZinc: false },
        { pos: [a, -a, -a], isZinc: false },
        { pos: [a, a, -a], isZinc: false },
        { pos: [-a, a, -a], isZinc: true }, // Zn substitute
        { pos: [-a, -a, a], isZinc: false },
        { pos: [a, -a, a], isZinc: true }, // Zn substitute
        { pos: [a, a, a], isZinc: false },
        { pos: [-a, a, a], isZinc: false },

        // 6 Face Centers
        { pos: [0, 0, -a], isZinc: false },
        { pos: [0, 0, a], isZinc: true }, // Zn substitute
        { pos: [0, -a, 0], isZinc: false },
        { pos: [0, a, 0], isZinc: false },
        { pos: [-a, 0, 0], isZinc: false },
        { pos: [a, 0, 0], isZinc: true }, // Zn substitute
      ];

      // Atoms group
      const atomsGroup = new THREE.Group();
      atomsGroupRef.current = atomsGroup;
      rootGroup.add(atomsGroup);

      const sphereGeo = new THREE.SphereGeometry(atomRadius, 32, 32);

      positions.forEach(({ pos, isZinc }) => {
        const material = isZinc && zincPercentage > 0 ? znMaterial : cuMaterial;
        const mesh = new THREE.Mesh(sphereGeo, material);
        mesh.position.set(...pos);
        atomsGroup.add(mesh);
      });

      // 12 Outer Edges of the Cube Unit Cell
      const edges = [
        [[-a, -a, -a], [a, -a, -a]],
        [[a, -a, -a], [a, a, -a]],
        [[a, a, -a], [-a, a, -a]],
        [[-a, a, -a], [-a, -a, -a]],

        [[-a, -a, a], [a, -a, a]],
        [[a, -a, a], [a, a, a]],
        [[a, a, a], [-a, a, a]],
        [[-a, a, a], [-a, -a, a]],

        [[-a, -a, -a], [-a, -a, a]],
        [[a, -a, -a], [a, -a, a]],
        [[a, a, -a], [a, a, a]],
        [[-a, a, -a], [-a, a, a]],
      ];

      const edgeThickness = 0.035;
      edges.forEach(([start, end]) => {
        const p1 = new THREE.Vector3(...start);
        const p2 = new THREE.Vector3(...end);
        const dist = p1.distanceTo(p2);
        const cylGeo = new THREE.CylinderGeometry(edgeThickness, edgeThickness, dist, 12);
        const cylMesh = new THREE.Mesh(cylGeo, bondMaterial);

        const midpoint = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
        cylMesh.position.copy(midpoint);

        const orientation = new THREE.Matrix4();
        orientation.lookAt(p1, p2, new THREE.Vector3(0, 1, 0));
        cylMesh.quaternion.setFromRotationMatrix(orientation);
        cylMesh.rotateX(Math.PI / 2);

        rootGroup.add(cylMesh);
      });

      camera.position.set(3, 2.5, 5);

      const controller: ThreeDSceneController = {
        update: (time) => {
          rootGroup.rotation.y = time * 0.15;
        },
      };

      return controller;
    },
    [isSpaceFilling, zincPercentage]
  );

  return (
    <ThreeDCanvas
      title="3D Substitutional Solid Solution: Brass (Cu–Zn) FCC Lattice"
      badge="TOPIC 2 • 3D SOLID SOLUTION"
      subtitle="Examine a Face-Centered Cubic (FCC) metallic lattice where Zinc solute atoms substitute directly into Copper solvent atomic sites."
      cameraPosition={[3, 2.5, 5]}
      initScene={initScene}
    >
      {/* Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => setIsSpaceFilling(!isSpaceFilling)}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            isSpaceFilling
              ? "bg-rose-50 text-rose-900 border-rose-300"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#C0222E]" />
          <span>{isSpaceFilling ? "Mode: Space-Filling (Close-Packed)" : "Mode: Ball & Stick (Cell Edges Visible)"}</span>
        </button>

        <button
          onClick={() => setZincPercentage((prev) => (prev === 0 ? 30 : 0))}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            zincPercentage > 0
              ? "bg-amber-50 text-amber-900 border-amber-300"
              : "bg-white text-neutral-600 border-[#E5E5E5] hover:bg-neutral-50"
          }`}
        >
          <RotateCw className="w-3.5 h-3.5 text-amber-600" />
          <span>{zincPercentage > 0 ? "Showing Brass (~30% Zn in 70% Cu)" : "Showing Pure Copper (100% Cu)"}</span>
        </button>
      </div>

      {/* Atomic Legend & NCERT Explanation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-[#E5E5E5] text-xs">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-[#C25E2E] shadow-sm flex-shrink-0" />
          <div>
            <strong className="text-black block">Copper Atoms (Solvent, Cu)</strong>
            <span className="text-[#555555]">FCC matrix host metal (Radius = 128 pm).</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-[#94A3B8] shadow-sm flex-shrink-0" />
          <div>
            <strong className="text-black block">Zinc Atoms (Solute, Zn)</strong>
            <span className="text-[#555555]">Substitutes at lattice vertices & faces (Radius = 134 pm).</span>
          </div>
        </div>
      </div>
    </ThreeDCanvas>
  );
}
