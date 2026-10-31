"use client";

import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Lightformer,
  PerformanceMonitor,
} from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import ZenithObject from "@/components/zenith-object";

const DPR_HIGH = 1.5;
const DPR_LOW = 1;

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(DPR_HIGH);

  // Defer Canvas mount until after hydration.
  // Three.js touches WebGL + window APIs during init, so mounting it on the
  // server pass produces hydration mismatches and a wasted double-init.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) {
    // Reserve layout space with the same background so there's no flash.
    return <div className="fixed inset-0 -z-10 h-screen w-full bg-background" />;
  }

  const isDark = resolvedTheme !== "light";

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full bg-background transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={dpr}
        frameloop="always"
      >
        {/* Drop resolution automatically if the device can't keep up. */}
        <PerformanceMonitor
          onDecline={() => setDpr(DPR_LOW)}
          onIncline={() => setDpr(DPR_HIGH)}
        />

        {/* Lighting tuned for the crystal.
            - Ambient sets the floor so the wireframe stays visible.
            - Directional from top-right acts as a key light.
            - Point light from bottom-left adds a colored rim. */}
        <ambientLight intensity={isDark ? 0.4 : 1} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={isDark ? 1.2 : 2}
          color={isDark ? "#fafafa" : "#ffffff"}
        />
        <pointLight
          position={[-5, -5, -5]}
          intensity={isDark ? 0.6 : 1.2}
          color={isDark ? "#818cf8" : "#fbbf24"}
        />

        <Suspense fallback={null}>
          <ZenithObject />
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={isDark ? 0.4 : 0.2}
            scale={10}
            blur={2.5}
            far={4}
            resolution={256}
          />
          {/* Procedural environment: rendered once to a small cube map, so
              there is no HDR download and no third-party request.
              MeshTransmissionMaterial still gets sharp highlights to refract. */}
          <Environment resolution={256} frames={1} background={false}>
            <color attach="background" args={[isDark ? "#05060a" : "#e8e8ec"]} />
            <Lightformer
              form="rect"
              intensity={isDark ? 2.5 : 3}
              position={[0, 5, -4]}
              scale={[10, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={isDark ? 1.5 : 2}
              position={[-5, 1, 2]}
              rotation-y={Math.PI / 2}
              scale={[8, 2, 1]}
              color={isDark ? "#818cf8" : "#fbbf24"}
            />
            <Lightformer
              form="rect"
              intensity={isDark ? 1.5 : 2}
              position={[5, -1, 2]}
              rotation-y={-Math.PI / 2}
              scale={[8, 2, 1]}
            />
            <Lightformer
              form="ring"
              intensity={isDark ? 2 : 2.5}
              position={[0, 0, 6]}
              scale={4}
            />
          </Environment>
        </Suspense>
      </Canvas>
    </div>
  );
}