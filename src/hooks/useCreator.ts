import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { apiClient } from '@/api/client';
import type { Creator } from '@/types';

export const useCreator = (id: string) => {
  return useQuery({
    queryKey: ['creator', id],
    queryFn: async () => {
      const { data } = await apiClient.get<{ data: Creator }>(`/creators/${id}`);
      return data.data;
    },
    enabled: !!id,
  });
};

export const useMyProfile = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['my-profile'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: Creator }>('/creators/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    }
  });
};

export const useMyStats = () => {
  const { getToken } = useAuth();
  return useQuery({
    queryKey: ['my-stats'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: { totalVotes: number; rank: number; lastVotes: any[] } }>('/creators/me/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    }
  });
};
