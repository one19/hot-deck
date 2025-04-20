import { useRef } from 'react';
import { extend, ReactThreeFiber, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { ShaderMaterial } from 'three';

// Step 1: Define the shader
const TestMaterial = shaderMaterial(
  {},
  // Vertex Shader
  `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  // Fragment Shader
  `
  varying vec2 vUv;
  
  void main() {
    // vec2 newPos = fract(vUv * 10.0); // subdivide our gradient
  
    gl_FragColor = vec4(vUv, 1.0, 1.0);
  }
  `,
);

extend({ TestMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    testMaterial: ReactThreeFiber.Object3DNode<
      ShaderMaterial,
      typeof ShaderMaterial
    >;
  }
}

// Step 2: Create the component and pass animated props
const GenericTestOverlay = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const { viewport } = useThree();

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry attach="geometry" args={[1, 1]} />
      <testMaterial ref={shaderRef} attach="material" />
    </mesh>
  );
};

export default GenericTestOverlay;
