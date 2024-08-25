import { useQuery } from '@tanstack/react-query';
import { getAllGames, GAME_ROOT } from './controllers/games';
import { useNavigate } from 'react-router-dom';
import { useCreateGame, useDeleteGame, useDeleteAllGames } from './hooks/games';

import styled from '@emotion/styled';
import getMiningCard from './cards/Mining/getMiningCard';

const GameItem = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const MenuPage = () => {
  const navigate = useNavigate();
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
            <div onMouseDown={() => navigate(`/game/${game.id}`)}>game: {game.id}</div>
            <div onMouseDown={() => deleteGame(game.id)}>delete</div>
          </GameItem>
        ))}

        <div
          onMouseDown={() => {
            createGame({
              name: `new fake game ${games.length + 1}`,
              drawPile: Array.from({ length: 10 }, getMiningCard),
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
