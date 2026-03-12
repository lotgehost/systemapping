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
        background: 'radial-gradient(125% 125% at 50% 100%, #713f12 0%, #15803d 25%, #166534 45%, #14532d 65%, #052e16 85%, #020d07 100%)',
      }}
    >
      <div className="w-full max-w-[500px] space-y-4 animate-fade-in">
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
            {showProjects ? 'Hide' : 'My Projects'}
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
