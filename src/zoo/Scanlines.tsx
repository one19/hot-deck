import { useRef, useEffect, useState } from 'react';
import { useFrame, useThree, extend, Canvas, Object3DNode } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { ShaderMaterial, PlaneGeometry, AdditiveBlending } from 'three';

const ScanlineShaderMaterial = shaderMaterial(
  { time: 0 },
  `void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  `uniform float time;

  void main() {
    float scanline = mod(gl_FragCoord.y, 10.0); // Increase the spacing to make the line fatter
    float intensity = smoothstep(3.0, 4.0, scanline); // Adjust these values to change transition sharpness

    // Using a fully clear color as the base
    vec4 baseColor = vec4(0.0, 0.0, 0.0, 0.0); // Fully transparent
    vec4 multiplyColor = vec4(0.5, 0.6, 0.7, 0.8); // Subtle blue

    // Blend between fully transparent and the blue color based on intensity
    vec4 color = mix(baseColor, multiplyColor, intensity);

    // Apply a time-based fading effect
    float fade = 0.3 + 0.1 * cos(time * 0.5); // Oscillating fade effect
    gl_FragColor = color * fade; // Use the calculated color directly
  }`
);

extend({ ScanlineShaderMaterial, PlaneGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    scanlineShaderMaterial: Object3DNode<ShaderMaterial, typeof ShaderMaterial> & {
      time?: number;
    };
  }
}

const Shader: React.FC = () => {
  const shaderRef = useRef<ShaderMaterial>(null);
  const { size } = useThree();
  const [planeSize, setPlaneSize] = useState<[number, number]>([1, 1]);

  useEffect(() => {
    // Adjust the plane size based on the aspect ratio of the screen
    const aspectRatio = size.width / size.height;
    setPlaneSize([aspectRatio * 10, 10]); // Scale size to cover viewport
  }, [size.width, size.height]);

  useFrame(({ clock }) => {
    if (shaderRef.current) {
      shaderRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry attach="geometry" args={planeSize} />
      <scanlineShaderMaterial ref={shaderRef} attach="material" blending={AdditiveBlending} />
    </mesh>
  );
};

const Scanlines = () => (
  <Canvas
    style={{
      position: 'fixed',
      left: 0,
      top: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 100000,
      pointerEvents: 'none',
      userSelect: 'none',
    }}
  >
    <Shader />
  </Canvas>
);

export default Scanlines;
