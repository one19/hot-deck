import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useSpring, a, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { getBackground } from './variants';
import { useSetResources } from '../hooks/resources';

import { ActionCardInformation } from './types';

const Wrapper = styled.div`
  width: var(--card-width);
  height: var(--card-height);
  box-sizing: border-box;
  position: relative;
  touch-action: none;

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
  width: 100%;
  height: 50%;
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
  className = '',
  imageComponent,
  orientation,
  disabled,
  facedown,
  imageUrl,
  variant,
  onClick,
  title,
  text,
  cost,
}: ActionCardInformation) => {
  const [isHovering, setHovering] = useState(false);
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);
  const { mutate } = useSetResources('rawResources');

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

  const bind = useGesture({
    onDrag: ({ hovering, active, movement: [x, y] }) => {
      setHovering(false);
      if (active) {
        api.start({
          x: x,
          y: y,
          scale: 1.1,
          rotateX: 0,
          rotateY: props.rotateY.get(),
        });
      } else {
        // where to return to at the end of dragging
        api.start({
          x: 0,
          y: 0,
          scale: hovering ? 1.1 : 1,
        });
      }
    },
    onHover: ({ dragging, active }) => {
      setHovering(true);
      if (!dragging) {
        api.start({ scale: active ? 1.1 : 1, rotateX: 0, rotateY: facedown ? 180 : 0 });
      }
    },
    onMove: ({ dragging, hovering, first, xy: [px, py] }) => {
      // start by setting the card dims in a non-rerendering way
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (first && cardRef.current) dimStore.current = cardRef.current.getBoundingClientRect();

      if (!dragging && hovering && !isHovering) {
        // final call on end of dragging phase
        api.start({ scale: 1 });
        mutate({ copper: 2, coal: 35 }); // FOR TESTING WOOOO
      }

      if (!dragging && hovering && isHovering) {
        api.start({ rotateX: rotX(py), rotateY: rotY(px) + (facedown ? 180 : 0) });
      }
    },
  });

  return (
    <Wrapper
      ref={cardRef}
      onClick={onClick}
      {...(!disabled && bind())}
      className={['card', className].join(' ')}
    >
      <CardBack style={{ ...props, opacity: props.opacity.to((o) => 1 - o) }} />
      <Card style={props} variant={variant}>
        <CardHeader>
          <Cost>{cost}</Cost>
          <Title>{title}</Title>
        </CardHeader>
        {imageComponent ? imageComponent : <Image src={imageUrl} alt="Card Image" />}
        <Text>{text}</Text>
      </Card>
    </Wrapper>
  );
};

export default PlayingCard;
