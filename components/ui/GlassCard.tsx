import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  highlight?: boolean;
}

export default function GlassCard({ children, className = '', highlight = false }: GlassCardProps) {
  return (
    <div
      className={`
        relative rounded-xl p-4
        ${highlight ? 'glass-strong' : 'glass'}
        ${className}
      `}
      style={{
        boxShadow: highlight
          ? '0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)'
          : '0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {children}
    </div>
  );
}
