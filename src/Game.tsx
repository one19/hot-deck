import styled from '@emotion/styled';

import ResourceCounter from './zoo/ResourceCounter';
import MapArea from './zoo/MapArea';
import Hand from './Hand';
import Pile from './cards/Pile';
import { useNavigate } from 'react-router-dom';
import MiniZone from './cards/Actions/MiniZone';
import { useGame } from './hooks/games';

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
  const navigate = useNavigate();
  const [game] = useGame();

  if (!game) return <div>Loading...</div>;

  const { hand = [], drawPile = [], discardPile = [] } = game;

  return (
    <>
      <div onMouseDown={() => navigate('/')}>return to home</div>
      <MapArea />
      <PlayArea id="play-area">
        <MiniZone />
        <Pile draw cards={drawPile} facedown />
        <ResourceCounter />
        <Hand cards={hand ?? []} />
        <Pile discard cards={discardPile ?? []} facedown />
      </PlayArea>
    </>
  );
};
export default App;
