'use client';

import { useState } from 'react';
import ProblemInput from './ProblemInput';
import RecentProjects from './RecentProjects';

export default function LandingTabs() {
  const [tab, setTab] = useState<'new' | 'recent'>('new');

  return (
    <div className="w-full space-y-6">
      {/* Tab bar */}
      <div
        className="flex rounded-xl p-1 gap-1"
        style={{
          background: 'var(--glass-bg)',
          border: '1px solid var(--glass-border)',
        }}
      >
        {(['new', 'recent'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: tab === t ? 'var(--glass-bg-strong)' : 'transparent',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-muted)',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              border: tab === t ? '1px solid var(--glass-border)' : '1px solid transparent',
            }}
          >
            {t === 'new' ? '새 맵 만들기' : '내 프로젝트'}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'new' ? <ProblemInput /> : <RecentProjects />}
    </div>
  );
}
