import { createPortal } from 'react-dom';
import { useRef, useState } from 'react';
import { useSpring, config } from '@react-spring/web';
import { useGesture } from '@use-gesture/react';
import { useSetResources } from '../../hooks/resources';
import ResourceSelector from './ResourceSelector';
import Card from '../Card';

import { GeneralCardInformation, DEFAULT_ORIENTATION } from '../types';
import { useDiscard } from '../../hooks/games';

const MiningCard = ({
  orientation,
  resources,
  disabled,
  facedown,
  variant,
  shiny,
  title,
  text,
  cost,
  id,
}: GeneralCardInformation) => {
  const [isHovering, setHovering] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const [renderSelection, setRenderSelection] = useState(false);
  const dimStore = useRef<DOMRect>({} as DOMRect);
  const cardRef = useRef<HTMLDivElement>(null);
  const initialOffset = useRef({ x: 0, y: 0 });
  const hoveredResourceRef = useRef<string | null>(null);
  const { mutate } = useSetResources('rawResources');
  const discard = useDiscard();

  const playArea = document.getElementById('play-area');

  const [props, api] = useSpring(
    () => ({
      ...DEFAULT_ORIENTATION,
      ...orientation,
      rotateZ: (orientation?.rotateZ ?? DEFAULT_ORIENTATION.rotateZ) * (facedown ? -1 : 1),
      opacity: facedown ? 0 : 1,
      rotateY: facedown ? 180 : 0,
      config: config.stiff,
    }),
    [orientation]
  );

  const rotX = (py: number) =>
    (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5;
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  const bind = useGesture(
    {
      onDrag: ({ initial, active, movement: [mx, my], first }) => {
        setHovering(false);
        setDragging(true);
        setRenderSelection(true);
        if (active) {
          // Capture the initial offset from the cursor to the center of the card
          if (first && initial) {
            const cardCenterX = dimStore.current.x + dimStore.current.width / 2;
            const cardCenterY = dimStore.current.y + dimStore.current.height / 2;
            initialOffset.current = {
              x: initial[0] - cardCenterX,
              y: initial[1] - cardCenterY,
            };
            if (!cardRef.current) return;
            cardRef.current.style.setProperty('pointer-events', 'none');
          }

          // Apply the initial offset to keep the card centered on the cursor
          void api.start({
            x: mx + initialOffset.current.x,
            y: my + initialOffset.current.y,
            scale: 0.3,
            rotateX: 0,
            rotateY: props.rotateY.get(),
          });

          // selected a resource; discard the card
        } else if (hoveredResourceRef.current) {
          const DURATION = 250;
          mutate({ [hoveredResourceRef.current]: 1 });
          // TODO: replace this with stars and sparkles
          void api.start({ x: 0, y: 0, scale: 0, rotateZ: 6000, config: { duration: DURATION } });
          setTimeout(() => discard(id), DURATION);
        } else {
          // return to initial on end of dragging phase
          setDragging(false);
          initialOffset.current = { x: 0, y: 0 };
          setRenderSelection(false);
          void api.start({
            x: 0,
            y: 0,
            scale: isHovering ? 1.1 : 1,
          });
          if (!cardRef.current) return;
          cardRef.current.style.setProperty('pointer-events', 'auto');
        }
      },
      onHover: ({ dragging, active, last }) => {
        setHovering(true);
        if (!dragging) {
          void api.start({
            scale: active ? 1.1 : 1,
            rotateX: 0,
            rotateY: facedown ? 180 : 0,
          });
        }
        if (last) {
          cardRef?.current?.style.setProperty('--spotlight-intensity', '0');
        }
      },
      onMove: ({ dragging, hovering, first, last, xy: [px, py] }) => {
        // start by setting the card dims in a non-rerendering way
        if (first && cardRef.current) {
          dimStore.current = cardRef.current.getBoundingClientRect();
          cardRef.current.style.setProperty('--spotlight-intensity', '0.2');
        }

        if (last && !dragging && hovering && !isHovering) {
          // final call on end of dragging phase
          void api.start({ scale: 1 });
          cardRef?.current?.style.setProperty('--spotlight-intensity', '0');
        }

        if (!dragging && hovering && isHovering) {
          if (!cardRef.current) return;
          void api.start({
            rotateX: rotX(py),
            rotateY: rotY(px) + (facedown ? 180 : 0),
          });

          const x = (px - dimStore.current.left) / dimStore.current.width;
          const y = (py - dimStore.current.top) / dimStore.current.height;

          cardRef.current.style.setProperty('--spotlight-x', `${x * 100}%`);
          cardRef.current.style.setProperty('--spotlight-y', `${y * 100}%`);
        }
      },
    },
    { drag: { pointer: { capture: false } } }
  );

  return (
    <>
      <Card
        bind={!disabled ? bind : undefined}
        cardRef={cardRef}
        springProps={props}
        title={title}
        variant={variant}
        shiny={shiny}
        cost={cost}
        text={text}
        images={resources.map((r) => r.image)}
        data-grabbed={isDragging}
        id={id}
      />
      {playArea &&
        renderSelection &&
        !facedown &&
        createPortal(
          <ResourceSelector resources={resources} hoveredResourceRef={hoveredResourceRef} />,
          playArea
        )}
    </>
  );
};

export default MiningCard;
