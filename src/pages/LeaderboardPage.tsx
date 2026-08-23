import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Crown, ThumbsUp, TrendingUp, ChevronDown } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import type { Creator } from '@/types';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=e85d04&color=fff&size=128';

const PodiumCard = ({
  creator,
  rank,
}: {
  creator: Creator;
  rank: 1 | 2 | 3;
}) => {
  const configs = {
    1: {
      size: 'h-24 w-24',
      ring: 'ring-4 ring-[#FFD700]',
      label: 'bg-[#FFD700] text-black',
      order: 'order-2',
      nameSize: 'text-xl',
      crown: true,
    },
    2: {
      size: 'h-20 w-20',
      ring: 'ring-4 ring-gray-300',
      label: 'bg-gray-400 text-white',
      order: 'order-1',
      nameSize: 'text-base',
      crown: false,
    },
    3: {
      size: 'h-20 w-20',
      ring: 'ring-4 ring-[var(--color-brand)]',
      label: 'bg-[var(--color-brand)] text-white',
      order: 'order-3',
      nameSize: 'text-base',
      crown: false,
    },
  };

  const config = configs[rank];
  const avatarSrc = creator.avatarUrl || `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.name)}`;

  return (
    <Link
      to={`/creators/${creator.id}`}
      className={`${config.order} flex flex-col items-center text-center gap-2 hover:no-underline group`}
    >
      <div className="relative">
        {config.crown && (
          <Crown className="absolute -top-7 left-1/2 -translate-x-1/2 h-7 w-7 text-[#FFD700] fill-[#FFD700]" />
        )}
        <img
          src={avatarSrc}
          alt={creator.name}
          className={`${config.size} rounded-full object-cover ${config.ring} group-hover:scale-105 transition-transform duration-200`}
          onError={(e) => {
            const t = e.target as HTMLImageElement;
            t.src = `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.name)}`;
          }}
        />
        <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-extrabold px-2 py-0.5 rounded-full ${config.label}`}>
          #{rank} {rank === 1 ? 'Gagnant' : ''}
        </div>
      </div>
      <div className="mt-3">
        <p className={`font-extrabold text-[var(--color-text)] ${config.nameSize}`}>{creator.name}</p>
        <div className="flex items-center gap-1 justify-center text-[var(--color-text-muted)] text-sm mt-1">
          <ThumbsUp className="h-3.5 w-3.5" />
          <span className="font-semibold">{creator.voteCount.toLocaleString()}</span>
        </div>
      </div>
    </Link>
  );
};

export const LeaderboardPage = () => {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);
  const { data, isLoading, isError, refetch } = useLeaderboard();

  const allCreators = data?.leaderboard ?? [];
  const top3 = allCreators.slice(0, 3) as Creator[];
  const rest = allCreators.slice(3);

  const filtered = rest.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const visible = filtered.slice(0, visibleCount);

  return (
    <div className="bg-[var(--color-background)] min-h-screen">
      {/* Header section */}
      <section
        className="py-20 text-center px-4"
        style={{ background: 'linear-gradient(160deg, #fdf0e8 0%, #fff 60%)' }}
      >
        <div className="inline-flex items-center gap-2 text-[var(--color-brand)] text-xs font-bold uppercase tracking-wider bg-orange-100 rounded-full px-4 py-1.5 mb-4">
          🏆 Classement officiel
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-[var(--color-text)] mb-3">
          Célébrons les leaders
        </h1>
        <p className="text-[var(--color-text-muted)] max-w-md mx-auto">
          Les meilleurs créateurs du continent, classés par vos votes.
        </p>

        {/* Podium top 3 */}
        {isLoading ? (
          <LoadingState />
        ) : top3.length >= 3 ? (
          <div className="mt-16 flex items-end justify-center gap-10 sm:gap-16">
            <PodiumCard creator={top3[1]} rank={2} />
            <PodiumCard creator={top3[0]} rank={1} />
            <PodiumCard creator={top3[2]} rank={3} />
          </div>
        ) : null}
      </section>

      {/* Rest of leaderboard */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un candidat par nom..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] bg-white"
          />
        </div>

        {isError ? (
          <ErrorState retry={() => refetch()} />
        ) : (
          <>
            {/* Table header */}
            <div className="grid grid-cols-[60px_1fr_120px_100px] text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider px-4 mb-2">
              <span>Rang</span>
              <span>Candidat</span>
              <span>Tendance (24h)</span>
              <span className="text-right">Total votes</span>
            </div>

            <div className="flex flex-col gap-2">
              {visible.map((creator, idx) => {
                const rank = idx + 4; // starts from 4 (after top 3)
                return (
                  <Link
                    key={creator.id}
                    to={`/creators/${creator.id}`}
                    className="grid grid-cols-[60px_1fr_120px_100px] items-center bg-white rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition-shadow hover:no-underline group"
                  >
                    <span className="text-lg font-extrabold text-[var(--color-text-muted)]">{rank}</span>
                    <div className="flex items-center gap-3">
                      <img
                        src={creator.avatarUrl || `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.name)}`}
                        alt={creator.name}
                        className="h-10 w-10 rounded-full object-cover shrink-0"
                        onError={(e) => {
                          const t = e.target as HTMLImageElement;
                          t.src = `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.name)}`;
                        }}
                      />
                      <span className="font-bold text-[var(--color-text)] group-hover:text-[var(--color-brand)] transition-colors">
                        {creator.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                      <TrendingUp className="h-4 w-4" />
                      <span className="font-medium">+5%</span>
                    </div>
                    <span className="text-right font-extrabold text-[var(--color-text)]">
                      {creator.voteCount.toLocaleString()}
                    </span>
                  </Link>
                );
              })}
            </div>

            {visible.length < filtered.length && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setVisibleCount((c) => c + 10)}
                  className="gap-2"
                >
                  Afficher plus <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating vote button */}
      <Link
        to="/"
        className="fixed bottom-6 right-6 flex items-center gap-2 bg-[var(--color-brand)] text-white font-bold rounded-full px-5 py-3 shadow-lg hover:bg-[var(--color-brand-hover)] transition-colors hover:no-underline z-50"
      >
        <ThumbsUp className="h-4 w-4" />
        Voter
      </Link>
    </div>
  );
};
