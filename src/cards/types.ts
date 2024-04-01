export type Orientation = {
  rotateX: number;
  rotateZ: number;
  scale: number;
  zoom: number;
  x: number;
  y: number;
};

export type ActionCardInformation = {
  id: string;
  cost: number;
  text: string; // to be changed to something dynamically interpretable later
  title: string;
  variant?: string;
  imageUrl?: string;
  facedown?: boolean;
  disabled?: boolean;
  className?: string;
  discard: () => void;
  isFocused?: boolean;
  resources: { name: string; image: string }[];
  orientation?: Partial<Orientation>;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
};
