import { createPortal } from 'react-dom';
import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useSpring, a, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { getBackground } from '../variants';
import ImageFan from '../ImageFan';
import { useSetResources } from '../../hooks/resources';
import { Title } from '../../zoo/Styled';
import grainUrl from '../../assets/zoo/grain.webp';
import ResourceSelector from './ResourceSelector';
import { Canvas } from '@react-three/fiber';
// import { PaperOverlay } from '../../zoo/PaperOverlay';

import { ActionCardInformation } from '../types';
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

const DEFAULT = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  zoom: 0,
  x: 0,
  y: 0,
};

const MiningCard = ({
  orientation,
  resources,
  disabled,
  facedown,
  discard,
  variant,
  shiny,
  title,
  text,
  cost,
}: ActionCardInformation) => {
  const [isHovering, setHovering] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [renderSelection, setRenderSelection] = useState(false);
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);
  const initialOffset = useRef({ x: 0, y: 0 });
  const hoveredResourceRef = useRef<string | null>(null);
  const { mutate } = useSetResources('rawResources');

  const playArea = document.getElementById('play-area');

  const [props, api] = useSpring(
    () => ({
      ...DEFAULT,
      ...orientation,
      rotateZ: (orientation?.rotateZ ?? DEFAULT.rotateZ) * (facedown ? -1 : 1),
      opacity: facedown ? 0 : 1,
      rotateY: facedown ? 180 : 0,
      config: config.stiff,
    }),
    [orientation]
  );

  // useWiggle(api, props.rotateZ.get());

  const rotX = (py: number) =>
    (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5;
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  const bind = useGesture(
    {
      onDrag: ({ initial, active, movement: [mx, my], first }) => {
        setHovering(false);
        setDragging(true);
        setRenderSelection(true);
        if (active) {
          // Capture the initial offset from the cursor to the center of the card
          if (first && initial) {
            const cardCenterX = dimStore.current.x + dimStore.current.width / 2;
            const cardCenterY = dimStore.current.y + dimStore.current.height / 2;
            initialOffset.current = {
              x: initial[0] - cardCenterX,
              y: initial[1] - cardCenterY,
            };
            if (!cardRef.current) return;
            cardRef.current.style.setProperty('pointer-events', 'none');
          }

          // Apply the initial offset to keep the card centered on the cursor
          api.start({
            x: mx + initialOffset.current.x,
            y: my + initialOffset.current.y,
            scale: 0.3,
            rotateX: 0,
            rotateY: props.rotateY.get(),
          });

          // selected a resource; discard the card
        } else if (hoveredResourceRef.current) {
          const DURATION = 250;
          mutate({ [hoveredResourceRef.current]: 1 });
          api.start({ x: 0, y: 0, scale: 0, rotateZ: 6000, config: { duration: DURATION } });
          setTimeout(() => discard && discard(), DURATION);
        } else {
          // return to initial on end of dragging phase
          setDragging(false);
          initialOffset.current = { x: 0, y: 0 };
          setRenderSelection(false);
          api.start({
            x: 0,
            y: 0,
            scale: isHovering ? 1.1 : 1,
          });
          if (!cardRef.current) return;
          cardRef.current.style.setProperty('pointer-events', 'auto');
        }
      },
      onHover: ({ dragging, active, last }) => {
        setHovering(true);
        if (!dragging) {
          api.start({
            scale: active ? 1.1 : 1,
            rotateX: 0,
            rotateY: facedown ? 180 : 0,
          });
        }
        if (last) {
          cardRef?.current?.style.setProperty('--spotlight-intensity', '0');
        }
      },
      onMove: ({ dragging, hovering, first, last, xy: [px, py] }) => {
        // start by setting the card dims in a non-rerendering way
        if (first && cardRef.current) {
          dimStore.current = cardRef.current.getBoundingClientRect();
          cardRef.current.style.setProperty('--spotlight-intensity', '0.2');
        }

        if (last && !dragging && hovering && !isHovering) {
          // final call on end of dragging phase
          api.start({ scale: 1 });
          cardRef?.current?.style.setProperty('--spotlight-intensity', '0');
        }

        if (!dragging && hovering && isHovering) {
          if (!cardRef.current) return;
          api.start({
            rotateX: rotX(py),
            rotateY: rotY(px) + (facedown ? 180 : 0),
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
      <Wrapper
        ref={cardRef}
        className="card"
        data-grabbed={`${isDragging}`}
        {...(!disabled && bind())}
      >
        <CardBack style={{ ...props, opacity: props.opacity.to((o) => 1 - o) }} />
        <Card style={props} variant={variant}>
          <CardHeader>
            <Cost>{cost}</Cost>
            <Title>{title}</Title>
          </CardHeader>
          <ImageFan images={resources.map((r) => r.image)} />
          <Text>{text}</Text>
          <GrainOverlay />
          <SpotlightOverlay />
          {shiny && (
            <StyledCanvas style={{ position: 'absolute', pointerEvents: 'none' }}>
              <RainbowMultiply {...props} />
            </StyledCanvas>
          )}
        </Card>
      </Wrapper>
      {playArea &&
        renderSelection &&
        !facedown &&
        createPortal(
          <ResourceSelector resources={resources} hoveredResourceRef={hoveredResourceRef} />,
          playArea
        )}
    </>
  );
};

export default MiningCard;
