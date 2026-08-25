import { useState, useEffect } from 'react';
import { useAdminSettings, useUpdateAdminSettings } from '@/hooks/useAdmin';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { Button } from '@/components/common/Button';
import { Settings, Save, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const AdminSettingsPage = () => {
  const { data: settings, isLoading, isError, refetch } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  
  const [form, setForm] = useState({
    voteUnitPrice: 0,
    campaignActive: false,
    campaignStartDate: '',
    campaignEndDate: '',
  });

  const isExpired = form.campaignEndDate ? new Date() > new Date(form.campaignEndDate) : false;

  useEffect(() => {
    if (settings) {
      setForm({
        voteUnitPrice: settings.voteUnitPrice || 200,
        campaignActive: settings.campaignActive || false,
        campaignStartDate: settings.campaignStartDate ? format(new Date(settings.campaignStartDate), "yyyy-MM-dd'T'HH:mm") : '',
        campaignEndDate: settings.campaignEndDate ? format(new Date(settings.campaignEndDate), "yyyy-MM-dd'T'HH:mm") : '',
      });
    }
  }, [settings]);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState message="Erreur lors du chargement des paramètres." retry={() => refetch()} />;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings.mutate({
      voteUnitPrice: Number(form.voteUnitPrice),
      campaignActive: form.campaignActive,
      campaignStartDate: form.campaignStartDate ? new Date(form.campaignStartDate).toISOString() : null,
      campaignEndDate: form.campaignEndDate ? new Date(form.campaignEndDate).toISOString() : null,
    } as any); // using any for null dates
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-gray-100 rounded-xl">
          <Settings className="h-6 w-6 text-gray-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Généraux</h1>
          <p className="text-sm text-gray-500">Gérez la campagne de vote et la tarification</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Section: Vote Config */}
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration des Votes</h2>
          <div className="max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Prix unitaire d'un vote (FCFA)
            </label>
            <div className="relative">
              <input
                type="number"
                name="voteUnitPrice"
                value={form.voteUnitPrice}
                onChange={(e) => setForm(prev => ({ ...prev, voteUnitPrice: Number(e.target.value) }))}
                className="w-full pl-4 pr-12 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">FCFA</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              C'est le montant qui sera facturé aux utilisateurs pour chaque vote.
            </p>
          </div>
        </div>

        {/* Section: Campaign Config */}
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Statut de la Campagne</h2>
          
          <div className="space-y-6 max-w-xl">
            {/* Toggle */}
            <label className={cn(
              "flex items-center p-4 border border-gray-200 rounded-xl transition-colors",
              isExpired ? "opacity-50 cursor-not-allowed bg-gray-50" : "cursor-pointer hover:bg-gray-50"
            )}>
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={form.campaignActive && !isExpired}
                  disabled={isExpired}
                  onChange={(e) => setForm(prev => ({ ...prev, campaignActive: e.target.checked }))}
                />
                <div className={`block w-14 h-8 rounded-full transition-colors ${form.campaignActive && !isExpired ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${form.campaignActive && !isExpired ? 'transform translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-4">
                <div className="font-medium text-gray-900">Activer la campagne de vote</div>
                <div className="text-sm text-gray-500">
                  {isExpired 
                    ? "La date de fin est dépassée, la campagne est automatiquement désactivée." 
                    : "Si désactivé, aucun utilisateur ne pourra voter."}
                </div>
              </div>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date de début (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={form.campaignStartDate}
                  onChange={(e) => setForm(prev => ({ ...prev, campaignStartDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Date de fin (optionnel)
                </label>
                <input
                  type="datetime-local"
                  value={form.campaignEndDate}
                  onChange={(e) => setForm(prev => ({ ...prev, campaignEndDate: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-gray-50/80 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            {updateSettings.isSuccess && (
              <>
                <AlertCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">Paramètres mis à jour avec succès.</span>
              </>
            )}
            {updateSettings.isError && (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600 font-medium">Erreur lors de la sauvegarde.</span>
              </>
            )}
          </div>
          <Button 
            type="submit" 
            variant="primary" 
            className="gap-2"
            isLoading={updateSettings.isPending}
            disabled={updateSettings.isPending}
          >
            <Save className="h-4 w-4" />
            Enregistrer les modifications
          </Button>
        </div>
      </form>
    </div>
  );
};
