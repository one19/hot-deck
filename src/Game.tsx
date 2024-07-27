import { useState, useCallback } from 'react';
import styled from '@emotion/styled';

import ResourceCounter from './zoo/ResourceCounter';
import getMiningCard from './cards/Mining/getMiningCard';
import MapArea from './zoo/MapArea';
import Hand from './Hand';
import Pile from './cards/Pile';
import { ActionCardInformation } from './cards/types';
import { useParams } from 'react-router-dom';

const PlayArea = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  margin: 0;
  overflow: hidden; /* To prevent scrolling on the page body */

  grid-template-columns:
    [left] 5px
    [draw] calc(200px + 5px)
    [play-area-start] 1fr
    [hand] 1000px
    [hand-end] 1fr
    [play-area-end discard] calc(200px + 5px)
    [right] 5px;
  grid-template-rows:
    [top] 100px
    [play-area] 1fr
    [hand] 280px;

  --card-width: 200px;
  --card-height: 280px;
  --card-border-radius: 10px;

  --z-index-map: 0;
  --z-index-cards: 1000;
  --z-index-menus: 2000;

  --spotlight-x: 50%;
  --spotlight-y: 50%;
  --spotlight-intensity: 0;
`;

const App = () => {
  const { gameId = 'test' } = useParams<{ gameId: string }>();

  console.log('gameId', gameId);

  const [drawPile, setDrawPile] = useState<ActionCardInformation[]>([
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
  ]);
  const [hand, setHand] = useState<ActionCardInformation[]>([
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
    getMiningCard(),
  ]);
  const [discards, setDiscards] = useState<ActionCardInformation[]>([]);

  const discard = useCallback(
    (id: string) => {
      const card = hand.find((c) => c.id === id);
      if (!card) throw new Error('Discarded card not found');

      setHand((hand) => hand.filter((c) => c.id !== id));
      setDiscards((discards) => [...discards, card]);
    },
    [hand, setHand, setDiscards]
  );

  return (
    <>
      <MapArea />
      <PlayArea id="play-area">
        <Pile draw cards={drawPile} setCards={setDrawPile} facedown />
        <ResourceCounter />
        <Hand cards={hand} discard={discard} />
        <Pile discard cards={discards} setCards={setDiscards} facedown />
      </PlayArea>
    </>
  );
};
export default App;
