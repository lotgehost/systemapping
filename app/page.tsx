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
      className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse 120% 80% at 60% 20%, #fef3c7 0%, #fde68a 15%, #fed7aa 30%, #fecaca 45%, #e9d5ff 65%, #c7d2fe 80%, #bfdbfe 100%)',
      }}
    >
      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="absolute top-4 right-4 text-[12px] px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.5)',
          border: '1px solid rgba(0,0,0,0.08)',
          color: 'rgba(30,30,40,0.55)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Sign out
      </button>

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
            The Hitchhiker's Guide to the System
          </h1>
          <p
            className="text-[13px]"
            style={{
              fontFamily: 'var(--font-jakarta)',
              color: 'rgba(30,30,40,0.45)',
              letterSpacing: '0.01em',
            }}
          >
            map the complex system
          </p>
        </div>

        {/* Input */}
        <ProblemInput />
      </div>
    </main>
  );
}
