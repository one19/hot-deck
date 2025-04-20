import localforage from 'localforage';

const settings = localforage.createInstance({
  name: 'settings',
});

export type Settings = {
  // eslint-disable-next-line
  [index: string]: any;
};
const DEFAULT_SETTINGS: Settings = {};

export const updateSettings = async (
  updatedSetting: Partial<Settings>,
): Promise<Settings> => {
  const item = await settings.getItem<Settings>('overall');

  const update = { ...item, ...updatedSetting };
  await settings.setItem<Settings>('overall', update);

  return update;
};

export const getSettings = async (): Promise<Settings> => {
  const item = await settings.getItem<Settings>('overall');
  return item || DEFAULT_SETTINGS;
};
