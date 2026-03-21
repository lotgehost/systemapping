'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProjectSummary {
  id: string;
  prompt: string;
  status: string;
  created_at: string;
}

export default function MyProjectsPanel() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    await fetch(`/api/projects/${id}`, { method: 'DELETE' }).catch(() => {});
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/api/projects')
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setProjects(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open]);

  return (
    <div className="absolute top-4 left-4 z-20">
      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium transition-all duration-150 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.75)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 1px 6px rgba(0,0,0,0.07)',
          backdropFilter: 'blur(12px)',
          color: 'rgba(30,30,40,0.55)',
        }}
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
          <rect x="0.5" y="0.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="6.5" y="0.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="0.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
          <rect x="6.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.2"/>
        </svg>
        Projects
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-9 left-0 w-72 rounded-2xl overflow-hidden animate-slide-up"
          style={{
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-4 h-4 rounded-full border-2 border-[#444] border-t-[#9CA3AF] animate-spin" />
              </div>
            ) : projects.length === 0 ? (
              <p className="text-[12px] text-center py-8" style={{ color: 'rgba(30,30,40,0.35)' }}>
                No projects yet.
              </p>
            ) : (
              <div className="py-1">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="group relative flex items-center hover:bg-black/[0.03] transition-colors duration-100"
                  >
                    <button
                      onClick={() => { router.push(`/map/${p.id}`); setOpen(false); }}
                      className="flex-1 text-left px-4 py-2.5 cursor-pointer"
                    >
                      <p className="text-[12px] leading-snug line-clamp-1" style={{ color: 'rgba(15,15,20,0.8)' }}>
                        {p.prompt}
                      </p>
                      <p className="text-[10px] mt-0.5" style={{ color: 'rgba(30,30,40,0.35)' }}>
                        {new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(p.id); }}
                      className="opacity-0 group-hover:opacity-100 flex-shrink-0 mr-3 p-1 rounded transition-opacity duration-100 cursor-pointer hover:bg-black/[0.06]"
                      style={{ color: 'rgba(30,30,40,0.35)' }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
