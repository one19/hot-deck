import { useRef } from 'react';
import styled from '@emotion/styled';
import { useSpring, a, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { getBackground } from '../variants';
import { Title } from '../../zoo/Styled';
import grainUrl from '../../assets/zoo/grain.webp';
import placeholderUrl from '../../assets/factories/mine.png';
import { Canvas } from '@react-three/fiber';

import RainbowMultiply from '../Shaders/RainbowMultiply';

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

const Card = styled(a.div)<{ variant?: string }>`
  box-sizing: border-box;
  border-radius: var(--card-border-radius);
  padding: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
  ${getBackground};
`;
const CardBack = styled(Card)`
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

const DEFAULT = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  zoom: 0,
  x: 0,
  y: 0,
};

type ActionEconomyCardInformation = {
  drawCount: number;
  shiny?: boolean;
  cost: number;
  id: string;
};

const DrawX = ({ drawCount, shiny, cost }: ActionEconomyCardInformation) => {
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);

  const [props, api] = useSpring(
    () => ({
      ...DEFAULT,
      config: config.stiff,
    }),
    []
  );

  const rotX = (py: number) =>
    (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5;
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  const bind = useGesture(
    {
      // redo dragging from scratch once we have the action hand to change ordering

      // called on first hover enter, and on exiting hovering
      onHover: ({ active, last }) => {
        void api.start({
          scale: active ? 1.1 : 1,
          rotateX: 0,
          rotateY: 0,
        });

        if (last) {
          cardRef?.current?.style.setProperty('--spotlight-intensity', '0');
        }
      },

      // called continuously when hovering over the card
      onMove: ({ hovering, first, xy: [px, py] }) => {
        // start by setting the card dims in a non-rerendering way
        if (first && cardRef.current) {
          dimStore.current = cardRef.current.getBoundingClientRect();
          cardRef.current.style.setProperty('--spotlight-intensity', '0.2');
        }

        if (hovering) {
          if (!cardRef.current) return;
          void api.start({
            rotateX: rotX(py),
            rotateY: rotY(px),
          });

          const x = (px - dimStore.current.left) / dimStore.current.width;
          const y = (py - dimStore.current.top) / dimStore.current.height;

          cardRef.current.style.setProperty('--spotlight-x', `${x * 100}%`);
          cardRef.current.style.setProperty('--spotlight-y', `${y * 100}%`);
        }
      },
    },
    { drag: { pointer: { capture: false } } }
  );

  return (
    <>
      <Wrapper ref={cardRef} className="card" {...bind()}>
        <CardBack style={props} />
        <Card style={props} variant="actionBackground">
          <CardHeader>
            <Cost>{cost}</Cost>
            <Title>Draw {drawCount}</Title>
          </CardHeader>
          <Image src={placeholderUrl} />
          <Text>Draw {drawCount} cards from your draw pile</Text>
          <GrainOverlay />
          <SpotlightOverlay />
          {shiny && (
            <StyledCanvas style={{ position: 'absolute', pointerEvents: 'none' }}>
              <RainbowMultiply {...props} />
            </StyledCanvas>
          )}
        </Card>
      </Wrapper>
    </>
  );
};

export default DrawX;
