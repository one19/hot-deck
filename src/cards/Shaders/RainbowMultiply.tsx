import { useRef } from 'react';
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { SpringValue } from '@react-spring/three';
import { ShaderMaterial, PlaneGeometry } from 'three';

// Step 1: Define the shader
const RainbowShaderMaterial = shaderMaterial(
  { time: 0, rotateX: 0, rotateY: 0, rotateZ: 0 },
  // Vertex Shader
  `void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  // Fragment Shader
  `uniform float rotateX;
  uniform float rotateY;
  uniform float rotateZ;
  
  // Function to create a diamond pattern
  float diamondPattern(vec2 coord, float size) {
    // Rotate the coordinates by 45 degrees
    float angle = 3.14159265 / 4.0; // 45 degrees in radians
    mat2 rotationMatrix = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
    coord = rotationMatrix * (coord / size * 2.0 - 1.0);

    // Calculate the diamond pattern
    return 10.0 - max(abs(coord.x), abs(coord.y));
  }

  void main() {
    // Scale down the card rotation values
    float scaledRotateX = rotateX * 0.1;
    float scaledRotateY = rotateY * 0.1;
    float scaledRotateZ = rotateZ * 0.1;

    // Generate the rotated diamond pattern
    float pattern = diamondPattern(gl_FragCoord.xy, 200.0);

    // Adjust the color calculations based on the pattern
    float r = clamp(0.25 * cos(scaledRotateX + pattern * 3.14), 0.0, 1.0);
    float g = clamp(0.25 * cos(scaledRotateY + pattern * 3.14), 0.0, 1.0);
    float b = clamp(0.25 * cos(scaledRotateZ + pattern * 3.14), 0.0, 1.0);

    // Set the final color with low opacity
    gl_FragColor = vec4(r, g, b, 0.05);
  }`
);

extend({ RainbowShaderMaterial, PlaneGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    rainbowShaderMaterial: ReactThreeFiber.Object3DNode<ShaderMaterial, typeof ShaderMaterial> & {
      rotateX?: number;
      rotateY?: number;
      rotateZ?: number;
    };
  }
}

type Props = {
  rotateX: SpringValue<number>;
  rotateY: SpringValue<number>;
  rotateZ: SpringValue<number>;
};

// Step 2: Create the component and pass animated props
const RainbowEffect = ({ rotateX, rotateY, rotateZ }: Props) => {
  const shaderRef = useRef<ShaderMaterial>(null);

  useFrame(() => {
    if (!shaderRef.current) return;
    // shaderRef.current.uniforms.time.value = clock.getElapsedTime();
    shaderRef.current.uniforms.rotateX.value = rotateX.get();
    shaderRef.current.uniforms.rotateY.value = rotateY.get();
    shaderRef.current.uniforms.rotateZ.value = rotateZ.get();
  });

  return (
    <mesh>
      <planeGeometry attach="geometry" args={[8, 8]} />
      <rainbowShaderMaterial ref={shaderRef} attach="material" />
    </mesh>
  );
};

export default RainbowEffect;
