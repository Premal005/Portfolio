import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';
import HeroModel from './HeroModel';
import FloatingParticles from './FloatingParticles';

const CyclingLight = () => {
  const lightRef = useRef();

  useFrame((state) => {
    if (lightRef.current) {
      const time = state.clock.getElapsedTime();
      // Shift hue slowly
      lightRef.current.color.setHSL((time * 0.1) % 1, 0.8, 0.5);
    }
  });

  return (
    <pointLight 
      ref={lightRef}
      position={[2, 0, 2]} 
      intensity={0.5} 
      distance={10} 
    />
  );
};

const SceneContent = () => {
  return (
    <>
      <fog attach="fog" args={['#000000', 3, 12]} />
      
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Accent lights */}
      <pointLight position={[-3, 2, -3]} color="#0071e3" intensity={2} distance={10} />
      <pointLight position={[3, -2, 3]} color="#a855f7" intensity={0.5} distance={10} />
      
      <CyclingLight />

      <Environment preset="city" />

      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <HeroModel />
      </Float>
      
      <FloatingParticles count={2000} />
    </>
  );
};

const Scene = () => {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
      className="w-full h-full"
    >
      <SceneContent />
    </Canvas>
  );
};

export default Scene;
