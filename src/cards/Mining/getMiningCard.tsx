import { nanoid } from 'nanoid';

import { coal, copper, gold, oil, rock, sand, magnetite } from '../../assets/resources/raw';

export type MiningCardProps = {
  facedown?: boolean;
};

const getMiningCard = ({ facedown }: MiningCardProps = {}) => {
  const resources = [
    { name: 'gold', image: gold },
    { name: 'rock', image: rock },
    { name: 'coal', image: coal },
    { name: 'copper', image: copper },
    { name: 'magnetite', image: magnetite },
    { name: 'oil', image: oil },
    { name: 'sand', image: sand },
  ];
  return {
    cost: 0,
    facedown,
    id: nanoid(),
    title: 'Mining',
    discard: () => {},
    variant: 'rawResources',
    shiny: Math.random() > 0.75,
    text: 'Gain 1 resource',
    resources,
  };
};

export default getMiningCard;
