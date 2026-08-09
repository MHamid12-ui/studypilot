import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export function Button({ variant = 'primary', size = 'md', children, className = '', ...props }: ButtonProps) {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 ease-out active:scale-[0.97] cursor-pointer focus-ring disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-accent text-white hover:opacity-90 shadow-sm',
    secondary: 'bg-muted text-foreground hover:bg-border',
    ghost: 'text-foreground hover:bg-muted',
    destructive: 'bg-destructive text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2',
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}