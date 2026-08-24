import { useState, useEffect } from 'react';
import { Copy, Check, Flame } from 'lucide-react';
import type { Creator } from '@/types';

interface CreatorShareWidgetProps {
  creator: Creator;
}

const calculateGoal = (current: number) => {
  const milestones = [1000, 5000, 10000, 25000, 50000, 100000, 250000, 500000, 1000000];
  for (const m of milestones) {
    if (current < m) return m;
  }
  // Fallback for very high numbers
  return Math.ceil((current + 1) / 500000) * 500000;
};

export const CreatorShareWidget = ({ creator }: CreatorShareWidgetProps) => {
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);

  const votes = creator.totalVotes ?? 0;
  const goal = calculateGoal(votes);
  const percentage = Math.min(100, Math.round((votes / goal) * 100));

  // Animate progress bar on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(percentage);
    }, 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-[#1c1c1c] rounded-2xl p-6 text-white relative shadow-lg overflow-hidden group">
      {/* Dynamic Background Glow */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-[var(--color-brand)]/10 to-transparent opacity-50 pointer-events-none transition-transform duration-1000 ease-in-out group-hover:scale-105"
        style={{ transformOrigin: 'left center' }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
          <h3 className="font-semibold text-gray-100">
            Aidez-moi à atteindre {goal.toLocaleString()} votes !
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className="text-gray-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
          title="Copier le lien"
        >
          {copied ? <Check className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
        </button>
      </div>

      {/* Progress Bar Container */}
      <div className="relative mb-3 z-10">
        {/* Track */}
        <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden backdrop-blur-sm relative">
          {/* Fill */}
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect inside the bar */}
            <div className="absolute top-0 inset-x-0 h-full bg-white/20 -skew-x-12 translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          </div>
        </div>
        
        {/* Floating Percentage Tag */}
        <div 
          className="absolute -top-7 text-xs font-bold bg-white text-black px-2 py-0.5 rounded shadow-sm transition-all duration-1000 ease-out"
          style={{ 
            left: `calc(${progress}% - 16px)`,
            opacity: progress > 0 ? 1 : 0
          }}
        >
          {percentage}%
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm relative z-10 mt-6">
        <div className="font-medium">
          <span className="text-white text-lg">{votes.toLocaleString()}</span>
          <span className="text-gray-400 mx-1">/</span>
          <span className="text-gray-400">{goal.toLocaleString()} votes</span>
        </div>
      </div>
    </div>
  );
};
