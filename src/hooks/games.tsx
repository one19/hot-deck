import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import {
  deleteAllGames,
  deleteGame,
  createGame,
  updateGame,
  getGame,
  Game,
  GAME_ROOT,
} from '../controllers/games';
import { useCallback } from 'react';

export const useGame = () => {
  const queryClient = useQueryClient();
  const gameId = useParams({
    from: '/game/$gameId',
    select: (params) => params.gameId || 'test',
  });

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

export const useDiscard = () => {
  const [{ data: game }, setGame] = useGame();

  return useCallback(
    (cardId: string) => {
      if (!game) return;

      const card = game.hand.find((c) => c.id === cardId);
      if (!card) throw new Error("couldn't find card to destroy");

      const remainingHand = game.hand?.filter((c) => c.id !== cardId);
      const updatedDiscard = [...game.discardPile, card];

      setGame({ hand: remainingHand, discardPile: updatedDiscard });
    },
    [game, setGame],
  );
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
