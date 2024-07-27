import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { updateResources, getAllResources } from '../controllers/resources';
import { ResourceState } from '../controllers/types';
import { useParams } from 'react-router-dom';

export const useSetResources = (resourceVariant: string) => {
  const queryClient = useQueryClient();
  const { gameId = 'test' } = useParams<{ gameId: string }>();

  return useMutation({
    mutationKey: ['resources', { id: gameId }, resourceVariant],
    mutationFn: (value: Partial<ResourceState>) => updateResources(value, resourceVariant, gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources', { id: gameId }] }),
  });
};

export const useGetAllResources = () => {
  const { gameId = 'test' } = useParams<{ gameId: string }>();

  return useQuery({
    queryKey: ['resources', { id: gameId }],
    queryFn: () => getAllResources(gameId),
  });
};
