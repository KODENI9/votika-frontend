import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Settings } from '@/types';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data } = await apiClient.get<Settings>('/settings');
      return data;
    }
  });
};
