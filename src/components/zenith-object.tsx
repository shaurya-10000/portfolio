"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";

/**
 * Faceted crystal object for the hero scene.
 *
 * A low-poly icosahedron rendered with `MeshTransmissionMaterial` for real
 * refraction through the facets, plus a wireframe "echo" shell at a slightly
 * larger radius rotating at a different rate for parallax depth.
 *
 * Both meshes share the same base icosahedron so the visual reads as a single
 * object with an outer shell, not two unrelated shapes.
 */
export default function ZenithObject() {
  const crystalRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.LineSegments>(null);
  const { resolvedTheme } = useTheme();

  // Build the wireframe geometry once and reuse it. `edgesGeometry` extracts
  // the edges of the icosahedron — cleaner and cheaper than a full wireframe
  // material, and it produces sharp facet outlines instead of triangles.
  const edgesGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1.28, 0)),
    [],
  );

  useFrame((_state, delta) => {
    if (crystalRef.current) {
      crystalRef.current.rotation.x += delta * 0.12;
      crystalRef.current.rotation.y += delta * 0.18;
    }
    if (wireRef.current) {
      // Counter-rotation for parallax — feels like an inner shell.
      wireRef.current.rotation.x -= delta * 0.06;
      wireRef.current.rotation.y -= delta * 0.09;
    }
  });

  const isDark = resolvedTheme !== "light";

  // Crystal body shifts with theme. Light mode uses a darker glass so it
  // reads against the pale background; dark mode uses a pale glass so it
  // catches the rim light.
  const crystalColor = isDark ? "#e4e4e7" : "#3f3f46";
  const wireColor = isDark ? "#a1a1aa" : "#71717a";

  return (
    <Float speed={1.6} rotationIntensity={0.35} floatIntensity={0.9}>
      <group>
        {/* Faceted crystal core */}
        <mesh ref={crystalRef}>
          <icosahedronGeometry args={[1.2, 0]} />
          <MeshTransmissionMaterial
            color={crystalColor}
            transmission={0.95}
            thickness={1.4}
            roughness={0.08}
            ior={1.4}
            chromaticAberration={0.04}
            anisotropy={0.2}
            distortion={0.15}
            distortionScale={0.4}
            temporalDistortion={0.05}
            backside
            backsideThickness={0.3}
            samples={6}
            resolution={512}
          />
        </mesh>

        {/* Wireframe echo — same icosahedron, slightly larger */}
        <lineSegments ref={wireRef} geometry={edgesGeometry}>
          <lineBasicMaterial
            color={wireColor}
            transparent
            opacity={isDark ? 0.35 : 0.5}
          />
        </lineSegments>
      </group>
    </Float>
  );
}