import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import HeroModel from './HeroModel';
import FloatingParticles from './FloatingParticles';

const CyclingLight = () => {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      lightRef.current.color.setHSL((time * 0.08) % 1, 0.9, 0.6);
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[3, 1, 3]} 
      intensity={3} 
      distance={14} 
    />
  );
};

const SceneContent = () => {
  return (
    <>
      <fog attach="fog" args={['#000000', 6, 25]} />
      
      <ambientLight intensity={0.6} />
      <directionalLight position={[6, 6, 6]} intensity={2} color="#ffffff" />
      
      {/* Dynamic Cyber Studio Lights */}
      <pointLight position={[-4, 3, 2]} color="#0071e3" intensity={4} distance={15} />
      <pointLight position={[4, -3, 2]} color="#a855f7" intensity={3} distance={15} />
      <pointLight position={[0, 0, 4]} color="#00f2fe" intensity={2} distance={10} />
      
      <CyclingLight />

      {/* Centerpiece 3D Holographic Sculpture */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={1.2}>
        <HeroModel />
      </Float>
      
      {/* 2000 Dynamic Floating Particles */}
      <FloatingParticles count={2000} />
    </>
  );
};

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.4
      }}
      className="w-full h-full"
    >
      <SceneContent />
    </Canvas>
  );
};

export default Scene;
