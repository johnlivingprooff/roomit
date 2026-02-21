import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-earth dark:text-cream/80">
          {label}
        </label>
      )}
      <input
        className={twMerge(
          clsx(
            'h-12 px-4 border rounded-md w-full transition-all duration-150',
            'bg-white dark:bg-charcoal',
            'border-earth/15 dark:border-earth/20',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'placeholder:text-earth/40 dark:placeholder:text-cream/30',
            error && 'border-error focus:ring-error/50 focus:border-error',
            className
          )
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className, ...props }: TextareaProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-earth dark:text-cream/80">
          {label}
        </label>
      )}
      <textarea
        className={twMerge(
          clsx(
            'px-4 py-3 border rounded-md w-full transition-all duration-150 resize-none',
            'bg-white dark:bg-charcoal',
            'border-earth/15 dark:border-earth/20',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            'placeholder:text-earth/40 dark:placeholder:text-cream/30',
            error && 'border-error focus:ring-error/50 focus:border-error',
            className
          )
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className, ...props }: SelectProps) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-earth dark:text-cream/80">
          {label}
        </label>
      )}
      <select
        className={twMerge(
          clsx(
            'h-12 px-4 border rounded-md w-full transition-all duration-150',
            'bg-white dark:bg-charcoal',
            'border-earth/15 dark:border-earth/20',
            'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
            error && 'border-error focus:ring-error/50 focus:border-error',
            className
          )
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}
