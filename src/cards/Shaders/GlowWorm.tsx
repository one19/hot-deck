import * as THREE from 'three';
import { extend, ReactThreeFiber, useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { ShaderMaterial, Vector2 } from 'three';
import { useRef } from 'react';

// ShaderMaterial setup
const BorderShaderMaterial = shaderMaterial(
  {
    uTime: 0,
    uResolution: new THREE.Vector2(),
    uColor: new THREE.Color(0.5, 0.8, 1),
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec2 uResolution;
    uniform vec3 uColor;
    varying vec2 vUv;
    
    void main() {
      // Calculate distance from edges to create a border effect
      float borderWidth = 0.05; // Thickness of the border
      float edgeDistX = min(vUv.x, 1.0 - vUv.x);
      float edgeDistY = min(vUv.y, 1.0 - vUv.y);
      float edgeDist = min(edgeDistX, edgeDistY);
      
      // Glowing effect with animation
      float glow = 0.1 + 0.3 * sin(uTime * 5.0 + vUv.x * 10.0);
      
      // Smooth step for a soft border
      float border = smoothstep(borderWidth, borderWidth + 0.02, edgeDist);
      
      // Combine border and glow
      float finalGlow = (1.0 - border) * glow;
      
      // Set fragment color with the glowing border effect
      gl_FragColor = vec4(uColor * finalGlow, 0.2);
    }
  `
);

extend({ BorderShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    borderShaderMaterial: ReactThreeFiber.Node<ShaderMaterial, typeof ShaderMaterial>;
  }
}

const GlowingWormBorder = () => {
  const materialRef = useRef<ShaderMaterial & { uTime: number; uResolution: Vector2 }>(null!);
  const { size } = useThree();

  useFrame(({ clock }) => {
    if (!materialRef.current) return;

    materialRef.current.uTime = clock.getElapsedTime();
    materialRef.current.uResolution.set(size.width, size.height);
  });

  return (
    <mesh scale={new THREE.Vector3(size.width, size.height)}>
      <planeGeometry attach="geometry" />
      {/* Use the custom shader material */}
      <borderShaderMaterial ref={materialRef} attach="material" />
    </mesh>
  );
};

export default GlowingWormBorder;
