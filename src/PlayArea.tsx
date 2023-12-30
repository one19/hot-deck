import styled from '@emotion/styled';

const ScrollableContainer = styled.div`
  width: 90vw;
  height: 90vh;
  overflow: auto;
  scrollbar-width: auto; /* Adjusted for Firefox */
  scrollbar-color: #888 #f0f0f0; /* For Firefox */

  /* For Webkit (Chrome, Safari, etc.) */
  &::-webkit-scrollbar {
    width: 12px; /* Adjusted width for vertical scrollbar */
    height: 12px; /* Adjusted height for horizontal scrollbar */
  }
  &::-webkit-scrollbar-track {
    background: #f0f0f0;
    border-radius: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 6px;
    border: 3px solid #f0f0f0;
  }
`;

const LargeContent = styled.div`
  width: 200vw;
  height: 200vh;
  z-index: var(--z-index-map);
  background-image: linear-gradient(0deg, #f0f4f8 24.5%, rgba(240, 244, 248, 0) 25%),
    linear-gradient(90deg, #f0f4f8 24.5%, rgba(240, 244, 248, 0) 25%),
    linear-gradient(rgba(255, 235, 59, 0.3) 4px, transparent 1px),
    linear-gradient(90deg, rgba(255, 235, 59, 0.3) 1px, transparent 1px);
  background-size:
    50px 50px,
    50px 50px,
    50px 50px,
    50px 50px;
  background-position:
    -2px -2px,
    -2px -2px,
    -2px -2px,
    -2px -2px;
`;

const MyScrollableComponent = () => (
  <ScrollableContainer>
    <LargeContent>{/* Your content here */}</LargeContent>
  </ScrollableContainer>
);

export default MyScrollableComponent;
