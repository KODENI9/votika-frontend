import { useMutation } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { VoteResponse } from '@/types';

interface SubmitVotePayload {
  creatorId: string;
  voteCount: number;
  voterName?: string;
  voterPhone: string;
  paymentMethod: 'orange' | 'wave' | 'mtn' | 'flooz' | 'mix_by_yas';
}

export const useSubmitVote = () => {
  return useMutation({
    mutationFn: async (payload: SubmitVotePayload) => {
      const { data } = await apiClient.post<VoteResponse>('/votes', payload);
      return data;
    }
  });
};
