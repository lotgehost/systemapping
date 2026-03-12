import { TextareaHTMLAttributes, InputHTMLAttributes } from 'react';

type TextareaProps = { multiline: true } & TextareaHTMLAttributes<HTMLTextAreaElement>;
type InputProps = { multiline?: false } & InputHTMLAttributes<HTMLInputElement>;
type GlassInputProps = (TextareaProps | InputProps) & { className?: string };

export default function GlassInput({ multiline, className = '', ...props }: GlassInputProps) {
  const base = `
    w-full rounded-lg px-3 py-2.5 text-sm
    bg-[var(--glass-bg)] border border-[var(--glass-border)]
    text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
    focus:outline-none focus:border-[rgba(0,0,0,0.2)]
    focus:bg-[var(--glass-bg-strong)]
    focus:shadow-[0_0_0_3px_rgba(0,0,0,0.04)]
    resize-none transition-all duration-200
    ${className}
  `;

  if (multiline) {
    return (
      <textarea
        className={base}
        {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
      />
    );
  }

  return (
    <input
      className={base}
      {...(props as InputHTMLAttributes<HTMLInputElement>)}
    />
  );
}
