'use client';

import ProblemInput from '@/components/landing/ProblemInput';
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
        background: `
          radial-gradient(ellipse 80% 60% at 75% 10%, rgba(124,58,237,0.45) 0%, transparent 60%),
          radial-gradient(ellipse 60% 70% at 15% 80%, rgba(37,99,235,0.35) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 50% 45%, rgba(219,39,119,0.18) 0%, transparent 60%),
          #080614
        `,
      }}
    >
      {/* Stars overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px),
            radial-gradient(circle, rgba(255,255,255,0.3) 1.5px, transparent 1.5px)
          `,
          backgroundSize: '160px 160px, 100px 100px, 260px 260px',
          backgroundPosition: '0 0, 60px 80px, 20px 130px',
          opacity: 0.4,
        }}
      />

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
