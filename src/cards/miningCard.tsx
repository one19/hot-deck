import { nanoid } from 'nanoid';

import ImageFan from './ImageFan';
import { coal, copper, gold, oil, rocks, sand, magnetite } from '../assets/resources/raw';

export type ActionCardProps = {
  facedown?: boolean;
};

const miningCard = ({ facedown }: ActionCardProps = {}) => {
  const resources = [gold, rocks, coal, copper, magnetite, oil, sand];
  return {
    cost: 0,
    facedown,
    id: nanoid(),
    title: 'Mining',
    text: 'Gain 1 resource',
    imageComponent: <ImageFan images={resources} />,
  };
};

export default miningCard;
