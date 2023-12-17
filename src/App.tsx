import styled from '@emotion/styled';

import miningCard from './cards/miningCard';
import PlayArea from './PlayArea';
import Hand from './Hand';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* To prevent scrolling on the page body */
`;

const cards = [miningCard(), miningCard(), miningCard(), miningCard(), miningCard()];

const App = () => (
  <PageContainer>
    <PlayArea />
    <Hand cards={cards} />
  </PageContainer>
);

export default App;
