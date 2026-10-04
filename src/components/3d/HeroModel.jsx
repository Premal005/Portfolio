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

  // Classic Simplex 3D noise
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
    
    // Multi-frequency noise pulse
    float noise1 = snoise(pos * 1.2 + uTime * 0.3) * 0.25;
    float noise2 = snoise(pos * 2.4 - uTime * 0.2) * 0.1;
    
    float mouseDist = length(pos.xy - uMouse * 2.0);
    float mouseInfluence = smoothstep(1.8, 0.0, mouseDist) * 0.2;
    float displacement = noise1 + noise2 + mouseInfluence;
    
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
    // Ultra-vibrant iridescent palette: Electric Blue, Cyan, Purple, Magenta
    vec3 cBlue = vec3(0.0, 0.443, 0.89);
    vec3 cCyan = vec3(0.0, 0.85, 1.0);
    vec3 cPurple = vec3(0.65, 0.2, 0.95);
    vec3 cPink = vec3(1.0, 0.2, 0.6);
    
    float t = vDisplacement * 3.5 + uTime * 0.25;
    
    vec3 color = mix(cBlue, cCyan, smoothstep(-0.2, 0.2, sin(t)));
    color = mix(color, cPurple, smoothstep(-0.2, 0.2, sin(t + 2.094)));
    color = mix(color, cPink, smoothstep(-0.2, 0.2, sin(t * 0.8 + 4.189)) * 0.4);
    
    // Fresnel Rim Glow
    vec3 viewDir = normalize(cameraPosition - vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.5);
    color += fresnel * vec3(0.4, 0.8, 1.0) * 1.5;
    
    // Internal luminosity
    color += (vDisplacement + 0.2) * vec3(0.2, 0.4, 0.8);
    
    gl_FragColor = vec4(color, 0.92);
  }
`;

const HeroModel = () => {
  const groupRef = useRef();
  const materialRef = useRef();
  
  const { x, y } = useMousePosition();
  const { scrollProgress } = useAppContext();
  
  // High-poly geometry for silky displacement
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(1.6, 64), []);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
  }), []);

  useFrame((state, delta) => {
    // Safely update shader uniforms
    if (materialRef.current && materialRef.current.uniforms) {
      materialRef.current.uniforms.uTime.value += delta;
      
      const mouseX = (x / window.innerWidth) * 2 - 1;
      const mouseY = -(y / window.innerHeight) * 2 + 1;
      materialRef.current.uniforms.uMouse.value.lerp(new THREE.Vector2(mouseX, mouseY), 0.08);
    }
    
    if (groupRef.current) {
      // Base continuous rotation
      groupRef.current.rotation.x += delta * 0.12;
      groupRef.current.rotation.y += delta * 0.18;
      
      // Mouse interactive tilt
      const targetRotationX = (y / window.innerHeight - 0.5) * 0.6;
      const targetRotationY = (x / window.innerWidth - 0.5) * 0.6;
      groupRef.current.rotation.x += (targetRotationX - groupRef.current.rotation.x) * 0.05;
      groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.05;
      
      // Gentle depth push on scroll
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        -(scrollProgress || 0) * 4,
        0.1
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Primary Displaced Mesh */}
      <mesh geometry={geometry}>
        <shaderMaterial
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Outer Luminous Wireframe Halo */}
      <mesh geometry={geometry} scale={1.03}>
        <meshBasicMaterial 
          color="#00f2fe" 
          wireframe={true} 
          transparent={true} 
          opacity={0.08} 
        />
      </mesh>
    </group>
  );
};

export default HeroModel;
