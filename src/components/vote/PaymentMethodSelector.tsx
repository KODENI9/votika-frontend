import { cn } from '@/lib/utils';

type PaymentMethod = 'orange' | 'wave' | 'mtn' | 'flooz' | 'mix_by_yas';

interface PaymentMethodOption {
  id: PaymentMethod;
  label: string;
  color: string;
  textColor: string;
  abbr: string;
}

const PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: 'orange', label: 'Orange Money', abbr: 'OM', color: '#FF6600', textColor: 'white' },
  { id: 'wave', label: 'Wave', abbr: 'W', color: '#1E90FF', textColor: 'white' },
  { id: 'mtn', label: 'MTN', abbr: 'MTN', color: '#FFCC00', textColor: '#1a1a1a' },
  { id: 'flooz', label: 'Flooz', abbr: 'FL', color: '#00BF6F', textColor: 'white' },
  { id: 'mix_by_yas', label: 'Mix by Yas', abbr: 'MY', color: '#6C2BD9', textColor: 'white' },
];

interface PaymentMethodSelectorProps {
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  error?: string;
}

export const PaymentMethodSelector = ({ value, onChange, error }: PaymentMethodSelectorProps) => {
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = value === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              aria-pressed={isSelected}
              aria-label={method.label}
              className={cn(
                'flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 w-[80px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2',
                isSelected
                  ? 'border-[var(--color-brand)] shadow-md scale-105'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              )}
            >
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center text-xs font-extrabold shadow-sm"
                style={{ backgroundColor: method.color, color: method.textColor }}
              >
                {method.abbr}
              </div>
              <span className="text-[10px] font-semibold text-[var(--color-text)] leading-tight text-center">
                {method.label}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export type { PaymentMethod };
