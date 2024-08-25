import { useRef } from 'react';
import { useSpring, config } from '@react-spring/web';

import Card from '../Card';
import useHover from '../useHover';
import { DEFAULT_ORIENTATION } from '../types';

type ActionEconomyCardInformation = {
  drawCount: number;
  shiny?: boolean;
  cost: number;
  id: string;
};

const DrawX = ({ drawCount, shiny, cost, id }: ActionEconomyCardInformation) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const [props, api] = useSpring(
    () => ({
      ...DEFAULT_ORIENTATION,
      config: config.stiff,
    }),
    []
  );

  const bind = useHover({ cardRef, api, props });

  return (
    <Card
      bind={bind}
      cardRef={cardRef}
      springProps={props}
      title={`Draw ${drawCount}`}
      text={`Draw ${drawCount} cards from your draw pile`}
      cost={cost}
      shiny={shiny}
      variant="actionBackground"
      id={id}
    />
  );
};

export default DrawX;
