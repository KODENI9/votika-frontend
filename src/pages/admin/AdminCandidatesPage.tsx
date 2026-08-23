import { useState } from 'react';
import { CandidatesTable } from '@/components/admin/CandidatesTable';
import { AddCandidateModal } from '@/components/admin/AddCandidateModal';
import { Button } from '@/components/common/Button';
import { Plus, Download } from 'lucide-react';
import { useAdminCreators } from '@/hooks/useAdmin';
import { format } from 'date-fns';
import type { Creator } from '@/types';

export const AdminCandidatesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: creatorsData } = useAdminCreators();

  const handleExportReport = () => {
    const creators: Creator[] = creatorsData?.data || [];
    const headers = ['Nom', 'TikTok Handle', 'Catégorie', 'Pays', 'Total Votes', 'Revenu (FCFA)', 'Statut'];
    const rows = creators.map(c => [
      c.displayName,
      c.tiktokHandle,
      c.category,
      c.country,
      c.totalVotes,
      (c.totalVotes || 0) * 200,
      c.status,
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `votika-candidates-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidates</h1>
          <p className="text-sm text-gray-500 mt-1">Gérez tous les candidats de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="primary"
            className="gap-2 shadow-sm"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Candidate
          </Button>
        </div>
      </div>

      {/* Candidates Table */}
      <CandidatesTable />

      {/* Add Candidate Modal */}
      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};
