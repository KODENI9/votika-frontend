import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowLeft, Home } from 'lucide-react';
import { useVoteStatus } from '@/hooks/useVoteStatus';
import { LoadingState } from '@/components/common/LoadingState';
import { Button } from '@/components/common/Button';

export const VoteConfirmationPage = () => {
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token');
  const voteId = sessionStorage.getItem('pendingVoteId') ?? '';
  const creatorId = sessionStorage.getItem('pendingCreatorId') ?? '';
  const creatorName = sessionStorage.getItem('pendingCreatorName') ?? 'ce créateur';

  const { data, isLoading } = useVoteStatus(voteId, token);

  // Clear session storage after successful payment
  useEffect(() => {
    if (data?.status === 'SUCCESS') {
      sessionStorage.removeItem('pendingVoteId');
      sessionStorage.removeItem('pendingCreatorId');
      sessionStorage.removeItem('pendingCreatorName');
    }
  }, [data?.status]);

  if (!voteId && !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-extrabold mb-2">Lien invalide</h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            Cette page n'est accessible qu'après un paiement.
          </p>
          <Link to="/">
            <Button variant="primary">Retour à l'accueil</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4">
        <div className="bg-white rounded-2xl shadow-md p-10 max-w-md w-full text-center">
          <LoadingState message="Vérification du paiement en cours..." />
          <p className="text-xs text-[var(--color-text-muted)] mt-4">
            Cela peut prendre quelques secondes.
          </p>
        </div>
      </div>
    );
  }

  const statusConfig = {
    SUCCESS: {
      icon: <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-4" />,
      title: '🎉 Vote confirmé !',
      bg: 'bg-green-50',
      borderColor: 'border-green-200',
      titleColor: 'text-green-700',
      message: `Merci ! Vos ${data.votesAdded ?? '?'} votes pour ${creatorName} ont bien été enregistrés.`,
    },
    FAILED: {
      icon: <XCircle className="h-20 w-20 text-red-500 mx-auto mb-4" />,
      title: 'Paiement échoué',
      bg: 'bg-red-50',
      borderColor: 'border-red-200',
      titleColor: 'text-red-700',
      message: 'Votre paiement n\'a pas abouti. Aucun vote n\'a été déduit. Veuillez réessayer.',
    },
    PENDING: {
      icon: <Clock className="h-20 w-20 text-yellow-500 mx-auto mb-4 animate-pulse" />,
      title: 'En attente de confirmation',
      bg: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      titleColor: 'text-yellow-700',
      message: 'Votre paiement est en cours de traitement. La page se met à jour automatiquement.',
    },
  };

  const config = statusConfig[data.status];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-4 py-16">
      <div className="max-w-md w-full">
        <div className={`bg-white rounded-2xl shadow-md p-8 text-center border-2 ${config.borderColor}`}>
          {config.icon}
          <h1 className={`text-2xl font-extrabold mb-3 ${config.titleColor}`}>{config.title}</h1>
          <p className="text-[var(--color-text-muted)] leading-relaxed mb-8">{config.message}</p>

          <div className="flex flex-col gap-3">
            {creatorId && (
              <Link to={`/creator/${creatorId}`}>
                <Button variant="primary" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Retour au profil de {creatorName}
                </Button>
              </Link>
            )}
            <Link to="/">
              <Button variant="ghost" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Aller à l'accueil
              </Button>
            </Link>
          </div>
        </div>

        {data.status === 'PENDING' && (
          <p className="text-center text-xs text-[var(--color-text-muted)] mt-4">
            ⟳ Vérification automatique toutes les 3 secondes…
          </p>
        )}
      </div>
    </div>
  );
};
