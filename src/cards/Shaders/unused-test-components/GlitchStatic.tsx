import { useRef } from 'react';
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { ShaderMaterial, Vector2 } from 'three';

// Step 1: Define the shader
const GlitchMaterial = shaderMaterial(
  { time: 0, resolution: new Vector2() },
  // Vertex Shader
  `void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
  // Fragment Shader
  `
  uniform float time;
  uniform vec2 resolution;
  
  // Simplex noise function
  vec3 mod289(vec3 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec2 mod289(vec2 x) {
    return x - floor(x * (1.0 / 289.0)) * 289.0;
  }

  vec3 permute(vec3 x) {
    return mod289(((x*34.0)+1.0)*x);
  }

  float snoise(vec2 v)
  {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);

    vec2 i1;
    i1.x = step( x0.y, x0.x );
    i1.y = 1.0 - i1.x;
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;

    i = mod289(i); // Avoid truncation effects in permutation
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
          + i.x + vec3(0.0, i1.x, 1.0 ));

    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;

    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;

    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    float noise = snoise(uv * 10.0 + time * 0.1);
    float contour = mod(noise * 10.0, 1.0);
    vec3 color = mix(vec3(0.5, 0.0, 0.5), vec3(0.0, 0.5, 0.5), contour);

    gl_FragColor = vec4(color, 1.0);
  }`,
);

extend({ GlitchMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    glitchMaterial: ReactThreeFiber.Object3DNode<
      ShaderMaterial,
      typeof ShaderMaterial
    > & {
      resolution?: Vector2;
      time?: number;
    };
  }
}

// Step 2: Create the component and pass animated props
const GlitchOverlay = () => {
  const shaderRef = useRef<ShaderMaterial>(null);

  useFrame(({ clock, size }) => {
    if (!shaderRef.current) return;
    shaderRef.current.uniforms.time.value = clock.getElapsedTime();

    shaderRef.current.uniforms.resolution.value?.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry attach="geometry" args={[8, 8]} />
      <glitchMaterial ref={shaderRef} attach="material" />
    </mesh>
  );
};

export default GlitchOverlay;
