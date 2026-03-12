import { Source } from '@/types';
import { ExternalLink } from 'lucide-react';

const SOURCE_STYLES: Record<string, { label: string; bg: string; color: string; border: string }> = {
  web:          { label: 'Web', bg: '#dbeafe', color: '#1d4ed8', border: '#bfdbfe' },
  upload:       { label: 'Upload', bg: '#dcfce7', color: '#166534', border: '#bbf7d0' },
  user:         { label: 'User', bg: '#f3f4f6', color: '#374151', border: '#e5e7eb' },
  ai_inference: { label: 'AI', bg: '#fef9c3', color: '#854d0e', border: '#fde68a' },
};

export default function SourceBadge({ source }: { source: Source }) {
  const style = SOURCE_STYLES[source.type] ?? SOURCE_STYLES.ai_inference;

  return (
    <div
      className="rounded-lg p-3 space-y-1.5"
      style={{
        background: 'rgba(0,0,0,0.025)',
        border: '1px solid rgba(0,0,0,0.07)',
      }}
    >
      <div className="flex items-start gap-2">
        <span
          className="text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
          style={{ background: style.bg, color: style.color, border: `1px solid ${style.border}` }}
        >
          {style.label}
        </span>
        <span className="text-xs font-semibold text-[var(--text-primary)] leading-snug">
          {source.title}
        </span>
      </div>

      {source.excerpt && (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed pl-0.5 border-l-2 border-[rgba(0,0,0,0.1)] ml-0.5 pl-2">
          {source.excerpt}
        </p>
      )}

      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] font-medium hover:underline"
          style={{ color: style.color }}
        >
          <ExternalLink className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{source.url.replace(/^https?:\/\//, '')}</span>
        </a>
      )}
    </div>
  );
}
