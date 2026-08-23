import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Creator } from '@/types';

export const useLeaderboard = (params?: { page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: async () => {
      const { data } = await apiClient.get<{ leaderboard: Creator[], total: number }>('/leaderboard', { params });
      return data;
    }
  });
};
