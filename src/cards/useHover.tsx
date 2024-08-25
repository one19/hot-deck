import { useRef, useCallback } from 'react';
import { useGesture } from '@use-gesture/react';
import { Orientation, SpringProps } from './types';

type UseCardHoverProps = {
  cardRef: React.RefObject<HTMLDivElement>;
  api: { start: (styles: Partial<Orientation>) => void };
  props: SpringProps;
};

const useCardHover = ({ cardRef, api, props }: UseCardHoverProps) => {
  const dimStore = useRef<DOMRect>({} as DOMRect);

  const rotX = useCallback(
    (py: number) => (py - props.y.get() - dimStore.current.y - dimStore.current.height / 2) / 5,
    [props.y, dimStore]
  );
  const rotY = (px: number) =>
    -(px - props.x.get() - dimStore.current.x - dimStore.current.width / 2) / 5;

  return useGesture({
    onHover: ({ active, last }) => {
      void api.start({
        scale: active ? 1.1 : 1,
        rotateX: 0,
        rotateY: 0,
      });

      if (last && cardRef.current) {
        cardRef.current.style.setProperty('--spotlight-intensity', '0');
      }
    },
    onMove: ({ hovering, first, xy: [px, py] }) => {
      if (first && cardRef.current) {
        dimStore.current = cardRef.current.getBoundingClientRect();
        cardRef.current.style.setProperty('--spotlight-intensity', '0.2');
      }

      if (hovering && cardRef.current) {
        void api.start({
          rotateX: rotX(py),
          rotateY: rotY(px),
        });

        const x = (px - dimStore.current.left) / dimStore.current.width;
        const y = (py - dimStore.current.top) / dimStore.current.height;

        cardRef.current.style.setProperty('--spotlight-x', `${x * 100}%`);
        cardRef.current.style.setProperty('--spotlight-y', `${y * 100}%`);
      }
    },
  });
};

export default useCardHover;
