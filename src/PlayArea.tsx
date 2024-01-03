import styled from '@emotion/styled';

const ScrollableContainer = styled.div`
  width: 90vw;
  height: 90vh;
  overflow: auto;
  border-radius: 20px;
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
  background-image: radial-gradient(#000aff 1px, #eee 1px);
  background-size: 30px 30px;
  background-position: 2px 2px;
`;

const MyScrollableComponent = () => (
  <ScrollableContainer>
    <LargeContent>{/* Your content here */}</LargeContent>
  </ScrollableContainer>
);

export default MyScrollableComponent;
