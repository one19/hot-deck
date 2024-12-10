import { useRef, useEffect } from 'react';
import { useSpring, config } from '@react-spring/web';

import Card from '../Card';
import useHover from '../useHover';
import { DEFAULT_ORIENTATION } from '../types';
import { useGame } from '../../hooks/games';

export type ActionEconomyCardInformation = {
  drawCount: number;
  shiny?: boolean;
  cost: number;
  id: string;
};

const DrawX = ({ drawCount, shiny, cost, id }: ActionEconomyCardInformation) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [game, setGame] = useGame();

  const [props, api] = useSpring(
    () => ({
      ...DEFAULT_ORIENTATION,
      config: config.stiff,
    }),
    []
  );

  const bind = useHover({ cardRef, api, props });

  // useEffect(() => {
  //   const drawCards = async () => {
  //     if (!game) return;

  //     const remainingDraws = game.actionCardActivations || drawCount;
  //     console.log(remainingDraws);

  //     // no game, or anything to draw, nothing to do
  //     if (!game.drawPile?.length) return setGame({ actionCardIndex: game.actionCardIndex + 1 });

  //     // Delay for 300ms between each draw
  //     await new Promise((resolve) => setTimeout(resolve, 300));

  //     setGame({
  //       drawPile: game.drawPile.slice(1),
  //       actionCardActivations: remainingDraws - 1,
  //       hand: [...(game.hand || []), game.drawPile[0]],
  //     });
  //   };

  //   void drawCards();
  // }, [drawCount, setGame, game]);

  return (
    <Card
      bind={bind}
      cardRef={cardRef}
      springProps={props}
      title={`Draw ${drawCount}`}
      text={`Draw ${drawCount} cards from your draw pile`}
      cost={cost}
      shiny={shiny}
      variant="action"
      id={id}
    />
  );
};

export default DrawX;
