import { Users, Mail, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/common/Button';

export const AdminUsersPage = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="bg-orange-50 p-6 rounded-full mb-4">
        <Users className="h-16 w-16 text-orange-500" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
      <p className="text-gray-500 max-w-lg">
        La gestion centralisée des utilisateurs (votants, admins, etc.) s'effectue directement via le tableau de bord Clerk pour le moment. L'intégration de cette vue est prévue dans une prochaine mise à jour.
      </p>
      
      <div className="flex gap-4 mt-8">
        <a 
          href="https://dashboard.clerk.com" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          <Button variant="primary" className="gap-2">
            <ShieldAlert className="h-4 w-4" />
            Ouvrir Clerk Dashboard
          </Button>
        </a>
        <Button variant="outline" className="gap-2 bg-white">
          <Mail className="h-4 w-4" />
          Contacter le support
        </Button>
      </div>
    </div>
  );
};
