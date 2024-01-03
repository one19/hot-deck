import localforage from 'localforage';

import { ResourceState, ResourceObject } from './types';

const resources = localforage.createInstance({
  name: 'resources',
});

export const updateResources = async (
  value: Partial<ResourceState>,
  resourceVariant: string,
  gameId: string
): Promise<ResourceObject> => {
  const itemId = `${gameId}/${resourceVariant}`;

  const item = await resources.getItem<ResourceState>(itemId);

  const updated = Object.entries(value).reduce((acc: ResourceState, [key, value]) => {
    if (!value) return acc;

    const newValue = (item?.[key] ?? 0) + value;
    if (newValue <= 0) throw new Error(`Cannot have less than 0 of ${key}`);

    return {
      ...acc,
      [key]: newValue,
    };
  }, item ?? {});

  const updatedItem = await resources.setItem<ResourceState>(itemId, updated);
  return { id: resourceVariant, state: updatedItem };
};

export const getAllResources = async (gameId: string): Promise<ResourceObject[]> => {
  const allResources = await resources.keys();

  const gameResources = allResources.filter((resource) => resource.startsWith(gameId));

  const found = await Promise.all(
    gameResources.map((resource) => resources.getItem<ResourceState>(resource))
  );

  return found
    .map((r: ResourceState | null, i: number) => ({
      id: gameResources[i].replace(`${gameId}/`, ''),
      state: r,
    }))
    .filter((s): s is ResourceObject => Boolean(s));
};
