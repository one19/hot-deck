import { useRef } from 'react';
import { useFrame, extend, ReactThreeFiber } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { Color, PlaneGeometry, ShaderMaterial } from 'three';

const TopographyShaderMaterial = shaderMaterial(
  { time: 0, colorMultiply: new Color(1, 0, 0) },
  // Vertex Shader
  `
    uniform float time;
    varying vec2 vUv;

    // Simplex noise function
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
      return mod289(((x * 34.0) + 1.0) * x);
    }

    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v) { 
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

      // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      //  x0 = x0 - 0. + 0.0 * C 
      vec3 x1 = x0 - i1 + 1.0 * C.xxx;
      vec3 x2 = x0 - i2 + 2.0 * C.xxx;
      vec3 x3 = x0 - 1. + 3.0 * C.xxx;

      // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
              + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

      // Gradients
      float n_ = 1.0/7.0; // N=7
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,N*N)

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

      //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
    }

    void main() {
      vUv = uv;
      vec3 pos = position;
      float noise = snoise(vec3(pos.xy * 2.5, time * 0.5));
      pos.z += noise * 0.5;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // Fragment Shader
  `
  uniform vec3 colorMultiply;
  varying vec2 vUv;
  uniform float time;

  void main() {
    // Create a vibrant, dynamic color effect
    vec3 dynamicColor = vec3(0.5 + 0.5 * sin(vUv.x * 10.0 + time), 
                              0.5 + 0.5 * cos(vUv.y * 10.0 + time), 
                              sin(vUv.x * 20.0 + time) * cos(vUv.y * 20.0 + time));

    // Ensure colors are bright and vivid
    dynamicColor = clamp(dynamicColor, 0.1, 0.8); // Avoid too dark colors

    // Combine the dynamic color with the multiply color
    vec3 finalColor = dynamicColor * colorMultiply;

    gl_FragColor = vec4(finalColor, 0.05); // 10% opacity
  }
  `,
);

extend({ TopographyShaderMaterial, PlaneGeometry });

declare module '@react-three/fiber' {
  interface ThreeElements {
    topographyShaderMaterial: ReactThreeFiber.Object3DNode<
      ShaderMaterial,
      typeof ShaderMaterial
    > & {
      colorMultiply?: Color;
      time?: number;
    };
  }
}

const TopographyWrapper = ({ color }: { color: Color }) => {
  const materialRef = useRef<ShaderMaterial>(null);
  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.time.value = clock.getElapsedTime();
  });

  return (
    <mesh>
      <planeGeometry args={[5, 7, 64, 64]} />
      <topographyShaderMaterial
        ref={materialRef}
        attach="material"
        colorMultiply={color}
      />
    </mesh>
  );
};

export default TopographyWrapper;
