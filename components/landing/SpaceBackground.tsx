// Simple seeded pseudo-random number generator (no Math.random — deterministic for SSR)
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function SpaceBackground() {
  const rand = seededRand(42);
  const stars = Array.from({ length: 110 }, () => ({
    x: rand() * 1440,
    y: rand() * 620,
    r: 0.4 + rand() * 1.4,
    opacity: 0.15 + rand() * 0.85,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Sky */}
        <rect width="1440" height="900" fill="#06050e" />

        {/* Stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity} />
        ))}

        {/* Earth glow */}
        <radialGradient id="earthGlow" cx="50%" cy="100%" r="50%">
          <stop offset="0%" stopColor="#3b7dd8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b7dd8" stopOpacity="0" />
        </radialGradient>
        <ellipse cx="720" cy="900" rx="500" ry="320" fill="url(#earthGlow)" />

        {/* Earth base */}
        <clipPath id="earthClip">
          <circle cx="720" cy="1010" r="430" />
        </clipPath>
        <circle cx="720" cy="1010" r="430" fill="#2d6abf" />
        <g clipPath="url(#earthClip)">
          {/* Ocean highlight */}
          <ellipse cx="620" cy="900" rx="260" ry="200" fill="#3b82c8" opacity="0.6" />
          {/* Continent 1 - Europe/Africa-ish */}
          <path d="M640,640 C660,630 690,628 710,640 C725,650 730,670 720,690 C710,710 695,720 680,715 C660,720 645,700 640,680 C635,660 635,650 640,640Z" fill="rgba(255,255,255,0.88)" />
          {/* Continent 2 */}
          <path d="M700,680 C720,672 745,675 758,688 C770,700 768,720 755,730 C742,740 722,738 710,728 C698,718 696,700 700,680Z" fill="rgba(200,220,180,0.7)" />
          {/* Continent 3 */}
          <path d="M580,700 C600,695 615,700 618,715 C620,730 610,740 595,738 C580,736 572,724 575,710Z" fill="rgba(255,255,255,0.75)" />
          {/* Ice cap */}
          <path d="M580,620 C620,608 680,610 730,618 C770,624 800,635 790,645 C770,658 720,655 680,650 C640,645 600,648 575,640Z" fill="rgba(255,255,255,0.92)" />
          {/* Cloud streaks */}
          <path d="M620,760 C650,755 700,752 740,758 C770,762 780,770 770,775 C750,780 700,778 660,774 C630,770 615,765 620,760Z" fill="rgba(255,255,255,0.6)" />
          <path d="M680,800 C710,796 750,794 780,800 C800,805 805,812 792,816 C772,820 730,818 700,814 C678,810 668,805 680,800Z" fill="rgba(255,255,255,0.5)" />
        </g>

        {/* Moon terrain - back layer */}
        <path d="M0,760 C60,738 130,750 200,740 C280,728 360,745 440,735 C520,724 600,742 680,732 C760,722 840,738 920,728 C1000,718 1080,736 1160,726 C1240,716 1320,734 1380,724 L1440,720 L1440,900 L0,900Z" fill="#1c1c1c" />
        {/* Moon terrain - mid layer */}
        <path d="M0,800 C80,782 160,795 240,785 C320,775 400,792 480,782 C560,772 640,788 720,780 C800,772 880,786 960,778 C1040,770 1120,784 1200,776 C1280,768 1360,782 1440,774 L1440,900 L0,900Z" fill="#141414" />
        {/* Moon terrain - front layer (darkest) */}
        <path d="M0,840 C100,825 200,838 300,828 C400,818 500,835 600,825 C700,815 800,830 900,822 C1000,814 1100,828 1200,820 C1300,812 1380,826 1440,820 L1440,900 L0,900Z" fill="#0a0a0a" />
        {/* Foreground crater/detail */}
        <ellipse cx="280" cy="870" rx="80" ry="18" fill="#111" opacity="0.8" />
        <ellipse cx="1100" cy="858" rx="60" ry="14" fill="#111" opacity="0.7" />
      </svg>
    </div>
  );
}
