import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  borderWidth?: number;
  anchor?: number;
  colorFrom?: string;
  colorTo?: string;
  delay?: number;
};

const borderBeamAnimation = keyframes`
  to {
    offset-distance: 100%;
  }
`;

const BorderBeamContainer = styled.div<{
  size: number;
  duration: number;
  borderWidth: number;
  anchor: number;
  colorFrom: string;
  colorTo: string;
  delay: number;
}>`
  pointer-events: none;
  position: absolute;
  inset: 0;
  border: ${(props) => props.borderWidth}px solid transparent;
  border-radius: inherit;

  /* Mask styles */
  mask-clip: padding-box, border-box !important;
  mask-composite: intersect !important;
  mask:
    linear-gradient(transparent, transparent), linear-gradient(white, white);

  /* Pseudo-element styles */
  &::after {
    content: '';
    position: absolute;
    aspect-ratio: 1;
    width: ${(props) => props.size}px;
    animation: ${borderBeamAnimation} ${(props) => props.duration}s infinite;
    animation-delay: -${(props) => props.delay}s;
    animation-timing-function: linear;
    background: linear-gradient(
      to left,
      ${(props) => props.colorFrom},
      ${(props) => props.colorTo},
      transparent
    );
    offset-anchor: calc(${(props) => props.anchor}%) 50%;
    offset-path: rect(0 auto auto 0 round ${(props) => props.size}px);
  }
`;

export const BorderBeam = ({
  className,
  size = 200,
  duration = 9,
  anchor = 90,
  borderWidth = 2,
  colorFrom = '#ffaa40',
  colorTo = '#9c40ff',
  delay = 0,
}: BorderBeamProps) => {
  return (
    <BorderBeamContainer
      className={className}
      size={size}
      duration={duration}
      borderWidth={borderWidth}
      anchor={anchor}
      colorFrom={colorFrom}
      colorTo={colorTo}
      delay={delay}
    />
  );
};
