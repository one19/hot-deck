import { ReactNode, useEffect, useState } from 'react';
import { Canvas, extend } from '@react-three/fiber';
import { SpringValue, animated, useSpring } from '@react-spring/three';
import { CircleGeometry } from 'three';
import { Html } from '@react-three/drei';

extend({ CircleGeometry });

type SquircleProps = {
  position: [number, number, number];
  scale: number;
  opacity: SpringValue<number>;
};
const Squircle = ({ position, scale, opacity }: SquircleProps) => {
  return (
    <animated.mesh position={position} scale={scale}>
      <circleGeometry attach="geometry" args={[0.2, 32]} />
      <animated.meshStandardMaterial
        attach="material"
        color="hotpink"
        transparent
        opacity={opacity}
      />
    </animated.mesh>
  );
};

const PopEffectWrapper = ({ children }: { children: ReactNode }) => {
  const [isUnmounting, setIsUnmounting] = useState(false);
  const { opacity } = useSpring({
    opacity: isUnmounting ? 0 : 1,
    config: { duration: 200 },
  });

  useEffect(() => {
    return () => {
      console.log('unmounting');
      setIsUnmounting(true);
    };
  }, []);

  const squircles = Array.from(
    { length: Math.floor(Math.random() * 6) + 5 },
    () => ({
      position: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
      scale: Math.random() * 0.5,
    }),
  );

  console.log(isUnmounting);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Html>
        <div style={{ display: isUnmounting ? 'none' : 'block' }}>
          {children}
        </div>
      </Html>
      {isUnmounting &&
        squircles.map((squircle, index) => (
          <Squircle
            key={index}
            position={squircle.position as [number, number, number]}
            scale={squircle.scale}
            opacity={opacity}
          />
        ))}
    </Canvas>
  );
};

export default PopEffectWrapper;
