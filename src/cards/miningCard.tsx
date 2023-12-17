import { nanoid } from 'nanoid';

import ImageFan from './ImageFan';
import { coal, copper, gold, oil, rocks, sand, magnetite } from '../assets/resources/raw';

const miningCard = () => {
  const resources = [gold, rocks, coal, copper, magnetite, oil, sand];
  return {
    id: nanoid(),
    title: 'Mining',
    cost: 0,
    text: 'Gain 1 resource',
    imageComponent: <ImageFan images={resources} />,
  };
};

export default miningCard;
