import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { MapPin, Activity, TrendingUp } from 'lucide-react';
import { useCreator } from '@/hooks/useCreator';
import { useVoteStatus } from '@/hooks/useVoteStatus';
import { VotePanel } from '@/components/vote/VotePanel';
import { CreatorShareWidget } from '@/components/creator/CreatorShareWidget';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=e85d04&color=fff&size=512';

export const CreatorPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const verifyVoteId = searchParams.get('verifyVote');
  const token = searchParams.get('token');

  const { data: creator, isLoading, isError, refetch } = useCreator(id ?? '');
  const { data: voteData } = useVoteStatus(verifyVoteId ?? '', token);

  // Poll for vote confirmation when returning from MoneyFusion
  useEffect(() => {
    if (voteData?.status === 'SUCCESS') {
      alert(`🎉 Paiement réussi ! Les votes ont été ajoutés à ${creator?.displayName || 'ce créateur'}.`);
      refetch(); // Update votes
      searchParams.delete('verifyVote');
      searchParams.delete('token');
      setSearchParams(searchParams);
    } else if (voteData?.status === 'FAILED') {
      alert(`Le paiement a échoué. Aucun vote n'a été déduit.`);
      searchParams.delete('verifyVote');
      searchParams.delete('token');
      setSearchParams(searchParams);
    }
  }, [voteData?.status, creator?.displayName, refetch, searchParams, setSearchParams]);

  if (isLoading) return <LoadingState message="Chargement du profil..." />;
  if (isError || !creator) return (
    <ErrorState
      message="Impossible de charger ce profil créateur."
      retry={() => refetch()}
    />
  );

  const avatarSrc = creator.avatarUrl
    ? creator.avatarUrl
    : `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.displayName)}`;

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      {/* Loading overlay for pending votes */}
      {voteData?.status === 'PENDING' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center max-w-sm w-full mx-4">
            <LoadingState message="Vérification de votre paiement en cours..." />
            <p className="text-xs text-center text-gray-500 mt-4">Veuillez patienter, cette fenêtre se fermera automatiquement.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)] mb-6">
          <Link to="/" className="hover:text-[var(--color-brand)] transition-colors hover:no-underline">Accueil</Link>
          <span>/</span>
          <span className="text-[var(--color-text)] font-medium">{creator.displayName}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left — Creator Profile */}
          <div className="flex flex-col gap-6">
            {/* Portrait card */}
            <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#f5ede8] to-[#e8d5cc] min-h-[460px] flex flex-col justify-end shadow-md">
              <img
                src={avatarSrc}
                alt={creator.displayName}
                className="absolute inset-0 w-full h-full object-cover object-top"
                onError={(e) => {
                  const t = e.target as HTMLImageElement;
                  t.onerror = null;
                  t.src = `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.displayName)}`;
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              {/* Info overlay */}
              <div className="relative z-10 p-6 text-white">
                <div className="inline-flex items-center gap-1.5 bg-[var(--color-brand)] rounded-full px-3 py-1 text-xs font-bold mb-3">
                  🌍 {creator.category}
                </div>
                <h1 className="text-3xl font-extrabold leading-tight mb-1">{creator.displayName}</h1>
                {creator.bio && (
                  <p className="text-white/80 text-sm italic mb-2">"{creator.bio.substring(0, 80)}..."</p>
                )}
                <div className="flex items-center gap-1 text-white/70 text-sm">
                  <MapPin className="h-3.5 w-3.5 shrink-0" />
                  <span>{creator.country}</span>
                </div>
              </div>
            </div>

            {/* Share Widget */}
            <CreatorShareWidget creator={creator} />

            {/* About */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold mb-3">À propos du créateur</h2>
              <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">
                {creator.bio ?? 'Aucune biographie disponible.'}
              </p>
              <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-green-500" />
                  <span className="font-semibold text-green-600">
                    {creator.status === 'active' ? 'Candidat actif' : 'Inactif'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-[var(--color-brand)]" />
                  <span className="font-semibold text-[var(--color-text)]">
                    {(creator.totalVotes ?? 0).toLocaleString()} votes
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Vote Panel (sticky on desktop) */}
          <div className="lg:sticky lg:top-24">
            <VotePanel creator={creator} />
          </div>
        </div>
      </div>
    </div>
  );
};
