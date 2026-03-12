import { Source } from '@/types';

const SOURCE_LABELS: Record<string, string> = {
  web: '웹',
  upload: '업로드',
  user: '직접',
  ai_inference: 'AI 추론',
};

export default function SourceBadge({ source }: { source: Source }) {
  return (
    <div className="glass rounded-lg p-3 space-y-1">
      <div className="flex items-center gap-2">
        <span className="text-[10px] px-1.5 py-0.5 rounded glass text-[var(--text-muted)]">
          {SOURCE_LABELS[source.type] ?? source.type}
        </span>
        <span className="text-xs text-[var(--text-secondary)] font-medium truncate">
          {source.title}
        </span>
      </div>
      {source.excerpt && (
        <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
          {source.excerpt}
        </p>
      )}
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] underline"
        >
          {source.url}
        </a>
      )}
    </div>
  );
}
