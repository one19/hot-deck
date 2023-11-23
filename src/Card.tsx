import { useRef, useEffect } from 'react';
import styled from '@emotion/styled';

// Define the styles for the card and its elements
const Card = styled.div<{ rotate?: number }>`
  width: 200px;
  height: 300px;
  background: linear-gradient(to bottom, #fff, #f9f9f9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  transition: transform 0.3s ease;
  rotate: ${(props) => props.rotate || 0}deg;
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

export type Props = {
  cost: number;
  title: string;
  imageUrl: string;
  text: string; // to be changed to something dynamically interpretable later
  onClick?: () => void;
  isFocused?: boolean;
  className?: string;
  rotate?: number;
};

const PlayingCard = ({
  cost,
  text,
  title,
  onClick,
  imageUrl,
  isFocused,
  rotate = 0,
  className = '',
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const dx = (x - centerX) / centerX;
      const dy = (y - centerY) / centerY;

      const skew = isFocused ? 1.5 : 3;
      const drift = isFocused ? 5 : 10;

      const skewX = dy * skew; // Skew factor for X-axis
      const skewY = -dx * skew; // Skew factor for Y-axis
      const shadowX = dx * 20; // Shadow X-offset
      const shadowY = dy * 20; // Shadow Y-offset
      const shadowBlur = 30; // Shadow blur

      const scale = isFocused ? 1.5 : 1.1;

      card.style.transform = `translate(${dx * drift}px, ${
        dy * drift - (isFocused ? 50 : 0) // FOCUS UPWARD MOVEMENT ALSO REFERENCED IN HAND
      }px) scale(${scale}) skew(${skewX}deg, ${skewY}deg)`;
      card.style.boxShadow = `${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, 0.3)`;
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = ''; // Reset to original shadow style
    });

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFocused]);

  return (
    <Card ref={cardRef} rotate={rotate} onClick={onClick} className={['card', className].join(' ')}>
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
