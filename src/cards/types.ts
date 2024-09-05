import { SpringValue } from '@react-spring/web';

export const DEFAULT_ORIENTATION = {
  opacity: 1,
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
  scale: 1,
  zoom: 0,
  x: 0,
  y: 0,
};

type MappedSpringProps<T> = {
  [K in keyof T]: SpringValue<number>;
};

export type SpringProps = MappedSpringProps<typeof DEFAULT_ORIENTATION>;

export type Orientation = typeof DEFAULT_ORIENTATION;

export type GeneralCardInformation = {
  id: string;
  cost: number;
  text: string; // to be changed to something dynamically interpretable later
  title: string;
  shiny?: boolean;
  variant?: string;
  imageUrl?: string;
  facedown?: boolean;
  disabled?: boolean;
  className?: string;
  isFocused?: boolean;
  resources: { name: string; image: string }[];
  orientation?: Partial<Orientation>;
};
