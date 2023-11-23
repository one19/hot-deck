import styled from '@emotion/styled';
import faceUrl from './assets/face-tinyfied.jpg';
import Hand from './Hand';
import PlayArea from './PlayArea';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  overflow: hidden; /* To prevent scrolling on the page body */
`;

const cards = [
  { cost: 5, title: 'Basic Factory', imageUrl: faceUrl, text: 'Turns 6 coal into 2 iron' },
  { cost: 5, title: 'Basic Factory', imageUrl: faceUrl, text: 'Turns 6 coal into 2 iron' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
];

const App = () => (
  <PageContainer>
    <PlayArea />
    <Hand cards={cards} />
  </PageContainer>
);

export default App;
