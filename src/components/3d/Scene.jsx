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
      lightRef.current.color.setHSL((time * 0.05) % 1, 0.9, 0.6);
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[2, 2, 3]} 
      intensity={2.5} 
      distance={12} 
    />
  );
};

const SceneContent = () => {
  return (
    <>
      <fog attach="fog" args={['#000000', 8, 30]} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.8} color="#ffffff" />
      
      {/* Studio Accent Lights */}
      <pointLight position={[-4, 2, 2]} color="#0071e3" intensity={3} distance={14} />
      <pointLight position={[4, -2, 2]} color="#a855f7" intensity={2.5} distance={14} />
      <pointLight position={[0, 0, 4]} color="#00f2fe" intensity={1.8} distance={10} />
      
      <CyclingLight />

      {/* Centerpiece 3D Sculpture with stable, elegant float */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.35}>
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
      camera={{ position: [0, 0, 5.8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3
      }}
      className="w-full h-full"
    >
      <SceneContent />
    </Canvas>
  );
};

export default Scene;
