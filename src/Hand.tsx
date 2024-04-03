import styled from '@emotion/styled';
import Card from './cards/Mining/Card';
import { ActionCardInformation } from './cards/types';

const ROTATION_ANGLE = 2.5;

const HandContainer = styled.div`
  grid-area: hand;
  display: inline-flex;
  justify-content: center;

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

type HandProps = {
  cards: ActionCardInformation[];
  discard: (id: string) => void;
};

const Hand = ({ cards, discard }: HandProps) => (
  <HandContainer>
    {cards.map((card, index) => {
      const offCenter = index - Math.floor(cards.length / 2);

      return (
        <Card
          key={card.id}
          {...card}
          discard={() => discard(card.id)}
          orientation={{ rotateZ: ROTATION_ANGLE * offCenter }}
        />
      );
    })}
  </HandContainer>
);

export default Hand;
