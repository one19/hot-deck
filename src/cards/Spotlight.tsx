import { useSpring, a } from '@react-spring/web';
import styled from '@emotion/styled';

const SpotlightOverlay = styled(a.div)`
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: var(--card-border-radius);
`;

const Spotlight = (/* { parentRef } */) => {
  const [spotlightProps] = useSpring(() => ({
    spotlightX: '50%',
    spotlightY: '50%',
    config: { tension: 300, friction: 30 },
  }));

  return (
    <SpotlightOverlay
      style={{
        background: spotlightProps.spotlightX.to(
          (spotlightX, spotlightY) =>
            `radial-gradient(circle at ${spotlightX} ${spotlightY}, rgba(255, 255, 255, 0.3), transparent)`
        ),
      }}
    />
  );
};

export default Spotlight;
