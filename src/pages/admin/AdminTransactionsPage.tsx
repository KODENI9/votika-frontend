import { useState } from 'react';
import { useAdminTransactions } from '@/hooks/useAdmin';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { RefreshCw } from 'lucide-react';
import type { TransactionStatus } from '@/types';
import { format } from 'date-fns';

const STATUSES: { label: string; value: TransactionStatus | '' }[] = [
  { label: 'Tous', value: '' },
  { label: 'Success', value: 'success' },
  { label: 'Pending', value: 'pending' },
  { label: 'Failed', value: 'failed' },
  { label: 'Cancelled', value: 'cancelled' },
];

const METHOD_LABELS: Record<string, string> = {
  orange: 'Orange Money',
  wave: 'Wave',
  mtn: 'MTN Money',
  flooz: 'Flooz',
  mix_by_yas: 'Mix by Yas',
};

const statusColor: Record<string, string> = {
  success: 'bg-green-50 text-green-700 border-green-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  failed: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-gray-50 text-gray-600 border-gray-200',
};

export const AdminTransactionsPage = () => {
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | ''>('');
  const { data, isLoading, isError, refetch } = useAdminTransactions(
    statusFilter ? { status: statusFilter } : {}
  );

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Erreur lors du chargement des transactions." retry={() => refetch()} />;

  const transactions = data?.data || [];

  const formatDate = (ts: any) => {
    if (!ts) return '—';
    try {
      const date = ts.toDate ? ts.toDate() : new Date(ts._seconds * 1000);
      return format(date, 'dd/MM/yyyy HH:mm');
    } catch {
      return '—';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Historique de tous les paiements MoneyFusion</p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
          Actualiser
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {STATUSES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              statusFilter === value
                ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">{transactions.length} résultats</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">ID Transaction</th>
                <th className="px-6 py-4">Méthode</th>
                <th className="px-6 py-4">Montant (FCFA)</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4">Référence</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    Aucune transaction trouvée.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{tx.id.substring(0, 10)}...</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700">
                        {METHOD_LABELS[tx.paymentMethod] || tx.paymentMethod}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      {tx.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColor[tx.status] || 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-400">
                      {tx.moneyFusionRef?.substring(0, 16) || '—'}...
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(tx.createdAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
