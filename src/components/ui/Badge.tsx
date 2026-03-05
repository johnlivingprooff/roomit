import { clsx } from 'clsx';

interface BadgeProps {
  variant?: 'default' | 'verified' | 'premium' | 'pending' | 'active' | 'warning' | 'error';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-sand text-earth',
    verified: 'bg-primary text-white',
    premium: 'bg-accent text-white',
    pending: 'bg-sand text-earth/60',
    active: 'bg-primary text-white',
    warning: 'bg-amber-100 text-amber-900',
    error: 'bg-error text-white',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
