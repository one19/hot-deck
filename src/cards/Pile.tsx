import styled from '@emotion/styled';

import miningCard from './miningCard';
import Card from './ActionCard';

import { ActionCardInformation } from './types';

const Wrapper = styled.div`
  --card-overlap: 5px;

  position: absolute;
  z-index: var(--z-index-cards);
  left: 0;

  .card {
    position: absolute;
  }
  .card:nth-child(2) {
    z-index: -1;
    top: var(--card-overlap);
    left: var(--card-overlap);
  }
  .card:nth-child(3) {
    z-index: -2;
    top: calc(var(--card-overlap) * 2);
    left: calc(var(--card-overlap) * 2);
  }
  .card:nth-child(4) {
    z-index: -3;
    top: calc(var(--card-overlap) * 3);
    left: calc(var(--card-overlap) * 3);
  }
  .card:nth-child(5) {
    z-index: -4;
    top: calc(var(--card-overlap) * 4);
    left: calc(var(--card-overlap) * 4);
  }
`;
const InfinityBox = styled.div`
  border-radius: var(--card-border-radius);
  height: var(--card-height);
  width: var(--card-width);

  background: palegoldenrod;
  position: absolute;

  box-shadow:
    4px 4px 0 0 #d6d099,
    7px 7px 0 0 #beb988,
    9px 9px 0 0 #a6a276,
    10px 10px 0 0 #8e8b66,
    11px 11px 0 0 #777455;
`;

type Props = {
  infinite?: boolean;
  facedown?: boolean;
  cardFactory?: typeof miningCard;
  cards?: ActionCardInformation[];
};
const Pile = ({ infinite, facedown, cardFactory, cards }: Props) => {
  // when in the tech tree
  if (!cards && cardFactory) {
    return (
      <Wrapper>
        {Array.from({ length: 4 }, (_, i) => i).map((index) => {
          const card = cardFactory({ facedown });
          return <Card key={card.id} {...card} disabled={index !== 0} />;
        })}
        <InfinityBox className="card" />
      </Wrapper>
    );
  }

  if (!cards) return null;

  return (
    <Wrapper>
      {cards.map((card) => (
        <Card key={card.id} {...card} facedown={facedown} />
      ))}
      {infinite && <InfinityBox className="card" />}
    </Wrapper>
  );
};

export default Pile;
