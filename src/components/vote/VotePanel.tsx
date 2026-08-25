import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Lock, Loader2 } from 'lucide-react';
import type { Creator } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { useSubmitVote } from '@/hooks/useSubmitVote';
import { Button } from '@/components/common/Button';

interface VotePanelProps {
  creator: Creator;
}

export const VotePanel = ({ creator }: VotePanelProps) => {
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const { mutateAsync: submitVote, isPending } = useSubmitVote();

  const unitPrice = settings?.voteUnitPrice ?? 200;

  const [voteCount, setVoteCount] = useState(5);
  const [errors, setErrors] = useState<{ general?: string }>({});

  const totalAmount = voteCount * unitPrice;

  const handleDecrement = () => setVoteCount((c) => Math.max(1, c - 1));
  const handleIncrement = () => setVoteCount((c) => c + 1);



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await submitVote({
        creatorId: creator.id,
        voteCount,
      });

      // Store voteId in sessionStorage for the confirmation page
      sessionStorage.setItem('pendingVoteId', response.voteId);
      sessionStorage.setItem('pendingCreatorId', creator.id);
      sessionStorage.setItem('pendingCreatorName', creator.displayName);

      if (response.paymentUrl) {
        // Redirect to MoneyFusion payment page
        window.location.href = response.paymentUrl;
      } else {
        // Direct USSD push, go straight to confirmation page
        navigate('/vote/confirm');
      }
    } catch {
      setErrors({ general: 'Erreur lors de l\'initiation du paiement. Veuillez réessayer.' });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-6"
    >
      <div>
        <h2 className="text-xl font-bold text-[var(--color-text)]">Soutenir ce créateur</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Votre contribution a un impact direct.</p>
      </div>

      {/* Vote count */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-[var(--color-text)]">Nombre de votes</label>
          <span className="text-xs text-[var(--color-brand)] font-medium bg-orange-50 px-2 py-0.5 rounded-full">
            1 Vote = {unitPrice.toLocaleString()} FCFA
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleDecrement}
            disabled={voteCount <= 1 || (settings && !settings.campaignActive)}
            aria-label="Diminuer"
            className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-3xl font-bold text-[var(--color-text)] w-10 text-center">{voteCount}</span>
          <button
            type="button"
            onClick={handleIncrement}
            disabled={settings && !settings.campaignActive}
            aria-label="Augmenter"
            className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white hover:bg-[var(--color-brand-hover)] disabled:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
        <span className="text-sm font-medium text-[var(--color-text-muted)]">Montant total</span>
        <span className="text-xl font-extrabold text-[var(--color-brand)]">
          {totalAmount.toLocaleString()} FCFA
        </span>
      </div>

      {errors.general && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {errors.general}
        </div>
      )}

      {/* Submit */}
      <Button 
        type="submit" 
        variant="primary" 
        size="lg" 
        isLoading={isPending} 
        disabled={isPending || (settings && !settings.campaignActive)} 
        className="w-full"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
        ) : settings && !settings.campaignActive ? (
          <>Votes fermés</>
        ) : (
          <>Payer &amp; Valider le vote →</>
        )}
      </Button>

      <p className="text-xs text-[var(--color-text-muted)] text-center flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" />
        Les paiements sont sécurisés et chiffrés
      </p>
    </form>
  );
};
