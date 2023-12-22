import { nanoid } from 'nanoid';

import ImageFan from './ImageFan';
import { coal, copper, gold, oil, rocks, sand, magnetite } from '../assets/resources/raw';

const miningCard = () => {
  const resources = [gold, rocks, coal, copper, magnetite, oil, sand];
  return {
    cost: 0,
    id: nanoid(),
    title: 'Mining',
    text: 'Gain 1 resource',
    facedown: Math.random() > 0.5,
    imageComponent: <ImageFan images={resources} />,
  };
};

export default miningCard;
