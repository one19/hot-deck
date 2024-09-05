import styled from '@emotion/styled';
import Card from './cards/Mining/Card';
import { ActionCardInformation } from './cards/types';

const ROTATION_ANGLE = 2.5;
const REDUCED_ROTATION_ANGLE = 1.5;

const HandContainer = styled.div<{ isLargeHand: boolean }>`
  grid-area: hand;
  display: ${({ isLargeHand }) => (isLargeHand ? 'block' : 'inline-flex')};
  justify-content: center;
  position: ${({ isLargeHand }) => (isLargeHand ? 'relative' : 'static')};
`;

const PositionalWrapper = styled.div<{ isLargeHand: boolean; index: number; totalCards: number }>`
  ${({ isLargeHand, index, totalCards }) =>
    isLargeHand &&
    `
    position: absolute;
    left: calc(${index} * (100% / ${totalCards}) - ${50 / totalCards}%);
    top: ${Math.abs(index - totalCards / 2) * 2}px;
  `}
`;

type HandProps = {
  cards: ActionCardInformation[];
};

const Hand = ({ cards }: HandProps) => {
  const isLargeHand = cards.length > 5;

  return (
    <HandContainer isLargeHand={isLargeHand}>
      {cards.map((card, index) => {
        const offCenter = index + 0.5 - cards.length / 2;
        const rotationAngle = isLargeHand ? REDUCED_ROTATION_ANGLE : ROTATION_ANGLE;
        const positionStyles = isLargeHand ? { rotateZ: rotationAngle * offCenter } : {};

        return (
          <PositionalWrapper
            key={card.id}
            isLargeHand={isLargeHand}
            index={index}
            totalCards={cards.length}
          >
            <Card {...card} orientation={positionStyles} />
          </PositionalWrapper>
        );
      })}
    </HandContainer>
  );
};

export default Hand;
