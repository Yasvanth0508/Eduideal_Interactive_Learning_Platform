"use client";

import React from "react";
import * as THREE from "three";
import { Box } from "lucide-react";
import { ThreeDBlock, ThreeDBlockData, ContentBlockWithDetails } from "@/types/content";
import { ThreeDCanvas } from "./three-d/three-d-canvas";

interface ThreeDBlockRendererProps {
  block: ThreeDBlock | ContentBlockWithDetails;
}

export function ThreeDBlockRenderer({ block }: ThreeDBlockRendererProps) {
  const threeDData: ThreeDBlockData | undefined =
    ("data" in block && block.data ? (block.data as ThreeDBlockData) : undefined) ||
    ("threeDConfig" in block && block.threeDConfig ? block.threeDConfig : undefined);

  if (!threeDData) {
    return (
      <div className="w-full p-8 rounded-2xl bg-[#FAFAFA] border border-[#E5E5E5] text-center text-sm text-[#555555] flex flex-col items-center gap-3">
        <Box className="w-8 h-8 text-slate-400" />
        <p>No 3D model configuration provided for this block.</p>
      </div>
    );
  }

  const { title, subtitle, badge, cameraPosition } = threeDData;

  // Scene setup for interactive 3D model visualization
  const initScene = (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => {
    renderer.setClearColor(0xffffff, 1);

    // Ambient + directional lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.8);
    dirLight1.position.set(5, 10, 7);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xc0222e, 0.4);
    dirLight2.position.set(-5, -5, -5);
    scene.add(dirLight2);

    // Subtle coordinate plane grid
    const grid = new THREE.GridHelper(10, 20, 0xe2e8f0, 0xf1f5f9);
    grid.position.y = -1.5;
    scene.add(grid);

    // Group for objects
    const group = new THREE.Group();
    scene.add(group);

    const disposables: { dispose: () => void }[] = [];

    if (threeDData.modelId === "solution-molecules" || threeDData.modelId?.includes("solution")) {
      // Chemistry Molecular Solution Visualization: Solute Ion + Solvent Hydration Shell
      // Central Solute Cation (e.g. Na+)
      const cationGeo = new THREE.SphereGeometry(0.55, 32, 32);
      const cationMat = new THREE.MeshStandardMaterial({
        color: 0x9333ea, // Purple
        roughness: 0.2,
        metalness: 0.3,
      });
      const cation = new THREE.Mesh(cationGeo, cationMat);
      cation.position.set(-0.6, 0, 0);
      group.add(cation);
      disposables.push(cationGeo, cationMat);

      // Central Solute Anion (e.g. Cl-)
      const anionGeo = new THREE.SphereGeometry(0.7, 32, 32);
      const anionMat = new THREE.MeshStandardMaterial({
        color: 0x16a34a, // Green
        roughness: 0.2,
        metalness: 0.3,
      });
      const anion = new THREE.Mesh(anionGeo, anionMat);
      anion.position.set(0.6, 0, 0);
      group.add(anion);
      disposables.push(anionGeo, anionMat);

      // Surrounding Solvent Water Dipoles (H2O: Red Oxygen + White Hydrogens)
      const waterGroup = new THREE.Group();
      group.add(waterGroup);

      const oxygenGeo = new THREE.SphereGeometry(0.25, 16, 16);
      const oxygenMat = new THREE.MeshStandardMaterial({ color: 0xef4444 }); // Red
      const hydrogenGeo = new THREE.SphereGeometry(0.14, 16, 16);
      const hydrogenMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc }); // White
      disposables.push(oxygenGeo, oxygenMat, hydrogenGeo, hydrogenMat);

      const numWaterMols = 8;
      for (let i = 0; i < numWaterMols; i++) {
        const mol = new THREE.Group();
        const angle = (i / numWaterMols) * Math.PI * 2;
        const radius = 1.9 + Math.sin(i * 2) * 0.3;
        mol.position.set(Math.cos(angle) * radius, (Math.sin(i * 3) * 0.6), Math.sin(angle) * radius);

        const oxygen = new THREE.Mesh(oxygenGeo, oxygenMat);
        mol.add(oxygen);

        const h1 = new THREE.Mesh(hydrogenGeo, hydrogenMat);
        h1.position.set(0.2, 0.15, 0);
        mol.add(h1);

        const h2 = new THREE.Mesh(hydrogenGeo, hydrogenMat);
        h2.position.set(-0.2, 0.15, 0);
        mol.add(h2);

        mol.rotation.z = angle;
        waterGroup.add(mol);
      }

      return {
        update: (time: number) => {
          group.rotation.y = time * 0.35;
          waterGroup.rotation.x = Math.sin(time * 0.5) * 0.2;
          waterGroup.rotation.z = Math.cos(time * 0.5) * 0.2;
        },
        cleanup: () => {
          disposables.forEach((d) => d.dispose());
        },
      };
    }

    // Default Central geometric placeholder representation
    const geometry = new THREE.IcosahedronGeometry(1.2, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const line = new THREE.LineSegments(
      wireframeGeometry,
      new THREE.LineBasicMaterial({ color: 0xc0222e, linewidth: 2 })
    );
    group.add(line);

    const coreMesh = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: 0xfaeed9,
        roughness: 0.3,
        metalness: 0.1,
        transparent: true,
        opacity: 0.85,
      })
    );
    group.add(coreMesh);

    return {
      update: (time: number) => {
        group.rotation.x = time * 0.3;
        group.rotation.y = time * 0.4;
      },
      cleanup: () => {
        geometry.dispose();
        wireframeGeometry.dispose();
      },
    };
  };

  return (
    <div className="my-8 w-full max-w-4xl mx-auto">
      <ThreeDCanvas
        title={title || block.title || "Interactive 3D Model"}
        subtitle={subtitle || block.description || undefined}
        badge={badge || "3D VISUALIZATION"}
        cameraPosition={cameraPosition || [0, 2, 5]}
        initScene={initScene}
      />
    </div>
  );
}
