'use client';

import { useState } from 'react';
import ProblemInput from '@/components/landing/ProblemInput';
import RecentProjects from '@/components/landing/RecentProjects';

export default function HomePage() {
  const [showProjects, setShowProjects] = useState(false);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(125% 125% at 50% 101%, rgba(245,87,2,1) 10.5%, rgba(245,120,2,1) 16%, rgba(245,140,2,1) 17.5%, rgba(245,170,100,1) 25%, rgba(238,174,202,1) 40%, rgba(202,179,214,1) 65%, rgba(148,201,233,1) 100%)',
      }}
    >
      <div className="w-full max-w-[500px] space-y-4 animate-fade-in">
        {/* Title — subtle */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(31,32,35,0.6)',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
                <circle cx="4.5" cy="4.5" r="2" fill="#60a5fa" />
                <circle cx="13.5" cy="4.5" r="2" fill="#a78bfa" />
                <circle cx="9" cy="13.5" r="2" fill="#34d399" />
                <line x1="4.5" y1="4.5" x2="13.5" y2="4.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="4.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                <line x1="13.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              </svg>
            </div>
          </div>
          <h1
            className="text-xl font-semibold"
            style={{
              color: 'rgba(255,255,255,0.9)',
              letterSpacing: '-0.02em',
              textShadow: '0 1px 8px rgba(0,0,0,0.15)',
            }}
          >
            System Mapper
          </h1>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            인과지도(CLD)로 복잡한 사회문제를 이해합니다
          </p>
        </div>

        {/* Input */}
        <ProblemInput />

        {/* My projects toggle */}
        <div className="text-center">
          <button
            onClick={() => setShowProjects((v) => !v)}
            className="text-xs transition-all duration-150 cursor-pointer"
            style={{ color: 'rgba(255,255,255,0.5)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.8)')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)')}
          >
            {showProjects ? '접기' : '내 프로젝트 보기'}
          </button>

          {showProjects && (
            <div className="mt-4 animate-slide-up">
              <RecentProjects />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
