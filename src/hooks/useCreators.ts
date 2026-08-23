import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Creator } from '@/types';

export const useCreators = (params?: { category?: string; country?: string; search?: string }) => {
  return useQuery({
    queryKey: ['creators', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ creators: Creator[], total: number }>('/creators', { params });
      return data;
    }
  });
};
