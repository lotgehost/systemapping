import { ButtonHTMLAttributes, ReactNode } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
}

export default function GlassButton({
  children,
  variant = 'default',
  className = '',
  ...props
}: GlassButtonProps) {
  const variants = {
    default: `
      glass glass-hover
      text-[var(--text-secondary)] hover:text-[var(--text-primary)]
      hover:border-[var(--glass-border-strong)]
    `,
    primary: `
      bg-[#111827] text-white
      hover:bg-[#1f2937]
      shadow-[0_2px_12px_rgba(0,0,0,0.12)]
      hover:shadow-[0_4px_20px_rgba(0,0,0,0.18)]
    `,
    ghost: `
      border border-transparent
      hover:bg-[var(--glass-hover)] hover:border-[var(--glass-border)]
      text-[var(--text-secondary)] hover:text-[var(--text-primary)]
    `,
  };

  return (
    <button
      className={`
        relative rounded-lg px-4 py-2 text-sm font-medium
        transition-all duration-200
        active:scale-[0.97]
        cursor-pointer
        disabled:opacity-30 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
