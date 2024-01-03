import styled from '@emotion/styled';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

import ResourceCounter from './zoo/ResourceCounter';
import { GameIdContext } from './providers/GameId';
import getMiningCard from './cards/getMiningCard';
import PlayArea from './PlayArea';
import Pile from './cards/Pile';
import Hand from './Hand';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* To prevent scrolling on the page body */

  --card-width: 200px;
  --card-height: 280px;
  --card-border-radius: 10px;

  --z-index-map: 0;
  --z-index-cards: 1000;
  --z-index-menus: 2000;
`;

const queryClient = new QueryClient();

const cards = [getMiningCard(), getMiningCard(), getMiningCard(), getMiningCard(), getMiningCard()];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <GameIdContext.Provider value="test">
      <PageContainer>
        <ResourceCounter />
        <PlayArea />
        <Pile infinite facedown cardFactory={getMiningCard} />
        <Hand cards={cards} />
      </PageContainer>
    </GameIdContext.Provider>
  </QueryClientProvider>
);

export default App;
