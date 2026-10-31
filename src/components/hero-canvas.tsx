"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { useTheme } from "next-themes";

import ZenithObject from "@/components/zenith-object";

export default function HeroCanvas() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Defer Canvas mount until after hydration.
  // Three.js touches WebGL + window APIs during init, so mounting it on the
  // server pass produces hydration mismatches and a wasted double-init.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    // Reserve layout space with the same background so there's no flash.
    return <div className="fixed inset-0 -z-10 h-screen w-full bg-background" />;
  }

  const isDark = resolvedTheme !== "light";

  return (
    <div className="fixed inset-0 -z-10 h-screen w-full bg-background transition-colors duration-500">
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        frameloop="always"
      >
        {/* Lighting tuned for the crystal.
            - Ambient sets the floor so the wireframe stays visible.
            - Directional from top-right acts as a key light — it hits the
              facets and drives the refraction sparkle.
            - Point light from bottom-left adds a colored rim, which the
              transmission material picks up as an internal glow. */}
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
          />
          {/* Environment presets changed from city/warehouse to
              night/studio — MeshTransmissionMaterial needs an env map to
              look like glass instead of plastic, and these presets give the
              crystal the sharp highlights it needs. */}
          <Environment preset={isDark ? "night" : "studio"} />
        </Suspense>
      </Canvas>
    </div>
  );
}