import LandingTabs from '@/components/landing/LandingTabs';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background: subtle dot grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(rgba(0,0,0,0.06) 1px, transparent 1px)`,
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 w-full max-w-xl space-y-10 animate-fade-in">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.1)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="4.5" cy="4.5" r="2" fill="#2563eb" />
                <circle cx="13.5" cy="4.5" r="2" fill="#7c3aed" />
                <circle cx="9" cy="13.5" r="2" fill="#059669" />
                <line x1="4.5" y1="4.5" x2="13.5" y2="4.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <line x1="4.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
                <line x1="13.5" y1="4.5" x2="9" y2="13.5" stroke="rgba(0,0,0,0.2)" strokeWidth="1" />
              </svg>
            </div>
          </div>

          <h1
            className="text-2xl font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            System Mapper
          </h1>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--text-muted)', maxWidth: '34ch', margin: '0 auto' }}
          >
            복잡한 사회문제를 AI와 함께 인과지도(CLD)로 이해합니다.
          </p>
        </div>

        {/* Tabs: 새 맵 / 내 프로젝트 */}
        <LandingTabs />

        {/* Legend */}
        <div className="flex items-center justify-center gap-5 flex-wrap">
          {[
            { label: '변수', color: '#2563eb' },
            { label: '외생변수', color: '#7c3aed' },
            { label: '정책 레버', color: '#059669' },
            { label: '강화 루프 R', color: '#b45309' },
            { label: '균형 루프 B', color: '#166534' },
          ].map((item) => (
            <span key={item.label} className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-muted)' }}>
              <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
