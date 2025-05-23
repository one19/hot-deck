import { useQuery } from '@tanstack/react-query';
import { getAllGames, GAME_ROOT } from './controllers/games';
import { Link } from '@tanstack/react-router';
import { useCreateGame, useDeleteGame, useDeleteAllGames } from './hooks/games';

import styled from '@emotion/styled';
import getMiningCard from './cards/Mining/getMiningCard';
import { nanoid } from 'nanoid';

const GameItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const MenuPage = () => {
  const createGame = useCreateGame();
  const deleteGame = useDeleteGame();
  const deleteAllGames = useDeleteAllGames();
  const { data: games, isLoading } = useQuery({
    queryFn: getAllGames,
    queryKey: [GAME_ROOT],
  });

  if (!games || isLoading) return <div>Loading...</div>;

  return (
    <>
      <div>SETTINGS MENU</div>
      <div>
        {games.map((game) => (
          <GameItem key={game.id}>
            <Link to={`/game/${game.id}`}>game: {game.id}</Link>
            <div onMouseDown={() => deleteGame(game.id)}>delete</div>
          </GameItem>
        ))}

        <div
          onMouseDown={() => {
            createGame({
              name: `new fake game ${games.length + 1}`,
              drawPile: Array.from({ length: 10 }, getMiningCard),
              actionCardPile: [{ drawCount: 5, cost: 3, id: nanoid() }],
            });
          }}
        >
          Create new game
        </div>
        <div onMouseDown={() => deleteAllGames()}> delete all games</div>
      </div>
    </>
  );
};

export default MenuPage;
