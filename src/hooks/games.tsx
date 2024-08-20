import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  deleteAllGames,
  deleteGame,
  createGame,
  updateGame,
  getGame,
  Game,
  GAME_ROOT,
} from '../controllers/games';
import { useParams } from 'react-router-dom';

export const useGame = () => {
  const queryClient = useQueryClient();
  const { gameId = 'test' } = useParams<{ gameId: string }>();

  const query = useQuery({
    queryKey: [GAME_ROOT, { id: gameId }],
    queryFn: () => getGame(gameId),
  });
  const { mutate } = useMutation({
    mutationKey: [GAME_ROOT, gameId],
    mutationFn: (value: Partial<Game>) => updateGame(value, gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GAME_ROOT] }),
  });

  return [query, mutate] as const;
};

export const useCreateGame = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: [GAME_ROOT],
    mutationFn: (value: Partial<Game>) => createGame(value),
    onError: (error) => console.error('error creating game', error),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GAME_ROOT] }),
  });

  return mutate;
};

export const useDeleteAllGames = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: [GAME_ROOT],
    mutationFn: () => deleteAllGames(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GAME_ROOT] }),
  });

  return mutate;
};

export const useDeleteGame = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationKey: [GAME_ROOT],
    mutationFn: (id: string) => deleteGame(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [GAME_ROOT] }),
  });

  return mutate;
};

// DELIBERATELY OMITTING GET ALL GAMES HOOK
// queries are easy enough to instantiate in components
// mutations and query key invalidation are the more complex parts
// much better for encapsulation
