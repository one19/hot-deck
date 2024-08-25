import localforage from 'localforage';
import { nanoid } from 'nanoid';

import { deleteGameResources, resources } from './resources';
import { ActionCardInformation } from '../cards/types';

export const GAME_ROOT = 'games';

export const games = localforage.createInstance({
  name: GAME_ROOT,
});

export type Game = {
  id: string;
  createdAt: string;
  updatedAt: string;
  name?: string;
  drawPile?: ActionCardInformation[];
  hand?: ActionCardInformation[];
  discardPile?: ActionCardInformation[];

  // TODO: remove once we shake out the state flow
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
  if (!item) throw Error('Game not found to update');

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
