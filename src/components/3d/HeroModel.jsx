import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useAppContext } from '../../context/AppContext';

// Bespoke Quantum Obsidian & Chromatic Fresnel Shader
const coreVertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Controlled quantum micro-fluctuations (sleek, mathematical, never messy)
    float wave = sin(pos.y * 2.5 + uTime * 1.2) * cos(pos.x * 2.5 + uTime * 1.0) * 0.035;
    
    // Subtle mouse magnetic deflection
    float mouseDist = length(pos.xy - uMouse * 1.2);
    float mouseWave = smoothstep(1.5, 0.0, mouseDist) * 0.05;
    
    float disp = wave + mouseWave;
    pos += normal * disp;
    
    vDisplacement = disp;
    vWorldPosition = (modelMatrix * vec4(pos, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const coreFragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;
  varying float vDisplacement;

  void main() {
    // Luxury Obsidian & Electric Spectrum Palette
    vec3 cDark = vec3(0.03, 0.04, 0.07);      // Deep smoked obsidian
    vec3 cCyan = vec3(0.0, 0.95, 1.0);        // Electric cyan rim
    vec3 cViolet = vec3(0.65, 0.20, 1.0);     // Cyber ultraviolet rim
    vec3 cWhite = vec3(1.0, 1.0, 1.0);

    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.2);

    // Rim color gradient that slowly cycles with time
    float rimPhase = dot(vNormal, vec3(0.3, 1.0, 0.5)) + uTime * 0.2;
    vec3 rimColor = mix(cCyan, cViolet, smoothstep(-0.4, 0.4, sin(rimPhase)));

    // Specular studio lights
    vec3 lightDir = normalize(vec3(2.0, 3.5, 3.0));
    vec3 halfVector = normalize(lightDir + viewDir);
    float spec = pow(max(dot(vNormal, halfVector), 0.0), 36.0);

    vec3 color = cDark;
    color += fresnel * rimColor * 2.0;
    color += spec * cWhite * 0.85;

    // Semi-translucent (alpha: 0.65) so typography in front is crisp and completely legible
    gl_FragColor = vec4(color, 0.65);
  }
`;

const HeroModel = () => {
  const masterGroupRef = useRef();
  const coreMeshRef = useRef();
  const wireMeshRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();
  const ring3Ref = useRef();
  const satellitesRef = useRef();
  const materialRef = useRef();

  const { x, y } = useMousePosition();
  const { scrollProgress } = useAppContext();

  // Geometries memoized for top performance
  const coreGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.85, 3), []);
  const wireGeometry = useMemo(() => new THREE.IcosahedronGeometry(0.87, 1), []);
  const ring1Geometry = useMemo(() => new THREE.TorusGeometry(1.25, 0.010, 16, 100), []);
  const ring2Geometry = useMemo(() => new THREE.TorusGeometry(1.52, 0.008, 16, 100), []);
  const ring3Geometry = useMemo(() => new THREE.TorusGeometry(1.78, 0.006, 16, 120), []);
  const satelliteGeometry = useMemo(() => new THREE.SphereGeometry(0.028, 16, 16), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state, delta) => {
    // 1. Update Core Shader Uniforms safely
    if (materialRef.current && materialRef.current.uniforms) {
      materialRef.current.uniforms.uTime.value += delta;

      const mouseX = x !== null ? (x / window.innerWidth) * 2 - 1 : 0;
      const mouseY = y !== null ? -(y / window.innerHeight) * 2 + 1 : 0;
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.08);
    }

    // 2. Core slow multi-axis rotation
    if (coreMeshRef.current) {
      coreMeshRef.current.rotation.x += delta * 0.12;
      coreMeshRef.current.rotation.y += delta * 0.18;
    }
    if (wireMeshRef.current) {
      wireMeshRef.current.rotation.x -= delta * 0.08;
      wireMeshRef.current.rotation.y += delta * 0.14;
    }

    // 3. Gyroscopic Gimbal Rings counter-rotation
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x += delta * 0.22;
      ring1Ref.current.rotation.y += delta * 0.15;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y -= delta * 0.18;
      ring2Ref.current.rotation.z += delta * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x -= delta * 0.10;
      ring3Ref.current.rotation.z -= delta * 0.16;
    }

    // 4. Orbiting satellite nodes
    if (satellitesRef.current) {
      satellitesRef.current.rotation.y += delta * 0.28;
      satellitesRef.current.rotation.x += delta * 0.14;
    }

    // 5. Master tilt on mouse and scroll parallax
    if (masterGroupRef.current) {
      const targetRotationX = y !== null ? (y / window.innerHeight - 0.5) * 0.35 : 0;
      const targetRotationY = x !== null ? (x / window.innerWidth - 0.5) * 0.35 : 0;
      masterGroupRef.current.rotation.x += (targetRotationX - masterGroupRef.current.rotation.x) * 0.05;
      masterGroupRef.current.rotation.y += (targetRotationY - masterGroupRef.current.rotation.y) * 0.05;

      // Smooth scroll depth displacement
      masterGroupRef.current.position.z = THREE.MathUtils.lerp(
        masterGroupRef.current.position.z,
        -1.3 - (scrollProgress || 0) * 3,
        0.1
      );
    }
  });

  return (
    // Positioned at z = -1.3 so it forms an ambient 3D backdrop behind the typography
    <group ref={masterGroupRef} position={[0, 0, -1.3]}>
      {/* 1. Quantum Geodesic Core with Obsidian/Fresnel Shader */}
      <mesh ref={coreMeshRef} geometry={coreGeometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={coreVertexShader}
          fragmentShader={coreFragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* 2. Micro Geodesic Facet Cage (Razor-sharp crystalline wireframe) */}
      <mesh ref={wireMeshRef} geometry={wireGeometry}>
        <meshBasicMaterial
          color="#00f2fe"
          wireframe={true}
          transparent={true}
          opacity={0.12}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Concentric Gyroscopic Precision Gimbal Rings */}
      {/* Ring 1 - Electric Cyan */}
      <mesh ref={ring1Ref} geometry={ring1Geometry} rotation={[Math.PI / 4, 0, 0]}>
        <meshBasicMaterial
          color="#00f2fe"
          transparent={true}
          opacity={0.35}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 2 - Ultraviolet */}
      <mesh ref={ring2Ref} geometry={ring2Geometry} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <meshBasicMaterial
          color="#a855f7"
          transparent={true}
          opacity={0.28}
          depthWrite={false}
        />
      </mesh>

      {/* Ring 3 - Outer Thin Celestial Track */}
      <mesh ref={ring3Ref} geometry={ring3Geometry} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <meshBasicMaterial
          color="#38bdf8"
          transparent={true}
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Orbiting Quantum Data Nodes */}
      <group ref={satellitesRef}>
        <mesh geometry={satelliteGeometry} position={[1.25, 0, 0]}>
          <meshBasicMaterial color="#00f2fe" />
        </mesh>
        <mesh geometry={satelliteGeometry} position={[-1.25, 0, 0]}>
          <meshBasicMaterial color="#a855f7" />
        </mesh>
        <mesh geometry={satelliteGeometry} position={[0, 1.52, 0]}>
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh geometry={satelliteGeometry} position={[0, -1.52, 0]}>
          <meshBasicMaterial color="#38bdf8" />
        </mesh>
      </group>
    </group>
  );
};

export default HeroModel;
