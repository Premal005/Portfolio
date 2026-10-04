import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMousePosition } from '../../hooks/useMousePosition';
import { useAppContext } from '../../context/AppContext';

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;
  varying vec3 vPosition;

  // Simplex 3D noise
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod(i, 289.0);
    vec4 p = permute( permute( permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec3 pos = position;
    
    // Multi-layered noise displacement
    float noise1 = snoise(pos * 1.5 + uTime * 0.2) * 0.15;
    float noise2 = snoise(pos * 3.0 + uTime * 0.3) * 0.05;
    float noise3 = snoise(pos * 0.5 + uTime * 0.1) * 0.1;
    
    // Mouse influence on displacement
    float mouseInfluence = smoothstep(2.0, 0.0, length(pos.xy - uMouse * 2.0));
    float displacement = noise1 + noise2 + noise3 + mouseInfluence * 0.15;
    
    pos += normal * displacement;
    
    vDisplacement = displacement;
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying float vDisplacement;
  varying vec3 vPosition;

  void main() {
    // Iridescent color palette
    vec3 color1 = vec3(0.0, 0.443, 0.89);   // #0071e3 blue
    vec3 color2 = vec3(0.659, 0.333, 0.969); // purple
    vec3 color3 = vec3(0.0, 0.878, 0.761);   // cyan/teal
    vec3 color4 = vec3(0.961, 0.388, 0.569); // pink
    
    // Flow based on noise displacement + time
    float t = vDisplacement * 4.0 + uTime * 0.15;
    
    // Multi-color interpolation for iridescence
    vec3 color = mix(color1, color2, smoothstep(-0.2, 0.2, sin(t)));
    color = mix(color, color3, smoothstep(-0.2, 0.2, sin(t * 1.5 + 2.094)));
    color = mix(color, color4, smoothstep(-0.2, 0.2, sin(t * 0.7 + 4.189)) * 0.3);
    
    // Fresnel rim lighting - makes edges glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 3.0);
    color += fresnel * vec3(0.3, 0.5, 1.0) * 0.8;
    
    // Subtle inner glow based on displacement
    color += vDisplacement * vec3(0.2, 0.1, 0.4);
    
    // Slight transparency at edges
    float alpha = 0.85 + fresnel * 0.15;
    
    gl_FragColor = vec4(color, alpha);
  }
`;

const HeroModel = () => {
  const meshRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();
  
  const { x, y } = useMousePosition();
  const { scrollProgress } = useAppContext();
  
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.5, 64), []);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uTime += delta;
      
      const mouseX = (x / window.innerWidth) * 2 - 1;
      const mouseY = -(y / window.innerHeight) * 2 + 1;
      
      materialRef.current.uMouse.lerp(new THREE.Vector2(mouseX, mouseY), 0.1);
    }
    
    if (groupRef.current) {
      // Slow base rotation
      groupRef.current.rotation.x += delta * 0.1;
      groupRef.current.rotation.y += delta * 0.15;
      
      // Mouse reactive rotation
      const targetRotationX = (y / window.innerHeight - 0.5) * 0.5;
      const targetRotationY = (x / window.innerWidth - 0.5) * 0.5;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      
      // Push back on scroll
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        -scrollProgress * 5,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2() }
          }}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Wireframe layer */}
      <mesh geometry={geometry} scale={1.02}>
        <meshBasicMaterial 
          color="#ffffff" 
          wireframe={true} 
          transparent={true} 
          opacity={0.03} 
        />
      </mesh>
    </group>
  );
};

export default HeroModel;
