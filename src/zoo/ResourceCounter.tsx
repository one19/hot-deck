import styled from '@emotion/styled';

import { useGetAllResources } from '../hooks/resources';
import { getBackground } from '../cards/variants';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  user-select: none;
`;

const VariantWrapper = styled.div<{ variant: string }>`
  ${getBackground};
  margin: 0.5em;
  border-radius: 0.5em;
  padding: 0.5em;
`;

const Resource = styled.div`
  display: flex;
  justify-content: space-between;
  div:first-of-type {
    margin-right: 0.5em;
  }
`;

const ResourceCounter = () => {
  const { data: resourceVariants, isLoading, isError } = useGetAllResources();

  if (!resourceVariants) return null;

  if (isLoading) return ':spinner:';
  if (isError) return ':error:';

  return (
    <Wrapper>
      {resourceVariants.map((variant) => (
        <VariantWrapper key={`counter-${variant.id}`} variant={variant.id}>
          {Object.entries(variant.state).map(([key, value]) => (
            <Resource key={`counter-${variant.id}-${key}`}>
              <div>{key}</div>
              <div>{value}</div>
            </Resource>
          ))}
        </VariantWrapper>
      ))}
    </Wrapper>
  );
};

export default ResourceCounter;
