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
        className="flex rounded-2xl p-1 gap-1"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {(['new', 'recent'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer"
            style={{
              background: tab === t ? 'rgba(255,255,255,0.08)' : 'transparent',
              color: tab === t ? '#F3F4F6' : '#6B7280',
              boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.3)' : 'none',
              border: tab === t ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
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
