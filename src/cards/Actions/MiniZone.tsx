import styled from '@emotion/styled';

import { useGame } from '../../hooks/games';
import { getBackground } from '../variants';

const MiniChip = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${getBackground};
  grid-row: 1;
  border: 4px solid pink;

  &: [data-active= 'true'] {
    transform: scale(1.2);
  }
`;

const MiniZone = () => {
  const [game] = useGame();

  if (!game) return null;

  const { actionCardIndex, actionCardPile } = game;
  console.log('fuckya', actionCardIndex, actionCardPile);

  <>
    {actionCardPile.map((card, i) => (
      <MiniChip
        variant="action"
        key={`chip-${card.id}`}
        {...(actionCardIndex === i && { ['data-active']: true })}
      />
    ))}
  </>;
};

export default MiniZone;
