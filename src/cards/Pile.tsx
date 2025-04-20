import styled from '@emotion/styled';

import miningCard from './Mining/getMiningCard';
import Card from './Mining/Card';

import { GeneralCardInformation } from './types';

const Wrapper = styled.div<{ draw?: boolean; discard?: boolean }>`
  --card-overlap: 5px;

  position: relative;
  display: inline-flex;
  z-index: var(--z-index-cards);
  ${({ draw }) => draw && 'grid-area: hand / draw;'}
  ${({ discard }) => discard && 'grid-area: hand / discard;'}

  .card {
    position: absolute;
  }
  .card:nth-of-type(2) {
    z-index: -1;
    top: var(--card-overlap);
    left: var(--card-overlap);
  }
  .card:nth-of-type(3) {
    z-index: -2;
    top: calc(var(--card-overlap) * 2);
    left: calc(var(--card-overlap) * 2);
  }
  .card:nth-of-type(4) {
    z-index: -3;
    top: calc(var(--card-overlap) * 3);
    left: calc(var(--card-overlap) * 3);
  }
  .card:nth-of-type(5) {
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
  display: flex;

  box-shadow:
    4px 4px 0 0 #d6d099,
    7px 7px 0 0 #beb988,
    9px 9px 0 0 #a6a276,
    10px 10px 0 0 #8e8b66,
    11px 11px 0 0 #777455;
`;

type Props = {
  draw?: boolean;
  discard?: boolean;
  infinite?: boolean;
  facedown?: boolean;
  cardFactory?: typeof miningCard;
  cards?: GeneralCardInformation[];
};
const Pile = ({
  draw,
  discard,
  infinite,
  facedown,
  cardFactory,
  cards,
}: Props) => {
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
    <Wrapper draw={draw} discard={discard}>
      {cards.map((card) => (
        <Card key={card.id} {...card} facedown={facedown} />
      ))}
      {infinite && <InfinityBox className="card" />}
    </Wrapper>
  );
};

export default Pile;
