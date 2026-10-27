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

    // Central geometric placeholder representation
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
