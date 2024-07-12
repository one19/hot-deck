import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { updateSettings, getSettings } from '../controllers/settings';
import { ResourceState } from '../controllers/types';

export const useSettings = (resourceVariant: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: () => getSettings(),
  });
  const mutation = useMutation({
    mutationKey: ['resources', resourceVariant],
    mutationFn: (value: Partial<ResourceState>) => updateSettings(value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  return [query, mutation];
};
