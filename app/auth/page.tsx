'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import ProblemInput from '@/components/landing/ProblemInput';

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [authed, setAuthed] = useState(false);
  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${location.origin}/auth/callback` },
      });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setMessage({ type: 'success', text: '확인 이메일을 발송했습니다. 받은편지함을 확인해주세요.' });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage({ type: 'error', text: error.message });
      } else {
        setAuthed(true);
      }
    }

    setLoading(false);
  }

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

      <div className="w-max mx-auto space-y-5 relative z-10">
        {/* Title */}
        <div className="space-y-1.5">
          <h1
            className="text-[24px] leading-tight tracking-tight whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'rgba(255,255,255,0.92)',
              fontWeight: 600,
            }}
          >
            The Hitchhiker&apos;s Guide to the System
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

        {/* Auth form → fades out, ProblemInput fades in */}
        <div className="relative">
          {/* Auth form */}
          <div
            className="transition-all duration-500"
            style={{ opacity: authed ? 0 : 1, pointerEvents: authed ? 'none' : 'auto', position: authed ? 'absolute' : 'relative', width: '100%' }}
          >
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all placeholder:text-white/30"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none transition-all placeholder:text-white/30"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.85)',
                }}
              />

              {message && (
                <p
                  className="text-[12px] px-1"
                  style={{ color: message.type === 'error' ? '#f87171' : '#6ee7b7' }}
                >
                  {message.text}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold transition-all"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#080614',
                  opacity: loading ? 0.6 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? '...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
              </button>
            </form>

            <p className="mt-5 text-center text-[12px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage(null); }}
                className="font-semibold underline cursor-pointer"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>

          {/* Problem input — fades in after auth */}
          <div
            className="transition-all duration-500"
            style={{ opacity: authed ? 1 : 0, pointerEvents: authed ? 'auto' : 'none' }}
          >
            <ProblemInput dark />
          </div>
        </div>
      </div>

      <p
        className="absolute bottom-4 left-0 right-0 text-center text-[11px]"
        style={{ color: 'rgba(255,255,255,0.2)' }}
      >
        © {new Date().getFullYear()} hjngk
      </p>
    </main>
  );
}
