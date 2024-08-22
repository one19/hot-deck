import { useEffect } from 'react';
import { SpringRef } from '@react-spring/web';

const intervalDuration = 2000; // Duration of each wiggle cycle
const maxRotationDegree = 3; // Maximum degree of rotation
const config = { tension: 10, friction: 20 }; // Spring config

const useWiggle = (
  api: SpringRef<{
    rotateZ: number;
  }>,
  initialOrientation: number
) => {
  useEffect(() => {
    // Calculate a random starting point between -3 and +3 degrees from the initial orientation
    const initialDelta = Math.random() * maxRotationDegree * 2 - maxRotationDegree;
    const initialTarget = initialOrientation + initialDelta;

    // Start the first animation towards this random target
    void api.start({
      rotateZ: initialTarget,
      config,
    });

    // Calculate the delay for the initial movement
    const initialMovementDuration =
      Math.abs(initialDelta / (maxRotationDegree * 2)) * intervalDuration;

    // After the initial movement, start the back-and-forth cycle
    const timeout = setTimeout(() => {
      let isMovingToMax = initialDelta < 0;
      const nextTarget = () =>
        initialOrientation + (isMovingToMax ? maxRotationDegree : -maxRotationDegree);

      const interval = setInterval(() => {
        void api.start({
          rotateZ: nextTarget(),
          config,
        });
        isMovingToMax = !isMovingToMax; // Reverse the direction for the next cycle
      }, intervalDuration);

      return () => clearInterval(interval);
    }, initialMovementDuration);

    // Cleanup function for the useEffect
    return () => clearTimeout(timeout);
  }, [api, initialOrientation]);
};

export default useWiggle;
