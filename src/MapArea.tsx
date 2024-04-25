import styled from '@emotion/styled';

const ScrollableContainer = styled.div`
  position: absolute;
  top: 5vh;
  left: 5vw;
  width: 90vw;
  height: 90vh;
  overflow: auto;
  border-radius: 20px;
  scrollbar-width: auto; /* Adjusted for Firefox */
  scrollbar-color: #555 #e0e0e0; /* For Firefox */

  /* For Webkit (Chrome, Safari, etc.) */
  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  &::-webkit-scrollbar-track {
    background: #e0e0e0;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 6px;
    border: 3px solid #e0e0e0;
  }
`;

const LargeContent = styled.div`
  width: 200vw;
  height: 200vh;
  z-index: var(--z-index-map);
  background-color: #f1f4f8; /* Light grey/blue typical of blueprint background */
  background-image: linear-gradient(
      0deg,
      transparent 24%,
      rgba(200, 200, 255, 0.5) 25%,
      rgba(200, 200, 255, 0.5) 26%,
      transparent 27%,
      transparent 74%,
      rgba(200, 200, 255, 0.5) 75%,
      rgba(200, 200, 255, 0.5) 76%,
      transparent 77%,
      transparent
    ),
    linear-gradient(
      90deg,
      transparent 24%,
      rgba(200, 200, 255, 0.5) 25%,
      rgba(200, 200, 255, 0.5) 26%,
      transparent 27%,
      transparent 74%,
      rgba(200, 200, 255, 0.5) 75%,
      rgba(200, 200, 255, 0.5) 76%,
      transparent 77%,
      transparent
    );
  background-size: 30px 30px;

  &::before,
  &::after {
    content: '';
    position: absolute;
    background-color: #000aff; /* Dark blue for visibility */
  }

  /* Vertical line (Y-axis) */
  &::before {
    left: 50%;
    top: 0;
    bottom: 0;
    width: 2px;
  }

  /* Horizontal line (X-axis) */
  &::after {
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
  }
`;

const CoordinateLabel = styled.div`
  position: absolute;
  background-color: #fff;
  padding: 2px 5px;
  font-size: 12px;
  border: 1px solid #888;
  border-radius: 3px;
`;

const MapArea = () => (
  <ScrollableContainer>
    <LargeContent>
      {/* Your content here */}
      {/* Example labels for Y-axis */}
      {Array.from({ length: 21 }).map((_, i) => (
        <CoordinateLabel
          style={{ left: '50%', top: `${5 * i}%`, transform: 'translate(-100%, 0)' }}
        >
          {1000 - 100 * i} m
        </CoordinateLabel>
      ))}
      {/* Example labels for X-axis */}
      {Array.from({ length: 21 }).map((_, i) => (
        <CoordinateLabel
          style={{ top: '50%', left: `${5 * i}%`, transform: 'translate(0, -100%)' }}
        >
          {-1000 + 100 * i} m
        </CoordinateLabel>
      ))}
    </LargeContent>
  </ScrollableContainer>
);

export default MapArea;
