import { useState, useCallback } from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useCreators } from '@/hooks/useCreators';
import { CreatorCard } from '@/components/creator/CreatorCard';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/common/Button';

const CATEGORIES = ['Tous', 'Musique', 'Art', 'Tech', 'Sport', 'Mode', 'Cuisine', 'Humour'];

export const HomePage = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  const queryParams = {
    search: search || undefined,
    category: selectedCategory || undefined,
  };

  const { data, isLoading, isError, refetch } = useCreators(queryParams);
  const creators = data?.creators ?? [];

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(0);
  }, []);

  const handleCategory = useCallback((cat: string) => {
    setSelectedCategory(cat === 'Tous' ? '' : cat);
    setPage(0);
  }, []);

  const visibleCreators = creators.slice(0, (page + 1) * PAGE_SIZE);

  return (
    <div className="bg-[var(--color-background)]">
      {/* Hero */}
      <section
        className="relative min-h-[520px] flex items-center justify-center text-white text-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #9d0208 0%, #e85d04 50%, #ffba08 100%)',
        }}
      >
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />
        </div>

        <div className="relative z-10 px-4 max-w-3xl mx-auto py-20">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            VOTE EN COURS
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Vote pour ton{' '}
            <span className="text-[#ffba08]">créateur</span>{' '}
            TikTok préféré
          </h1>
          <p className="text-lg sm:text-xl text-white/85 mb-10 max-w-2xl mx-auto">
            Soutiens tes influenceurs préférés via Mobile Money. Chaque vote compte !
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="#creators"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-[var(--color-brand)] font-bold rounded-full hover:bg-orange-50 transition-colors hover:no-underline text-base shadow-lg"
            >
              Voir les créateurs
            </a>
            <a
              href="/leaderboard"
              className="inline-flex items-center justify-center h-12 px-8 bg-white/15 backdrop-blur-sm text-white font-bold rounded-full hover:bg-white/25 transition-colors border border-white/30 hover:no-underline text-base"
            >
              Classement
            </a>
          </div>
        </div>
      </section>

      {/* Search + Filters */}
      <div id="creators" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center bg-white rounded-2xl shadow-sm p-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Rechercher par nom, pays ou catégorie..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = (cat === 'Tous' && !selectedCategory) || cat === selectedCategory;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors whitespace-nowrap
                    ${isActive
                      ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]'
                      : 'bg-white text-[var(--color-text-muted)] border-gray-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-[var(--color-text)]">
            Créateurs tendances
          </h2>
          {data?.total !== undefined && (
            <span className="text-sm text-[var(--color-text-muted)]">
              {data.total} créateur{data.total > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {isLoading ? (
          <LoadingState message="Chargement des créateurs..." />
        ) : isError ? (
          <ErrorState
            message="Impossible de charger les créateurs. Vérifiez votre connexion."
            retry={() => refetch()}
          />
        ) : creators.length === 0 ? (
          <EmptyState
            title="Aucun créateur trouvé"
            description="Essayez d'autres termes de recherche ou catégories."
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 lg:gap-5">
              {visibleCreators.map((creator, idx) => (
                <CreatorCard key={creator.id} creator={creator} rank={idx + 1} />
              ))}
            </div>

            {visibleCreators.length < creators.length && (
              <div className="mt-10 text-center">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => setPage((p) => p + 1)}
                  className="gap-2"
                >
                  Charger plus
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Newsletter CTA */}
      <section className="bg-[#1c1917] text-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-4xl mb-4">📢</div>
          <h2 className="text-2xl font-extrabold mb-3">Ne ratez pas les résultats finaux</h2>
          <p className="text-gray-400 mb-8">
            Abonnez-vous pour suivre les évolutions du classement en temps réel.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors text-sm whitespace-nowrap"
            >
              S'abonner
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
