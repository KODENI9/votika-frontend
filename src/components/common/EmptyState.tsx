import { FileQuestion } from 'lucide-react';

export const EmptyState = ({ title = 'Aucun résultat', description = 'Il n\'y a rien à afficher ici pour le moment.' }: { title?: string; description?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-[var(--color-border)] rounded-2xl">
      <FileQuestion className="h-12 w-12 text-[var(--color-text-muted)] mb-4 opacity-50" />
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-[var(--color-text-muted)] max-w-sm">{description}</p>
    </div>
  );
};
