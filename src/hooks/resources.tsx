import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { GameIdContext } from '../providers/GameId';
import { updateResources, getAllResources } from '../controllers/resources';
import { ResourceState } from '../controllers/types';

export const useSetResources = (resourceVariant: string) => {
  const queryClient = useQueryClient();
  const gameId = useContext(GameIdContext);

  return useMutation({
    mutationKey: ['resources', resourceVariant],
    mutationFn: (value: Partial<ResourceState>) => updateResources(value, resourceVariant, gameId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['resources'] }),
  });
};

export const useGetAllResources = () => {
  const gameId = useContext(GameIdContext);

  return useQuery({
    queryKey: ['resources'],
    queryFn: () => getAllResources(gameId),
  });
};
