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
  ready: '#34d399',
  generating: '#60a5fa',
  pending: '#9CA3AF',
  error: '#f87171',
};

export default function RecentProjects() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      // ignore
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-4 h-4 rounded-full border-2 border-[#444444] border-t-[#9CA3AF] animate-spin" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-[#6B7280]">아직 생성한 맵이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {projects.map((p) => (
        <button
          key={p.id}
          onClick={() => router.push(`/map/${p.id}`)}
          className="w-full text-left rounded-2xl px-4 py-3.5 transition-all duration-150 cursor-pointer border"
          style={{
            background: 'rgba(31,32,35,0.7)',
            borderColor: 'rgba(255,255,255,0.12)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(16px)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.22)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(31,32,35,0.85)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.background = 'rgba(31,32,35,0.7)';
          }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm leading-snug line-clamp-2 flex-1 text-[#E5E7EB]">
              {p.prompt}
            </p>
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <span
                className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{
                  background: STATUS_COLOR[p.status] + '22',
                  color: STATUS_COLOR[p.status],
                }}
              >
                {STATUS_LABEL[p.status] ?? p.status}
              </span>
              <button
                onClick={(e) => handleDelete(e, p.id)}
                disabled={deletingId === p.id}
                className="w-5 h-5 rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer disabled:opacity-40"
                style={{ background: 'rgba(255,255,255,0.07)', color: '#6B7280' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(248,113,113,0.15)';
                  (e.currentTarget as HTMLElement).style.color = '#f87171';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.color = '#6B7280';
                }}
              >
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1 1L7 7M7 1L1 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          </div>
          <p className="text-[11px] mt-1.5 text-[#6B7280]">
            {new Date(p.created_at).toLocaleDateString('ko-KR', {
              year: 'numeric', month: 'short', day: 'numeric',
            })}
          </p>
        </button>
      ))}
    </div>
  );
}
