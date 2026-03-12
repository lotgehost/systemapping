'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectSummary {
  id: string;
  prompt: string;
  status: 'pending' | 'generating' | 'ready' | 'error';
  created_at: string;
}

const STATUS_LABEL: Record<string, string> = {
  ready: '완료',
  generating: '생성 중',
  pending: '대기',
  error: '오류',
};

const STATUS_COLOR: Record<string, string> = {
  ready: '#059669',
  generating: '#2563eb',
  pending: '#999999',
  error: '#dc2626',
};

export default function RecentProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-4 h-4 rounded-full border-2 border-[var(--text-muted)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[var(--text-muted)]">아직 생성한 맵이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => router.push(`/map/${p.id}`)}
          className="w-full text-left rounded-xl px-4 py-3.5 transition-all duration-150 cursor-pointer border"
          style={{
            background: 'var(--glass-bg)',
            borderColor: 'var(--glass-border)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.15)';
            (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg-strong)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'var(--glass-border)';
            (e.currentTarget as HTMLElement).style.background = 'var(--glass-bg)';
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p
              className="text-sm leading-snug line-clamp-2 flex-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {p.prompt}
            </p>
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
              style={{
                background: STATUS_COLOR[p.status] + '18',
                color: STATUS_COLOR[p.status],
              }}
            >
              {STATUS_LABEL[p.status] ?? p.status}
            </span>
          </div>
          <p className="text-[11px] mt-1.5" style={{ color: 'var(--text-muted)' }}>
            {new Date(p.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </button>
      ))}
    </div>
  );
}
