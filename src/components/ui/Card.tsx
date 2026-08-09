import { type ReactNode, type CSSProperties } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  style?: CSSProperties;
}

export function Card({ children, className = '', onClick, hoverable = false, style }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card text-card-foreground rounded-xl border border-border p-5 transition-all duration-200
        ${hoverable ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}