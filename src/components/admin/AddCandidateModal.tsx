import { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/api/client';
import { Button } from '@/components/common/Button';

const CATEGORIES = [
  'Musicien', 'Humoriste', 'Entrepreneur', 'Danseur', 'Cuisinier',
  'Voyageur', 'Beauté', 'Sport', 'Gaming', 'Education', 'Autre'
];

interface AddCandidateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  displayName: string;
  tiktokHandle: string;
  bio: string;
  country: string;
  category: string;
  avatarUrl: string;
}

const initialForm: FormData = {
  displayName: '',
  tiktokHandle: '',
  bio: '',
  country: '',
  category: 'Musicien',
  avatarUrl: '',
};

export const AddCandidateModal = ({ isOpen, onClose }: AddCandidateModalProps) => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [error, setError] = useState('');
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const token = await getToken();
      const res = await apiClient.post('/admin/creators', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-creators'] });
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      setForm(initialForm);
      setError('');
      onClose();
    },
    onError: (err: any) => {
      setError(err.response?.data?.error || err.response?.data?.detail || 'Une erreur est survenue.');
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError('');
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'votika_avatars'); // Replace with your exact upload preset name if different
      formData.append('cloud_name', 'dpqc6owhs'); // Your Cloudinary cloud name

      // Request to Cloudinary Unsigned Upload API
      const response = await fetch('https://api.cloudinary.com/v1_1/dpqc6owhs/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.secure_url) {
        setForm((prev) => ({ ...prev, avatarUrl: data.secure_url }));
      } else {
        throw new Error("Erreur lors de l'upload de l'image : " + (data.error?.message || "Inconnue"));
      }
    } catch (err) {
      console.error(err);
      setError("Impossible de télécharger l'image sur Cloudinary. Vérifiez votre Upload Preset.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createMutation.mutate(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add Candidate</h2>
            <p className="text-sm text-gray-500 mt-0.5">Créez un nouveau profil candidat</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Nom d'affichage <span className="text-red-500">*</span>
              </label>
              <input
                name="displayName"
                value={form.displayName}
                onChange={handleChange}
                required
                placeholder="Ex: Sarah Jenkins"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pseudo TikTok <span className="text-red-500">*</span>
              </label>
              <input
                name="tiktokHandle"
                value={form.tiktokHandle}
                onChange={handleChange}
                required
                placeholder="Ex: @sarahjenkins"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Pays <span className="text-red-500">*</span>
              </label>
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
                placeholder="Ex: Côte d'Ivoire"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Image de profil (Avatar) <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-4">
                {form.avatarUrl && (
                  <div className="h-16 w-16 shrink-0 rounded-full overflow-hidden border border-gray-200 bg-gray-100">
                    <img src={form.avatarUrl} alt="Preview" className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="w-full">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required={!form.avatarUrl}
                    disabled={isUploading}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-500 file:text-white hover:file:bg-orange-600 disabled:opacity-50"
                  />
                  {isUploading && <p className="text-sm text-orange-500 mt-2">Envoi de l'image sur Cloudinary en cours...</p>}
                </div>
              </div>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                rows={3}
                placeholder="Courte description du candidat..."
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:border-transparent transition resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-200 text-gray-700">
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={createMutation.isPending || isUploading}
              disabled={createMutation.isPending || isUploading}
            >
              Créer le candidat
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
