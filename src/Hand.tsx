import React from 'react';
import styled from '@emotion/styled';
import Card, { type Props as CardProps } from './Card';

const ROTATION_ANGLE = 2.5;

const HandContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: -5px;

  .card {
    transition: transform 0.3s ease;
    transform-origin: bottom center;
  }

  .card:focus {
    transform: scale(1.5) translateY(-50px);
    box-shadow: 15px 15px 30px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }
`;

interface IHandProps {
  cards: CardProps[];
}

const Hand: React.FC<IHandProps> = ({ cards }) => {
  const [focusedCard, setFocusedCard] = React.useState<number | null>(null);

  return (
    <HandContainer>
      {cards.map((card, index) => {
        const isFocused = focusedCard === index;
        const offCenter = index - Math.floor(cards.length / 2);

        return (
          <Card
            key={index}
            {...card}
            isFocused={isFocused}
            className={isFocused ? 'focused' : undefined}
            orientation={{ rotateZ: isFocused ? 0 : ROTATION_ANGLE * offCenter }}
            onClick={(e: React.MouseEvent<HTMLElement>) => {
              console.log(e, e.target, e.currentTarget);
              setFocusedCard(isFocused ? null : index);
              if (isFocused) {
                e.target.dispatchEvent(new Event('blur'));
              } else {
                e.target.dispatchEvent(new Event('focus'));
              }
            }}
          />
        );
      })}
    </HandContainer>
  );
};

export default Hand;
