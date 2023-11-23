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

  .card.focused {
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
            rotate={isFocused ? 0 : ROTATION_ANGLE * offCenter}
            onClick={() => setFocusedCard(isFocused ? null : index)}
          />
        );
      })}
    </HandContainer>
  );
};

export default Hand;
