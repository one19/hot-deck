import { createPortal } from 'react-dom';
import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useSpring, a, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { getBackground } from './variants';
import ImageFan from './ImageFan';
import { useSetResources } from '../hooks/resources';
import grainUrl from '../assets/zoo/grain.webp';

import { ActionCardInformation } from './types';

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

  &:hover {
    z-index: 100;
  }
`;

const Card = styled(a.div)<{ variant?: string }>`
  box-sizing: border-box;
  border-radius: var(--card-border-radius);
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
  font-size: 1em;
  font-weight: bold;
  user-select: none;
`;

const Title = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-left: 10px;
  user-select: none;
`;

const Image = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 5px;
  margin: 10px 0;
`;

const Text = styled.div`
  font-size: 0.9em;
  user-select: none;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

const ResourceSelectionWrapper = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-area: play-area;
  justify-content: center;
  z-index: calc(var(--z-index-map) + 1);
`;

const Resources = styled.div`
  background: #3333;
  border: 3px solid #1111;
  margin-top: 5px;
  border-radius: 5px;
  display: inline-flex;
  justify-content: space-around;
`;

const ResourceBlock = styled.div`
  border: 3px solid #1111;
  display: flex;
  width: 100%;
  padding: 5px 0;
  flex-direction: column;
  align-items: center;
`;

const ResourceSelector = ({
  resources,
  hoveredResourceRef,
}: {
  resources: { name: string; image: string }[];
  hoveredResourceRef: React.MutableRefObject<string | null>;
}) => {
  return (
    <ResourceSelectionWrapper>
      <Title>Select a resource</Title>
      <Resources>
        {resources.map((r) => (
          <ResourceBlock
            key={`selector-${r.name}`}
            id={`selector-${r.name}`}
            onMouseEnter={() => {
              hoveredResourceRef.current = r.name;
            }}
            onMouseLeave={() => {
              hoveredResourceRef.current = null;
            }}
          >
            <Image src={r.image} alt={`select ${r.name}`} />
            <Title>{r.name}</Title>
          </ResourceBlock>
        ))}
      </Resources>
    </ResourceSelectionWrapper>
  );
};

const DEFAULT = {
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  zoom: 0,
  x: 0,
  y: 0,
};

const PlayingCard = ({
  orientation,
  resources,
  disabled,
  facedown,
  discard,
  variant,
  title,
  text,
  cost,
}: ActionCardInformation) => {
  const [isHovering, setHovering] = useState(true);
  const [renderSelection, setRenderSelection] = useState(false);
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);
  const initialOffset = useRef({ x: 0, y: 0 });
  const hoveredResourceRef = useRef<string | null>(null);
  const { mutate } = useSetResources('rawResources');

  const playArea = document.getElementById('play-area');

  const [props, api] = useSpring(() => ({
    ...DEFAULT,
    ...orientation,
    rotateZ: (orientation?.rotateZ ?? DEFAULT.rotateZ) * (facedown ? -1 : 1),
    opacity: facedown ? 0 : 1,
    rotateY: facedown ? 180 : 0,
    config: config.stiff,
  }));

  const rotX = (py: number) =>
    (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5;
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  const bind = useGesture(
    {
      onDrag: ({ initial, active, movement: [mx, my], first }) => {
        setHovering(false);
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
          setTimeout(() => discard(), DURATION);
        } else {
          // return to initial on end of dragging phase
          initialOffset.current = { x: 0, y: 0 };
          setRenderSelection(false);
          api.start({
            x: 0,
            y: 0,
            scale: isHovering ? 1.1 : 1,
          });
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        if (first && cardRef.current) dimStore.current = cardRef.current.getBoundingClientRect();

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
          cardRef.current.style.setProperty('--spotlight-intensity', '0.2');
        }
      },
    },
    { drag: { pointer: { capture: false } } }
  );

  return (
    <>
      {playArea &&
        renderSelection &&
        createPortal(
          <ResourceSelector resources={resources} hoveredResourceRef={hoveredResourceRef} />,
          playArea
        )}
      <Wrapper className="card" ref={cardRef} {...(!disabled && bind())}>
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
        </Card>
      </Wrapper>
    </>
  );
};

export default PlayingCard;
