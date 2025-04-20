import styled from '@emotion/styled';

const LEFT_ANGLE = (Math.atan2(1, 0.5) * 180) / Math.PI;
const RIGHT_ANGLE = 180 - LEFT_ANGLE;

const calculateDimensions = (
  angleDegrees: number,
): { width: string; height: string } => {
  const angleRadians = angleDegrees * (Math.PI / 180);

  if (angleDegrees <= LEFT_ANGLE) {
    const ratio = Math.tan(angleRadians);
    return { width: '0', height: `${Math.round(100 - ratio * 50)}%` };
  } else if (angleDegrees >= RIGHT_ANGLE) {
    return {
      width: '100%',
      height: `${Math.round(100 - Math.tan(Math.PI - angleRadians) * 50)}%`,
    };
  } else if (angleDegrees <= 90) {
    const ratio = Math.tan(Math.PI / 2 - angleRadians);
    const fromCenter = 100 * (0.5 - ratio);
    return { width: `${Math.round(fromCenter)}%`, height: '0' };
  }

  const ratio = Math.tan(angleRadians - Math.PI / 2);
  const fromCenter = 100 * (0.5 + ratio);
  return { width: `${Math.round(fromCenter)}%`, height: '0' };
};

const ImageWrapper = styled.div<{ count: number }>`
  position: relative;
  width: 180px; // Set a fixed width
  height: 180px; // Set a fixed height
  pointer-events: none;
  user-select: none;

  img {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }

  ${({ count }) =>
    Array.from({ length: count }, (_, i) => i).map((index) => {
      const angle = 180 / count;
      const startAngle = (180 / count) * index;
      const endAngle = startAngle + angle;
      const containsLeftCorner =
        startAngle < LEFT_ANGLE && endAngle >= LEFT_ANGLE;
      const containsRightCorner =
        startAngle < RIGHT_ANGLE && endAngle >= RIGHT_ANGLE;

      const startDims = calculateDimensions(startAngle);
      const endDims = calculateDimensions(endAngle);

      if (containsLeftCorner && containsRightCorner) {
        return;
      }

      return `
          img:nth-of-type(${index + 1}) {
            clip-path: polygon(
              50% 100%,
              ${startDims.width} ${startDims.height}, ${containsLeftCorner ? '0 0, ' : ''}${
                containsRightCorner ? '100% 0, ' : ''
              }
              ${endDims.width} ${endDims.height}
            );
          }
        `;
    })}
`;

interface Props {
  images: string[]; // Array of image URLs
}

const ImageComponent = ({ images }: Props) => (
  <ImageWrapper count={images.length}>
    {images.map((src, index) => (
      <img draggable={false} key={index} src={src} alt={`Image ${index}`} />
    ))}
  </ImageWrapper>
);

export default ImageComponent;
