import LandingTabs from '@/components/landing/LandingTabs';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden bg-[#16171A]">
      {/* Background radial glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(37,99,235,0.07) 0%, transparent 70%)',
        }}
      />
      {/* Dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-xl space-y-8 animate-fade-in">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center mb-5">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                <circle cx="4.5" cy="4.5" r="2" fill="#60a5fa" />
                <circle cx="13.5" cy="4.5" r="2" fill="#a78bfa" />
                <circle cx="9" cy="13.5" r="2" fill="#34d399" />
                <line x1="4.5" y1="4.5" x2="13.5" y2="4.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="4.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <line x1="13.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-semibold text-white" style={{ letterSpacing: '-0.02em' }}>
            System Mapper
          </h1>
          <p className="text-sm leading-relaxed text-[#9CA3AF]" style={{ maxWidth: '34ch', margin: '0 auto' }}>
            복잡한 사회문제를 AI와 함께 인과지도(CLD)로 이해합니다.
          </p>
        </div>

        {/* Tabs: 새 맵 / 내 프로젝트 */}
        <LandingTabs />

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {[
            { label: '변수', color: '#60a5fa' },
            { label: '외생변수', color: '#a78bfa' },
            { label: '정책 레버', color: '#34d399' },
            { label: '강화 루프 R', color: '#fbbf24' },
            { label: '균형 루프 B', color: '#6ee7b7' },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 text-[11px] text-[#6B7280]">
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
