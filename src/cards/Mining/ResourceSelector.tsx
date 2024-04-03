import styled from '@emotion/styled';
import { Title, Image } from '../../zoo/Styled';

const ResourceSelectionWrapper = styled.div`
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  grid-area: play-area;
  justify-content: center;
  z-index: calc(var(--z-index-map) + 1);
`;

const Resources = styled.div`
  background: #3333;
  border: 3px solid #1111;
  margin-top: 5px;
  border-radius: 5px;
  display: inline-flex;
  justify-content: space-around;
`;

const ResourceBlock = styled.div`
  border: 3px solid #1111;
  display: flex;
  width: 100%;
  padding: 5px 0;
  flex-direction: column;
  align-items: center;
  &:hover {
    background: #2f22;
    border-color: #3f33;
  }
`;

const ResourceSelector = ({
  resources,
  hoveredResourceRef,
}: {
  resources: { name: string; image: string }[];
  hoveredResourceRef: React.MutableRefObject<string | null>;
}) => {
  return (
    <ResourceSelectionWrapper>
      <Title>Select a resource</Title>
      <Resources>
        {resources.map((r) => (
          <ResourceBlock
            key={`selector-${r.name}`}
            id={`selector-${r.name}`}
            onMouseEnter={() => {
              hoveredResourceRef.current = r.name;
            }}
            onMouseLeave={() => {
              hoveredResourceRef.current = null;
            }}
          >
            <Image src={r.image} alt={`select ${r.name}`} />
            <Title>{r.name}</Title>
          </ResourceBlock>
        ))}
      </Resources>
    </ResourceSelectionWrapper>
  );
};

export default ResourceSelector;
