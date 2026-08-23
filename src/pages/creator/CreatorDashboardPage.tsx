import { useMyProfile, useMyStats } from '@/hooks/useCreator';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Trophy, TrendingUp, Vote, Star, ExternalLink, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CreatorDashboardPage = () => {
  const { data: profile, isLoading: profileLoading, isError: profileError } = useMyProfile();
  const { data: stats, isLoading: statsLoading, isError: statsError } = useMyStats();

  if (profileLoading || statsLoading) return <LoadingState />;
  if (profileError || statsError) return <ErrorState message="Impossible de charger votre espace créateur." />;
  
  if (!profile) return <ErrorState message="Profil introuvable." />;

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-[var(--color-brand)] bg-gray-100 shadow-md">
            <img 
              src={profile.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${profile.displayName}`}
              alt={profile.displayName}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{profile.displayName}</h1>
              {profile.status === 'active' && (
                <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
                  Actif
                </span>
              )}
            </div>
            <p className="text-[var(--color-brand)] font-medium mb-3">@{profile.tiktokHandle}</p>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{profile.category}</span>
              <span className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">{profile.country}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to={`/creator/${profile.id}`} 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Voir ma page publique
          </Link>
          <button className="flex items-center justify-center p-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <Vote className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total des Votes</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats?.totalVotes?.toLocaleString() || profile.totalVotes?.toLocaleString() || 0}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500">
              <Trophy className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Classement Actuel</p>
              <h3 className="text-3xl font-bold text-gray-900">
                {stats?.rank ? `#${stats.rank}` : '—'}
              </h3>
            </div>
          </div>
        </div>
        
        <div className="bg-[var(--color-brand)] p-6 rounded-3xl shadow-sm text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium opacity-80">Statut</p>
              <h3 className="text-2xl font-bold">
                {profile.status === 'active' ? 'En course' : profile.status}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Bio / Info */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Ma biographie
        </h2>
        <p className="text-gray-600 leading-relaxed max-w-3xl">
          {profile.bio || "Vous n'avez pas encore ajouté de biographie."}
        </p>
      </div>
    </div>
  );
};
