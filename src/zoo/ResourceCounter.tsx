import styled from '@emotion/styled';

import { useGetAllResources } from '../hooks/resources';
import { getBackground } from '../cards/variants';

const Wrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  padding: 10px;
  background: #fff;
`;

const VariantWrapper = styled.div<{ variant: string }>`
  ${getBackground};
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
            <div key={`counter-${variant.id}-${key}`}>
              {key}: {value}
            </div>
          ))}
        </VariantWrapper>
      ))}
    </Wrapper>
  );
};

export default ResourceCounter;
