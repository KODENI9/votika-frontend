import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export const ErrorState = ({ message = 'Une erreur est survenue.', retry }: { message?: string; retry?: () => void }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <AlertTriangle className="h-8 w-8 text-red-600" />
      </div>
      <h3 className="text-lg font-bold mb-2">Oups !</h3>
      <p className="text-[var(--color-text-muted)] mb-6 max-w-md">{message}</p>
      {retry && (
        <Button variant="outline" onClick={retry}>
          Réessayer
        </Button>
      )}
    </div>
  );
};
