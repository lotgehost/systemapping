'use client';

import ProblemInput from '@/components/landing/ProblemInput';

export default function HomePage() {

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 80% at 60% 20%, #fef3c7 0%, #fde68a 15%, #fed7aa 30%, #fecaca 45%, #e9d5ff 65%, #c7d2fe 80%, #bfdbfe 100%)',
      }}
    >
      <div className="w-full max-w-[500px] space-y-5 animate-fade-in">
        {/* Heading */}
        <div className="space-y-1.5">
          <h1
            className="text-[26px] leading-tight tracking-tight"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(15,15,20,0.85)',
              fontWeight: 600,
            }}
          >
            Map any complex system.
          </h1>
          <p
            className="text-[13px]"
            style={{
              fontFamily: 'var(--font-jakarta)',
              color: 'rgba(30,30,40,0.45)',
              letterSpacing: '0.01em',
            }}
          >
            Describe a problem — AI builds a causal loop diagram.
          </p>
        </div>

        {/* Input */}
        <ProblemInput />
      </div>
    </main>
  );
}
