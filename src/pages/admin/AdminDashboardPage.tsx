import { useRef, useState } from 'react';
import { useAdminDashboard } from '@/hooks/useAdmin';
import { useAdminCreators } from '@/hooks/useAdmin';
import { StatCard } from '@/components/admin/StatCard';
import { CandidatesTable } from '@/components/admin/CandidatesTable';
import { AddCandidateModal } from '@/components/admin/AddCandidateModal';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { DollarSign, Vote, Users, Plus, Download, CheckCircle2, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import type { Creator } from '@/types';

export const AdminDashboardPage = () => {
  const { data: stats, isLoading, isError, refetch } = useAdminDashboard();
  const { data: creatorsData } = useAdminCreators();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tableRef = useRef<HTMLDivElement>(null);

  if (isLoading) return <LoadingState />;
  if (isError || !stats) return <ErrorState message="Erreur lors du chargement du dashboard." retry={() => refetch()} />;

  // Format chart data
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = format(date, 'yyyy-MM-dd');
    return {
      name: format(date, 'EEE'),
      revenue: stats.trends7d[dateStr] || 0
    };
  });

  // Export Report as CSV
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
    a.download = `votika-report-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleScrollToTable = () => {
    tableRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="gap-2 bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4" />
            Export Report
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

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Revenue (FCFA)"
          value={stats.totalRevenue.toLocaleString()}
          icon={DollarSign}
          trend={{ value: 12, label: 'Compared to last month' }}
          subtitle="Compared to last month"
        />
        <StatCard
          title="Total Votes"
          value={stats.totalVotes.toLocaleString()}
          icon={Vote}
          trend={{ value: 5, label: 'Daily average' }}
          subtitle={`Daily average: ${Math.round(stats.totalVotes / 30).toLocaleString()}`}
        />
        <StatCard
          title="Active Candidates"
          value={stats.activeCreatorCount.toLocaleString()}
          icon={Users}
          trend={{ value: 0, label: '' }}
          subtitle="En attente d'approbation"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Voting Trends</h2>
              <p className="text-sm text-gray-500">Last 7 Days (Revenue)</p>
            </div>
            <select className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm bg-gray-50 text-gray-700 outline-none focus:ring-2 focus:ring-[var(--color-brand)]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F37A20" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F37A20" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9ca3af', fontSize: 12 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [`${value.toLocaleString()} FCFA`, 'Revenue']}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#F37A20"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity Sidebar */}
        <div className="bg-[#2D241C] rounded-2xl shadow-sm border border-[#3D342C] p-6 text-white flex flex-col">
          <h2 className="text-lg font-bold mb-6">Recent Activity</h2>

          <div className="space-y-6 flex-1">
            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
                <Plus className="h-4 w-4 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-medium">New Candidate Added</p>
                <p className="text-xs text-white/50 mt-0.5">2 mins ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <TrendingUp className="h-4 w-4 text-green-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Vote Surge Detected</p>
                <p className="text-xs text-white/50 mt-0.5">1 hour ago</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4 text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-medium">System Check Complete</p>
                <p className="text-xs text-white/50 mt-0.5">5 hours ago</p>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-6 bg-[#E87B25] hover:bg-[#D56A15] border-none"
            onClick={handleScrollToTable}
          >
            View All Logs
          </Button>
        </div>
      </div>

      {/* Candidates List */}
      <div ref={tableRef}>
        <CandidatesTable />
      </div>

      {/* Add Candidate Modal */}
      <AddCandidateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

