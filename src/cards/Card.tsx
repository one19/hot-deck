import { useMemo } from 'react';
import styled from '@emotion/styled';
import { a } from '@react-spring/web';
import { keyframes } from '@emotion/css';
import { Canvas } from '@react-three/fiber';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';

import placeholderUrl from '../assets/factories/mine.png';
import grainUrl from '../assets/zoo/grain.webp';
import { Title } from '../zoo/Styled';

import { BorderBeam } from './Shaders/unused-test-components/BorderBeam';
import RainbowMultiply from './Shaders/RainbowMultiply';
import GlowingWormBorder from './Shaders/GlowWorm';
import { getBackground } from './variants';
import { SpringProps } from './types';
import ImageFan from './ImageFan';

const wiggle = keyframes`
  from {
    transform: translate(-10px, 0) rotate(-5deg);
  }
  25% {
    transform: translate(0, -10px) rotate(5deg);
  }
  50% {
    transform: translate(10px, 0) rotate(-5deg);
  }
  75% {
    transform: translate(0, 10px) rotate(5deg);
  }
  to {
    transform: translate(-10px, 0) rotate(-5deg);
  }
`;

const StyledCanvas = styled(Canvas)`
  position: absolute !important;
  pointer-events: none;
  top: 0;
  left: 0;

  & canvas {
    border-radius: var(--card-border-radius);
    box-sizing: border-box;
    width: 100% !important;
    height: 100% !important;
    border: 1px solid pink;
    postion: absolute;
    pointer-events: none;
  }
`;

const GrainOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-image: url('${grainUrl}');
  background-size: var(--card-width) 100%;
  pointer-events: none;
  mix-blend-mode: plus-lighter;
  border-radius: var(--card-border-radius);
`;

const SpotlightOverlay = styled(a.div)`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at var(--spotlight-x) var(--spotlight-y),
    rgba(255, 255, 255, var(--spotlight-intensity)),
    transparent
  );
  pointer-events: none;
  border-radius: var(--card-border-radius);
`;

const Wrapper = styled(a.div)<{ randomDelay: string }>`
  width: var(--card-width);
  min-width: var(--card-width);
  height: var(--card-height);
  box-sizing: border-box;
  position: relative;
  touch-action: none;
  will-change: transform, opacity;
  border-radius: var(--card-border-radius);
  z-index: var(--z-index-cards);
  perspective: 800px;

  &:hover {
    z-index: calc(var(--z-index-cards) + 1);
    animation: none;
    animation-delay: 3s;
  }

  &[data-grabbed='true'] {
    z-index: calc(var(--z-index-cards) + 2);
    animation: none;
    animation-delay: 3s;
  }

  animation: ${wiggle} 2s infinite cubic-bezier(0.5, 0, 0.5, 1);
  animation-delay: -${(p) => p.randomDelay}s;
`;

const CardBody = styled(a.div)<{ variant?: string }>`
  box-sizing: border-box;
  border-radius: var(--card-border-radius);
  padding: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
  ${getBackground};
`;
const CardBack = styled(CardBody)`
  background: linear-gradient(to bottom, #fed, #bed);
  border: 15px solid palegoldenrod;
`;

const Cost = styled.div`
  font-size: 2em;
  margin-right: 0.25em;
  font-weight: bold;
  user-select: none;
`;

const Text = styled.p`
  font-size: 0.9em;
  user-select: none;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  position: relative;
  width: 180px; // Set a fixed width
  height: 180px; // Set a fixed height
  pointer-events: none;
  user-select: none;
`;

type CardInfo = {
  shiny?: boolean;
  title: string;
  cost: number;
  images?: string[];
  text: string;
  variant?: string;
  facedown?: boolean;
  id: string;

  // props for when we want to override the simple hover
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  bind?: (...args: any[]) => ReactDOMAttributes;
  cardRef?: React.RefObject<HTMLDivElement>;
  springProps: SpringProps;
};

const Card = ({
  id,
  title,
  shiny,
  cost,
  images = [placeholderUrl],
  variant,
  text,
  bind,
  cardRef,
  springProps,
}: CardInfo) => {
  const randomDelay = useMemo(() => (Math.random() * 2).toFixed(2), []);
  return (
    <Wrapper id={id} ref={cardRef} className="card" {...(bind && bind())} randomDelay={randomDelay}>
      <CardBack style={{ ...springProps, opacity: springProps.opacity.to((o) => 1 - o) }} />
      <CardBody style={springProps} variant={variant}>
        <CardHeader>
          <Cost>{cost}</Cost>
          <Title>{title}</Title>
        </CardHeader>
        {images.length === 1 ? (
          <Image src={images[0]} />
        ) : (
          <ImageFan images={images.map((imageUrl) => imageUrl)} />
        )}
        <Text>{text}</Text>
        <GrainOverlay />
        <SpotlightOverlay />
        <BorderBeam />
        {(shiny || variant === 'action') && (
          <StyledCanvas>
            {shiny && <RainbowMultiply {...springProps} />}
            {variant === 'action' && <GlowingWormBorder />}
          </StyledCanvas>
        )}
      </CardBody>
    </Wrapper>
  );
};

export default Card;
