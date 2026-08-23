import { useAuth } from '@clerk/clerk-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import type { Creator, Transaction, Settings } from '@/types';

export interface DashboardStats {
  totalRevenue: number;
  activeCreatorCount: number;
  totalVotes: number;
  trends7d: Record<string, number>;
}

export const useAdminDashboard = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: DashboardStats }>('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    }
  });
};

export const useAdminCreators = (params?: Record<string, any>) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['admin-creators', params],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: Creator[], count: number }>('/admin/creators', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });
};

export const useUpdateCreator = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<Creator> }) => {
      const token = await getToken();
      const { data } = await apiClient.patch<{ data: Creator }>(`/admin/creators/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-creators'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });
};

export const useDeleteCreator = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const token = await getToken();
      await apiClient.delete(`/admin/creators/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-creators'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
    }
  });
};

export const useAdminTransactions = (params?: Record<string, any>) => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['admin-transactions', params],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: Transaction[], count: number }>('/admin/transactions', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });
};

export const useAdminSettings = () => {
  const { getToken } = useAuth();

  return useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => {
      const token = await getToken();
      const { data } = await apiClient.get<{ data: Settings }>('/admin/settings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    }
  });
};

export const useUpdateAdminSettings = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<Settings>) => {
      const token = await getToken();
      const { data } = await apiClient.patch<{ data: Settings }>('/admin/settings', updates, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    }
  });
};
