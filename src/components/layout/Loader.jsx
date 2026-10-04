import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// 3D Particle Text Component
const ParticleText = ({ onExplode, isExploding }) => {
  const pointsRef = useRef();

  // Generate particle target positions from text "PREMAL"
  const { initialPositions, targetPositions, explodeDirections } = useMemo(() => {
    const text = 'PREMAL';
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '900 90px "Syne", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const targets = [];
    const step = 4; // density sampling step

    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        if (imgData[index] > 128) {
          // Normalize to 3D world space
          const px = (x - canvas.width / 2) * 0.018;
          const py = -(y - canvas.height / 2) * 0.018;
          targets.push(px, py, 0);
        }
      }
    }

    const count = targets.length;
    const initials = [];
    const explodes = [];

    for (let i = 0; i < count; i += 3) {
      // Particles start scattered randomly in a large sphere
      const r = 8 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      initials.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      );

      // Explosive outward velocities
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 18 + 8 // biased towards camera for cinematic blast
      ).normalize();

      explodes.push(dir.x * (14 + Math.random() * 10), dir.y * (14 + Math.random() * 10), dir.z * (18 + Math.random() * 14));
    }

    return {
      initialPositions: new Float32Array(initials),
      targetPositions: new Float32Array(targets),
      explodeDirections: new Float32Array(explodes),
    };
  }, []);

  const currentPositions = useRef(new Float32Array(initialPositions));

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.attributes.position;
    const positions = posAttr.array;
    const time = state.clock.getElapsedTime();

    if (!isExploding) {
      // Morph and assemble particles into "PREMAL"
      const lerpSpeed = 0.08;
      for (let i = 0; i < positions.length; i += 3) {
        // Small breathing noise while formed
        const wave = Math.sin(time * 3 + i) * 0.03;
        positions[i] += (targetPositions[i] - positions[i]) * lerpSpeed;
        positions[i + 1] += (targetPositions[i + 1] + wave - positions[i + 1]) * lerpSpeed;
        positions[i + 2] += (targetPositions[i + 2] - positions[i + 2]) * lerpSpeed;
      }
    } else {
      // Cinematic outward explosion blast
      const explodeSpeed = 0.06;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] += explodeDirections[i] * explodeSpeed;
        positions[i + 1] += explodeDirections[i + 1] * explodeSpeed;
        positions[i + 2] += explodeDirections[i + 2] * explodeSpeed;
      }
    }

    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={initialPositions.length / 3}
          array={currentPositions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.065}
        color="#0071e3"
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

const Loader = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [isExploding, setIsExploding] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Fast, organic counter up to 100%
    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Trigger particle explosion at 100%
          setIsExploding(true);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(() => {
              if (onComplete) onComplete();
            }, 600);
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 7) + 2;
      });
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black overflow-hidden select-none"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 3D Particle Text Canvas */}
          <div className="absolute inset-0 z-0">
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
              <ambientLight intensity={0.5} />
              <pointLight position={[0, 0, 5]} intensity={2} color="#0071e3" />
              <ParticleText isExploding={isExploding} />
            </Canvas>
          </div>

          {/* Minimalist Counter & Progress Bar */}
          <div className="relative z-10 mt-64 flex flex-col items-center pointer-events-none">
            {/* Elegant Line Progress */}
            <div className="w-56 h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                className="h-full bg-gradient-to-r from-accent to-purple-500 rounded-full"
                animate={{ width: `${Math.min(count, 100)}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>

            {/* Monospace Metric Counter */}
            <div className="flex items-center gap-3 text-xs font-mono text-white/50 tracking-widest">
              <span className="text-white font-semibold">{Math.min(count, 100)}%</span>
              <span>//</span>
              <span className="uppercase tracking-[0.25em] text-white/40">
                {isExploding ? 'INITIALIZING INTERFACE' : 'CONVERGING PARTICLES'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;
