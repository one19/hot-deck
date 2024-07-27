import { useQuery } from '@tanstack/react-query';
import { getAllGames, GAME_ROOT } from './controllers/games';
import { useNavigate } from 'react-router-dom';
import { useCreateGame, useDeleteAllGames } from './hooks/games';

const MenuPage = () => {
  const navigate = useNavigate();
  const createGame = useCreateGame();
  const deleteAllGames = useDeleteAllGames();
  const { data: games, isLoading } = useQuery({
    queryFn: getAllGames,
    queryKey: [GAME_ROOT],
  });

  if (!games || isLoading) return <div>Loading...</div>;

  console.log('games', games);

  return (
    <>
      <div>SETTINGS MENU</div>
      <div>
        {games.map((game) => (
          <div key={game.id} onMouseDown={() => navigate(`/game/${game.id}`)}>
            game: {game.id}
          </div>
        ))}

        <div onMouseDown={() => createGame({ name: `new fake game ${games.length + 1}` })}>
          Create new game
        </div>
        <div onMouseDown={() => deleteAllGames()}> delete all games</div>
      </div>
    </>
  );
};

export default MenuPage;
