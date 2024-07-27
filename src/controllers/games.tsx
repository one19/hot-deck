import localforage from 'localforage';
import { nanoid } from 'nanoid';

import { deleteGameResources, resources } from './resources';

export const GAME_ROOT = 'games';

export const games = localforage.createInstance({
  name: GAME_ROOT,
});

export type Game = {
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [index: string]: any;
};

export const createGame = async (game: Partial<Game>): Promise<Game> => {
  const id = nanoid();
  const newGame = {
    ...game,
    id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await games.setItem<Game>(id, newGame);
  return newGame;
};

export const updateGame = async (updatedGame: Partial<Game>, gameId: string): Promise<Game> => {
  const item = await games.getItem<Game>(gameId);

  const update = { ...item, ...updatedGame, id: gameId, updatedAt: new Date().toISOString() };
  await games.setItem<Game>(gameId, update);

  return update;
};

export const getGame = async (id: string): Promise<Game> => {
  const item = await games.getItem<Game>(id);
  if (!item) throw new Error('Game not found');
  return item;
};

const removeEmpties = (obj: Game | null): obj is Game => obj !== null;

export const getAllGames = async (): Promise<Game[]> => {
  const keys = await games.keys();
  const items = await Promise.all(keys.map((key) => games.getItem<Game>(key)));
  if (items.length !== keys.length) console.warn("Some games weren't found, uh oh.");

  return items.filter(removeEmpties);
};

export const deleteGame = async (id: string): Promise<void> => {
  await games.removeItem(id);
  await deleteGameResources(id);
};

export const deleteAllGames = async (): Promise<void> => {
  await games.clear();
  await resources.clear();
};
