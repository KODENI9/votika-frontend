import { Link } from 'react-router-dom';
import { MapPin, ThumbsUp, User } from 'lucide-react';
import type { Creator } from '@/types';
import { Button } from '@/components/common/Button';
import { cn } from '@/lib/utils';

const FALLBACK_AVATAR = 'https://ui-avatars.com/api/?background=e85d04&color=fff&size=256';

interface CreatorCardProps {
  creator: Creator;
  rank?: number;
  className?: string;
}

export const CreatorCard = ({ creator, rank, className }: CreatorCardProps) => {
  const avatarSrc = creator.avatarUrl
    ? creator.avatarUrl
    : `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.displayName)}`;

  return (
    <div
      className={cn(
        'bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col group',
        className
      )}
    >
      {/* Avatar Area */}
      <div className="relative bg-[#f5ede8] pt-4 px-4 flex justify-center">
        {rank !== undefined && (
          <div className="absolute top-3 left-3 bg-white rounded-full text-xs font-bold text-[var(--color-brand)] border border-[var(--color-brand)] px-2 py-0.5 shadow-sm">
            #{rank}
          </div>
        )}
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 text-[var(--color-brand)] rounded-full px-2.5 py-1 text-xs font-bold shadow-sm">
          <ThumbsUp className="h-3 w-3" />
          <span>{(creator.totalVotes ?? 0).toLocaleString()}</span>
        </div>
        <img
          src={avatarSrc}
          alt={creator.displayName}
          className="w-40 h-44 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.onerror = null;
            target.src = `${FALLBACK_AVATAR}&name=${encodeURIComponent(creator.displayName)}`;
          }}
        />
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-bold text-[var(--color-text)] text-base leading-tight">{creator.displayName}</h3>
        <div className="flex items-center gap-1 text-[var(--color-text-muted)] text-xs">
          <User className="h-3 w-3 shrink-0" />
          <span className="truncate">{creator.category}</span>
          {creator.country && (
            <>
              <span>·</span>
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{creator.country}</span>
            </>
          )}
        </div>
        {creator.bio && (
          <p className="text-[var(--color-text-muted)] text-xs line-clamp-2 flex-1">{creator.bio}</p>
        )}
        <Link to={`/creator/${creator.id}`} className="mt-2 hover:no-underline">
          <Button variant="primary" size="sm" className="w-full">
            Voter
          </Button>
        </Link>
      </div>
    </div>
  );
};
