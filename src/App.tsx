import styled from '@emotion/styled';

import miningCard from './cards/miningCard';
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

const cards = [miningCard(), miningCard(), miningCard(), miningCard(), miningCard()];

const App = () => (
  <PageContainer>
    <PlayArea />
    <Pile infinite facedown cardFactory={miningCard} />
    <Hand cards={cards} />
  </PageContainer>
);

export default App;
