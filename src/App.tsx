import faceUrl from './assets/face-tinyfied.jpg';
import Card from './Card';
import Hand from './Hand';

const cards = [
  { cost: 5, title: 'Basic Factory', imageUrl: faceUrl, text: 'Turns 6 coal into 2 iron' },
  { cost: 5, title: 'Basic Factory', imageUrl: faceUrl, text: 'Turns 6 coal into 2 iron' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
  { cost: 0, title: 'Coal', imageUrl: faceUrl, text: 'Used to power factories' },
];

const App = () => (
  <>
    <Card cost={5} title="Basic Factory" imageUrl={faceUrl} text="Turns 6 coal into 2 iron" />
    <Hand cards={cards} />
  </>
);

export default App;
