import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';

import { updateResources, getAllResources } from '../controllers/resources';
import { ResourceState } from '../controllers/types';

export const useSetResources = (resourceVariant: string) => {
  const queryClient = useQueryClient();
  const gameId = useParams({
    from: '/game/$gameId',
    select: (params) => params?.gameId ?? 'test',
  });

  return useMutation({
    mutationKey: ['resources', { id: gameId }, resourceVariant],
    mutationFn: (value: Partial<ResourceState>) =>
      updateResources(value, resourceVariant, gameId),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ['resources', { id: gameId }],
      }),
  });
};

export const useGetAllResources = () => {
  const gameId = useParams({
    from: '/game/$gameId',
    select: (params) => params?.gameId ?? 'test',
  });

  return useQuery({
    queryKey: ['resources', { id: gameId }],
    queryFn: () => getAllResources(gameId),
  });
};
