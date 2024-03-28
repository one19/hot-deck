import styled from '@emotion/styled';
import { Global, css } from '@emotion/react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import ResourceCounter from './zoo/ResourceCounter';
import { GameIdContext } from './providers/GameId';
import getMiningCard from './cards/getMiningCard';
import MapArea from './MapArea';
import Hand from './Hand';

const globalStyles = css`
  html,
  body,
  #root {
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
    overflow: hidden; /* To prevent scrolling on the page body */
  }

  body {
    font-family: sans-serif;
  }
`;

const PlayArea = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  margin: 0;
  overflow: hidden; /* To prevent scrolling on the page body */

  grid-template-columns: [left] 0 [map-left] 5vw [map-right] 90vw [right] 100vw;
  grid-template-rows: [top] 0 [map-top] 10% [map-bottom] 90% [bottom];

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

const cards = [getMiningCard(), getMiningCard(), getMiningCard(), getMiningCard(), getMiningCard()];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Global styles={globalStyles} />
    <GameIdContext.Provider value="test">
      <PlayArea id="root">
        <ResourceCounter />
        <MapArea />
        <Hand cards={cards} />
      </PlayArea>
    </GameIdContext.Provider>
  </QueryClientProvider>
);

export default App;
