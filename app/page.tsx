import ProblemInput from '@/components/landing/ProblemInput';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background: subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      {/* Ambient glow — very subtle center radial */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,255,255,0.025) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-xl space-y-12 animate-fade-in">
        {/* Header */}
        <div className="space-y-4 text-center">
          {/* Logo mark */}
          <div className="flex justify-center mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="4.5" cy="4.5" r="2" fill="rgba(255,255,255,0.8)" />
                <circle cx="13.5" cy="4.5" r="2" fill="rgba(255,255,255,0.5)" />
                <circle cx="9" cy="13.5" r="2" fill="rgba(255,255,255,0.65)" />
                <line x1="4.5" y1="4.5" x2="13.5" y2="4.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="4.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
                <line x1="13.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'rgba(255,255,255,0.9)', letterSpacing: '-0.02em' }}
          >
            System Mapper
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '32ch', margin: '0 auto' }}
          >
            복잡한 사회문제를 AI와 함께 시스템으로 이해합니다.
            문제를 입력하면 AI가 구조적 초안을 생성하고, 당신이 현장 지식으로 완성합니다.
          </p>
        </div>

        {/* Form */}
        <ProblemInput />

        {/* Tags */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {['행위자', '구조 요인', '피드백 루프', '개입 지점', '출처 기반'].map((tag) => (
            <span
              key={tag}
              className="text-[11px] tracking-wide"
              style={{ color: 'rgba(255,255,255,0.2)' }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
