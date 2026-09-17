"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RotateCcw, Play, Pause, Box, Maximize2 } from "lucide-react";

export interface ThreeDSceneController {
  update?: (time: number, delta: number) => void;
  cleanup?: () => void;
  resetCamera?: () => void;
}

export interface ThreeDCanvasProps {
  title: string;
  badge?: string;
  subtitle?: string;
  height?: number | string;
  cameraPosition?: [number, number, number];
  initScene: (
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer
  ) => ThreeDSceneController;
  children?: React.ReactNode;
}

export function ThreeDCanvas({
  title,
  badge = "INTERACTIVE 3D MODEL",
  subtitle,
  height = 420,
  cameraPosition = [0, 2, 6],
  initScene,
  children,
}: ThreeDCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(true);
  const controlsRef = useRef<OrbitControls | null>(null);
  const controllerRef = useRef<ThreeDSceneController | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth || 600;
    const canvasHeight = typeof height === "number" ? height : 420;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#131619");

    const camera = new THREE.PerspectiveCamera(
      45,
      width / canvasHeight,
      0.1,
      100
    );
    camera.position.set(...cameraPosition);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, canvasHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 3. OrbitControls
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = isAutoRotating;
    controls.autoRotateSpeed = 1.5;
    controls.maxDistance = 25;
    controls.minDistance = 1.5;
    controlsRef.current = controls;

    // 4. Initialize child scene logic
    const controller = initScene(scene, camera, renderer);
    controllerRef.current = controller;

    // 5. Animation Loop
    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (now: number) => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = (now - lastTime) * 0.001;
      lastTime = now;

      controls.update();

      if (controller && controller.update) {
        controller.update(now * 0.001, delta);
      }

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 6. Responsive Resize Handling
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      camera.aspect = newWidth / canvasHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, canvasHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // 7. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      controls.dispose();

      if (controller && controller.cleanup) {
        controller.cleanup();
      }

      // Dispose scene objects and geometries
      scene.traverse((object) => {
        if ((object as THREE.Mesh).isMesh) {
          const mesh = object as THREE.Mesh;
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((mat) => mat.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });

      renderer.dispose();
    };
  }, [initScene, cameraPosition, height]);

  // Sync auto-rotation state
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoRotating;
    }
  }, [isAutoRotating]);

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
    if (controllerRef.current?.resetCamera) {
      controllerRef.current.resetCamera();
    }
  };

  return (
    <div className="my-8 rounded-3xl border border-[#E5E5E5] bg-white p-6 sm:p-8 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#E5E5E5] mb-6">
        <div>
          <span
            className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1.5 mb-1.5"
            style={{
              background: "var(--brand-tint)",
              color: "var(--brand)",
              border: "1px solid var(--brand-border)",
            }}
          >
            <Box className="w-3.5 h-3.5" />
            <span>{badge}</span>
          </span>
          <h4 className="text-xl font-bold text-black tracking-tight">{title}</h4>
          {subtitle && <p className="text-xs text-[#555555] mt-0.5">{subtitle}</p>}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAutoRotating(!isAutoRotating)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              isAutoRotating
                ? "bg-neutral-900 text-white"
                : "bg-neutral-100 text-[#555555] hover:bg-neutral-200"
            }`}
            title="Toggle Auto Rotation"
          >
            {isAutoRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isAutoRotating ? "Auto-Rotate On" : "Rotate Off"}</span>
          </button>
          <button
            onClick={handleResetCamera}
            className="p-2 rounded-xl border border-[#E5E5E5] hover:bg-neutral-50 text-[#555555] transition-colors cursor-pointer"
            title="Reset Camera View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D WebGL Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative w-full rounded-2xl overflow-hidden bg-[#131619] border border-neutral-800 flex items-center justify-center shadow-inner"
        style={{ height }}
      >
        <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing" />

        {/* Interactive Helper Overlay */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] font-mono text-neutral-300 pointer-events-none flex items-center gap-2">
          <span>🖱️ Left-Click: Rotate</span>
          <span>•</span>
          <span>Right-Click: Pan</span>
          <span>•</span>
          <span>Scroll: Zoom</span>
        </div>
      </div>

      {/* Children: Specific Model Parameter Sliders & Educational Metrics */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
