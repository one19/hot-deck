import styled from '@emotion/styled';
import { nanoid } from 'nanoid';

import ResourceCounter from './zoo/ResourceCounter';
import MapArea from './zoo/MapArea';
import Hand from './Hand';
import Pile from './cards/Pile';
import { Link } from '@tanstack/react-router';
import DrawX from './cards/Actions/DrawX';
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
  const [{ isLoading, data: game }, _setGame] = useGame();

  if (isLoading || !game) return <div>Loading...</div>;

  const { hand = [], drawPile = [], discardPile = [] } = game;

  return (
    <>
      <Link to="/">return to home</Link>
      <MapArea />
      <PlayArea id="play-area">
        <DrawX drawCount={5} cost={3} id={nanoid()} />
        <Pile draw cards={drawPile} facedown />
        <ResourceCounter />
        <Hand cards={hand ?? []} />
        <Pile discard cards={discardPile ?? []} facedown />
      </PlayArea>
    </>
  );
};
export default App;
