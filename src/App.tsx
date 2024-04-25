import { useState, useCallback } from 'react';
import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import ResourceCounter from './zoo/ResourceCounter';
import { GameIdContext } from './providers/GameId';
import getMiningCard from './cards/Mining/getMiningCard';
import MapArea from './MapArea';
import Hand from './Hand';
import Pile from './cards/Pile';
import { ActionCardInformation } from './cards/types';
import Scanlines from './cards/Shaders/Scanlines';

const globalStyles = css`
  html,
  body {
    font-family: sans-serif;
    margin: 0;
  }
`;

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

const queryClient = new QueryClient();

const App = () => {
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
    <QueryClientProvider client={queryClient}>
      <Global styles={globalStyles} />
      <GameIdContext.Provider value="test">
        <Scanlines />
        <MapArea />
        <PlayArea id="play-area">
          <Pile draw cards={drawPile} setCards={setDrawPile} facedown />
          <ResourceCounter />
          <Hand cards={hand} discard={discard} />
          <Pile discard cards={discards} setCards={setDiscards} facedown />
        </PlayArea>
      </GameIdContext.Provider>
    </QueryClientProvider>
  );
};
export default App;
