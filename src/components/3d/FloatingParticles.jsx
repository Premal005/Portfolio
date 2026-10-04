import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as random from 'maath/random';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';

const FloatingParticles = ({ count = 2000 }) => {
  const primaryRef = useRef();
  const secondaryRef = useRef();
  
  const { x, y } = useMousePosition();
  const startTime = useRef(Date.now());
  
  const primaryCount = Math.floor(count * 0.8);
  const secondaryCount = count - primaryCount;

  // Final positions (sphere)
  const [targetPositionsPrimary] = useState(() => {
    const positions = new Float32Array(primaryCount * 3);
    random.inSphere(positions, { radius: 4 });
    return positions;
  });

  const [targetPositionsSecondary] = useState(() => {
    const positions = new Float32Array(secondaryCount * 3);
    random.inSphere(positions, { radius: 4.5 });
    return positions;
  });
  
  // Initial positions (clustered near center)
  const [initialPositionsPrimary] = useState(() => {
    const positions = new Float32Array(primaryCount * 3);
    random.inSphere(positions, { radius: 0.5 });
    return positions;
  });

  const [initialPositionsSecondary] = useState(() => {
    const positions = new Float32Array(secondaryCount * 3);
    random.inSphere(positions, { radius: 0.6 });
    return positions;
  });
  
  useFrame((state, delta) => {
    const elapsed = (Date.now() - startTime.current) / 1000;
    const morphProgress = Math.min(elapsed / 2.5, 1); // 2.5 second morph
    const eased = 1 - Math.pow(1 - morphProgress, 3); // ease out cubic
    
    // Lerp primary positions
    if (primaryRef.current) {
      const positionsPrimary = primaryRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positionsPrimary.length; i++) {
        positionsPrimary[i] = initialPositionsPrimary[i] + (targetPositionsPrimary[i] - initialPositionsPrimary[i]) * eased;
      }
      primaryRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Lerp secondary positions
    if (secondaryRef.current) {
      const positionsSecondary = secondaryRef.current.geometry.attributes.position.array;
      for (let i = 0; i < positionsSecondary.length; i++) {
        positionsSecondary[i] = initialPositionsSecondary[i] + (targetPositionsSecondary[i] - initialPositionsSecondary[i]) * eased;
      }
      secondaryRef.current.geometry.attributes.position.needsUpdate = true;
    }
    
    // Mouse reactivity
    const mx = (x / window.innerWidth - 0.5) * 2;
    const my = (y / window.innerHeight - 0.5) * 2;

    const applyRotation = (ref, speedX, speedY) => {
      if (ref.current) {
        if (morphProgress >= 1) {
          ref.current.rotation.x -= delta * speedX;
          ref.current.rotation.y -= delta * speedY;
        }
        ref.current.rotation.x += (my * 0.3 - ref.current.rotation.x) * 0.02;
        ref.current.rotation.y += (mx * 0.3 - ref.current.rotation.y) * 0.02;
      }
    };

    applyRotation(primaryRef, 1/20, 1/25);
    applyRotation(secondaryRef, 1/15, 1/20);
  });
  
  return (
    <group>
      <points ref={primaryRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={primaryCount}
            array={new Float32Array(initialPositionsPrimary)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.015} color="#ffffff" sizeAttenuation={true} transparent opacity={0.6} />
      </points>
      <points ref={secondaryRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={secondaryCount}
            array={new Float32Array(initialPositionsSecondary)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.01} color="#0071e3" sizeAttenuation={true} transparent opacity={0.8} />
      </points>
    </group>
  );
};

export default FloatingParticles;
