'use client';

import ProblemInput from '@/components/landing/ProblemInput';
import SpaceBackground from '@/components/landing/SpaceBackground';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 relative overflow-hidden pt-[36vh]"
      style={{
        background: '#06050e',
      }}
    >
      <SpaceBackground />

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 text-[12px] px-3 py-1.5 transition-all duration-150 cursor-pointer"
        style={{ color: 'rgba(255,255,255,0.45)' }}
      >
        Sign out
      </button>

      <div className="w-max mx-auto space-y-5 animate-fade-in relative z-10">
        {/* Heading */}
        <div className="space-y-1.5">
          <h1
            className="text-[24px] leading-tight tracking-tight whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 600,
            }}
          >
            The Hitchhiker's Guide to the System
          </h1>
          <p
            className="text-[13px]"
            style={{
              fontFamily: 'var(--font-jakarta)',
              color: 'rgba(180,190,255,0.5)',
              letterSpacing: '0.01em',
            }}
          >
            map the complex system
          </p>
        </div>

        {/* Input */}
        <ProblemInput dark />
      </div>

      <p
        className="absolute bottom-4 left-0 right-0 text-center text-[11px] pointer-events-none"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        © {new Date().getFullYear()} hjngk
      </p>
    </main>
  );
}
