import { useRef, useEffect } from 'react';
import styled from '@emotion/styled';
import { useSpring, animated, to } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';

// Define the styles for the card and its elements
const Card = styled(animated.div)`
  width: 200px;
  height: 300px;
  background: linear-gradient(to bottom, #fff, #ddd);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  touch-action: none;
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
`;

const Text = styled.div`
  font-size: 0.9em;
  margin-top: 10px;
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
`;

type Orientation = {
  rotateX: number;
  rotateY: number;
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

// remove once we have drag-to-play-space actions
const calcX = (y: number, ly: number) => -(y - ly - window.innerHeight / 2) / 20;
const calcY = (x: number, lx: number) => (x - lx - window.innerWidth / 2) / 20;

const PlayingCard = ({
  className = '',
  orientation,
  imageUrl,
  onClick,
  title,
  text,
  cost,
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(() => ({
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    zoom: 0,
    x: 0,
    y: 0,
    ...orientation,
    config: { mass: 0.25, tension: 20, friction: 2 },
  }));

  useGesture(
    {
      onDrag: ({ active, offset: [x, y] }) =>
        api({ x, y, rotateX: 0, rotateY: 0, scale: active ? 1 : 0.9 }),
      onMove: ({ xy: [px, py], dragging }) =>
        !dragging &&
        api({
          rotateX: calcX(py, y.get()),
          rotateY: calcY(px, x.get()),
          scale: 1.1,
        }),
      onFocus: () => api({ y: -100, rotateX: 0, rotateY: 0, scale: 1.5 }),
      onBlur: () => api(orientation),
      onHover: ({ hovering }) => !hovering && api({ rotateX: 0, rotateY: 0, scale: 1 }),
    },
    { target: cardRef, eventOptions: { passive: false } }
  );

  useEffect(() => {
    const preventDefault = (e: Event) => e.preventDefault();
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);

    return () => {
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
    };
  }, []);

  return (
    <Card
      ref={cardRef}
      onClick={onClick}
      className={['card', className].join(' ')}
      style={{
        scale: to([scale, zoom], (s, z) => s + z),
        transform: 'perspective(600px)',
        rotateX,
        rotateY,
        rotateZ,
        y,
        x,
      }}
    >
      <CardHeader>
        <Cost>{cost}</Cost>
        <Title>{title}</Title>
      </CardHeader>
      <Image src={imageUrl} alt="Card Image" />
      <Text>{text}</Text>
    </Card>
  );
};

export default PlayingCard;
