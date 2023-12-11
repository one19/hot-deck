import { useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useSpring, a, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

const Wrapper = styled.div`
  width: 200px;
  height: 300px;
  box-sizing: border-box;
  touch-action: none;
  position: relative;
  &:hover {
    z-index: 100;
  }
`;

const Card = styled(a.div)`
  box-sizing: border-box;
  border-radius: 10px;
  background: linear-gradient(to bottom, #fff, #ddd);
  padding: 10px;
  touch-action: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: absolute;
  width: 100%;
  height: 100%;
`;
const CardBack = styled(Card)`
  background: linear-gradient(to bottom, #fed, #bed);
  border: 15px solid palegoldenrod;
`;

const Cost = styled.div`
  font-size: 1em;
  font-weight: bold;
`;

const Title = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-left: 10px;
`;

const Image = styled.img`
  width: 100%;
  height: 50%;
  border-radius: 5px;
  margin: 10px 0;
`;

const Text = styled.div`
  font-size: 0.9em;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

type Orientation = {
  rotateX: number;
  rotateZ: number;
  scale: number;
  x: number;
  y: number;
};

export type Props = {
  cost: number;
  title: string;
  imageUrl: string;
  text: string; // to be changed to something dynamically interpretable later
  isFocused?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  orientation?: Partial<Orientation>;
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
  className = '',
  orientation,
  imageUrl,
  onClick,
  title,
  text,
  cost,
}: Props) => {
  const [displayBack, setDisplayBack] = useState(false);
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);

  const [props, api] = useSpring(() => ({
    ...DEFAULT,
    ...orientation,
    opacity: displayBack ? 0 : 1,
    rotateY: displayBack ? 180 : 0,
    config: config.stiff,
  }));

  const rotX = (py: number) =>
    (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5;
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  const bind = useGesture({
    onDrag: ({ hovering, active, offset: [x, y] }) => {
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
    onDoubleClick: () => {
      setDisplayBack(!displayBack);
      api.start({
        opacity: displayBack ? 1 : 0,
        rotateY: displayBack ? 0 : 180,
      });
    },
    onHover: ({ dragging, active }) => {
      if (!dragging) {
        api.start({ scale: active ? 1.1 : 1, rotateX: 0, rotateY: displayBack ? 180 : 0 });
      }
    },
    onMove: ({ dragging, hovering, first, xy: [px, py] }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      if (first && cardRef.current) dimStore.current = cardRef.current.getBoundingClientRect();
      if (!dragging && hovering) {
        api.start({ rotateX: rotX(py), rotateY: rotY(px) + (displayBack ? 180 : 0) });
      }
    },
  });

  return (
    <Wrapper className={['card', className].join(' ')} onClick={onClick} ref={cardRef} {...bind()}>
      <CardBack style={{ ...props, opacity: props.opacity.to((o) => 1 - o) }} />
      <Card style={props}>
        <CardHeader>
          <Cost>{cost}</Cost>
          <Title>{title}</Title>
        </CardHeader>
        <Image src={imageUrl} alt="Card Image" />
        <Text>{text}</Text>
      </Card>
    </Wrapper>
  );
};

export default PlayingCard;
