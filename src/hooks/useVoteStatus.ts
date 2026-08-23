import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { VoteStatusResponse } from '@/types';

export const useVoteStatus = (voteId: string, token: string | null) => {
  return useQuery({
    queryKey: ['voteStatus', voteId, token],
    queryFn: async () => {
      const { data } = await apiClient.get<VoteStatusResponse>(`/votes/${voteId}/status`, {
        params: { token }
      });
      return data;
    },
    enabled: !!voteId,
    refetchInterval: (query) => {
      // Keep polling every 3 seconds if status is PENDING
      if (query.state.data?.status === 'PENDING') {
        return 3000;
      }
      return false;
    }
  });
};
