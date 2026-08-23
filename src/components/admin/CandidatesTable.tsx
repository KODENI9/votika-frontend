import { useState } from 'react';
import { Search, Filter, Edit2, Trash2 } from 'lucide-react';
import { useAdminCreators, useUpdateCreator, useDeleteCreator } from '@/hooks/useAdmin';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

export const CandidatesTable = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError, refetch } = useAdminCreators({ search });
  const updateCreator = useUpdateCreator();
  const deleteCreator = useDeleteCreator();

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Erreur lors du chargement des candidats." onRetry={() => refetch()} />;

  const creators = data?.data || [];

  const handleStatusToggle = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateCreator.mutate({ id, updates: { status: newStatus as any } });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce candidat ?")) {
      deleteCreator.mutate(id);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header / Toolbar */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">Candidates List</h2>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search candidates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent w-full sm:w-64 bg-gray-50/50"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Candidate Name</th>
              <th className="px-6 py-4">Total Votes</th>
              <th className="px-6 py-4">Revenue (FCFA)</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {creators.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Aucun candidat trouvé.
                </td>
              </tr>
            ) : (
              creators.map((creator) => (
                <tr key={creator.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={creator.avatarUrl || `https://ui-avatars.com/api/?background=e85d04&color=fff&size=80&name=${encodeURIComponent(creator.displayName)}`} 
                        alt={creator.displayName} 
                        className="h-10 w-10 rounded-full object-cover border border-gray-200 flex-shrink-0"
                        onError={(e) => {
                          const target = e.currentTarget;
                          target.onerror = null; // évite boucle infinie
                          target.src = `https://ui-avatars.com/api/?background=e85d04&color=fff&size=80&name=${encodeURIComponent(creator.displayName)}`;
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-900">{creator.displayName}</div>
                        <div className="text-xs text-gray-500">ID: #{creator.id.substring(0, 8)}</div>
                      </div>
                    </div>

                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {creator.totalVotes?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {/* Assuming 200 FCFA per vote for now, or fetch from backend settings later */}
                    {((creator.totalVotes || 0) * 200).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span 
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border cursor-pointer hover:opacity-80 transition-opacity ${
                        creator.status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : creator.status === 'pending'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : creator.status === 'paused'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-gray-50 text-gray-700 border-gray-200'
                      }`}
                      onClick={() => handleStatusToggle(creator.id, creator.status)}
                      title="Cliquez pour changer le statut"
                    >
                      {creator.status.charAt(0).toUpperCase() + creator.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-brand)] bg-white rounded shadow-sm border border-gray-100 transition-colors">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-red-500 bg-white rounded shadow-sm border border-gray-100 transition-colors"
                        onClick={() => handleDelete(creator.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
