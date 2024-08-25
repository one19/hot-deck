import styled from '@emotion/styled';
import { a } from '@react-spring/web';
import { Canvas } from '@react-three/fiber';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';

import { Title } from '../zoo/Styled';
import grainUrl from '../assets/zoo/grain.webp';
import placeholderUrl from '../assets/factories/mine.png';

import RainbowMultiply from './Shaders/RainbowMultiply';
import { getBackground } from './variants';
import { SpringProps } from './types';
import ImageFan from './ImageFan';

const StyledCanvas = styled(Canvas)`
  border-radius: var(--card-border-radius);
  top: 0;
  left: 0;
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

const Wrapper = styled(a.div)`
  width: var(--card-width);
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
  }

  &[data-grabbed='true'] {
    z-index: calc(var(--z-index-cards) + 2);
  }
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
}: CardInfo) => (
  <Wrapper id={id} ref={cardRef} className="card" {...(bind && bind())}>
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
      {shiny && (
        <StyledCanvas style={{ position: 'absolute', pointerEvents: 'none' }}>
          <RainbowMultiply {...springProps} />
        </StyledCanvas>
      )}
    </CardBody>
  </Wrapper>
);

export default Card;
