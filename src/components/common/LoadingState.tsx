import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Chargement...' }: { message?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-[var(--color-text-muted)]">
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-[var(--color-brand)]" />
      <p>{message}</p>
    </div>
  );
};
