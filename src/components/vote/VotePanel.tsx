import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Minus, Plus, Lock, Loader2 } from 'lucide-react';
import type { Creator } from '@/types';
import { useSettings } from '@/hooks/useSettings';
import { useSubmitVote } from '@/hooks/useSubmitVote';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import type { PaymentMethod } from './PaymentMethodSelector';
import { Button } from '@/components/common/Button';

const PHONE_REGEX = /^[0-9]{8,15}$/;

interface VotePanelProps {
  creator: Creator;
}

export const VotePanel = ({ creator }: VotePanelProps) => {
  const navigate = useNavigate();
  const { data: settings } = useSettings();
  const { mutateAsync: submitVote, isPending } = useSubmitVote();

  const unitPrice = settings?.voteUnitPrice ?? 200;

  const [voteCount, setVoteCount] = useState(5);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [voterPhone, setVoterPhone] = useState('');
  const [voterName, setVoterName] = useState('');
  const [errors, setErrors] = useState<{ phone?: string; method?: string; general?: string }>({});

  const totalAmount = voteCount * unitPrice;

  const handleDecrement = () => setVoteCount((c) => Math.max(1, c - 1));
  const handleIncrement = () => setVoteCount((c) => c + 1);

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!voterPhone || !PHONE_REGEX.test(voterPhone)) {
      newErrors.phone = 'Numéro de téléphone invalide (ex: 22890000000)';
    }
    if (!paymentMethod) {
      newErrors.method = 'Sélectionnez un moyen de paiement';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !paymentMethod) return;

    try {
      const response = await submitVote({
        creatorId: creator.id,
        voteCount,
        voterPhone,
        voterName: voterName.trim() || undefined,
        paymentMethod,
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
            disabled={voteCount <= 1}
            aria-label="Diminuer"
            className="h-10 w-10 rounded-full border-2 border-gray-200 flex items-center justify-center text-[var(--color-text-muted)] hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="text-3xl font-bold text-[var(--color-text)] w-10 text-center">{voteCount}</span>
          <button
            type="button"
            onClick={handleIncrement}
            aria-label="Augmenter"
            className="h-10 w-10 rounded-full bg-[var(--color-brand)] flex items-center justify-center text-white hover:bg-[var(--color-brand-hover)] transition-colors"
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

      {/* Payment method */}
      <div>
        <label className="text-sm font-semibold text-[var(--color-text)] block mb-3">
          Moyen de paiement
        </label>
        <PaymentMethodSelector
          value={paymentMethod}
          onChange={setPaymentMethod}
          error={errors.method}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="voterPhone" className="text-sm font-semibold text-[var(--color-text)] block mb-2">
          Numéro de téléphone <span className="text-red-500">*</span>
        </label>
        <input
          id="voterPhone"
          type="tel"
          value={voterPhone}
          onChange={(e) => setVoterPhone(e.target.value.replace(/\D/g, ''))}
          placeholder="ex: 22890000000"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
        />
        {errors.phone && <p className="mt-1.5 text-xs text-red-500">{errors.phone}</p>}
      </div>

      {/* Name (optional) */}
      <div>
        <label htmlFor="voterName" className="text-sm font-semibold text-[var(--color-text)] block mb-2">
          Votre nom <span className="text-[var(--color-text-muted)] font-normal">(optionnel)</span>
        </label>
        <input
          id="voterName"
          type="text"
          value={voterName}
          onChange={(e) => setVoterName(e.target.value)}
          placeholder="ex: Moussa Diallo"
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
        />
      </div>

      {errors.general && (
        <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3">
          {errors.general}
        </div>
      )}

      {/* Submit */}
      <Button type="submit" variant="primary" size="lg" isLoading={isPending} className="w-full">
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Traitement...
          </>
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
