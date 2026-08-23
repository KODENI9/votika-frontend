import { type ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    
    const variants = {
      primary: 'bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-hover)] border border-transparent shadow-sm',
      secondary: 'bg-[var(--color-surface-hover)] text-[var(--color-text)] hover:bg-gray-200 border border-transparent',
      outline: 'bg-transparent text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white border border-[var(--color-brand)]',
      ghost: 'bg-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-11 px-5 text-base',
      lg: 'h-14 px-8 text-lg font-semibold',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] focus:ring-offset-2',
          variants[variant],
          sizes[size],
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed' : '',
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
