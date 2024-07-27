import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { updateSettings, getSettings, Settings } from '../controllers/settings';

export const useSettings = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });
  const { mutate } = useMutation({
    mutationKey: ['settings'],
    mutationFn: (value: Partial<Settings>) => updateSettings(value),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });

  return [query, mutate] as const;
};
