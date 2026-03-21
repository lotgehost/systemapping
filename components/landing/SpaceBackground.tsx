// Simple seeded pseudo-random number generator (no Math.random — deterministic for SSR)
function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export default function SpaceBackground() {
  const rx = seededRand(7);
  const ry = seededRand(193);
  const rr = seededRand(311);
  const ro = seededRand(857);
  const stars = Array.from({ length: 120 }, () => ({
    x: rx() * 1440,
    y: ry() * 660,
    r: 0.3 + rr() * 1.5,
    opacity: 0.1 + ro() * 0.9,
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

        <defs>
          {/* Planet body clip paths */}
          <clipPath id="pc1"><circle cx="130" cy="95" r="105" /></clipPath>
          <clipPath id="pc2"><circle cx="1355" cy="25" r="115" /></clipPath>
          <clipPath id="pc3"><circle cx="1185" cy="372" r="55" /></clipPath>
          <clipPath id="pc4"><circle cx="1390" cy="840" r="128" /></clipPath>
          <clipPath id="pc5"><circle cx="265" cy="858" r="68" /></clipPath>
          <clipPath id="pc6"><circle cx="75" cy="688" r="44" /></clipPath>
          {/* Ring front-half clip paths (below planet equator) */}
          <clipPath id="rc3"><rect x="1090" y="372" width="190" height="60" /></clipPath>
          <clipPath id="rc6"><rect x="5" y="688" width="140" height="50" /></clipPath>
        </defs>

        {/* ── Planet 1: Orange Jupiter-like (top-left) ── */}
        <circle cx="130" cy="95" r="105" fill="#E8923A" />
        <g clipPath="url(#pc1)">
          <rect x="20" y="22" width="220" height="17" fill="#C06818" opacity="0.65" rx="8" />
          <rect x="20" y="46" width="220" height="12" fill="#FFBA58" opacity="0.5" rx="6" />
          <rect x="20" y="65" width="220" height="22" fill="#C06818" opacity="0.62" rx="11" />
          <rect x="20" y="95" width="220" height="13" fill="#FFBA58" opacity="0.5" rx="6" />
          <rect x="20" y="115" width="220" height="19" fill="#C06818" opacity="0.6" rx="9" />
          <rect x="20" y="141" width="220" height="12" fill="#FFBA58" opacity="0.45" rx="6" />
          <ellipse cx="88" cy="50" rx="46" ry="30" fill="rgba(255,225,170,0.22)" />
        </g>

        {/* ── Planet 2: Pink/purple striped (top-right) ── */}
        <circle cx="1355" cy="25" r="115" fill="#C055A8" />
        <g clipPath="url(#pc2)">
          <rect x="1238" y="-50" width="234" height="20" fill="#903888" opacity="0.65" rx="10" />
          <rect x="1238" y="-22" width="234" height="15" fill="#E080CC" opacity="0.5" rx="7" />
          <rect x="1238" y="2" width="234" height="22" fill="#903888" opacity="0.62" rx="11" />
          <rect x="1238" y="33" width="234" height="15" fill="#E080CC" opacity="0.5" rx="7" />
          <rect x="1238" y="56" width="234" height="19" fill="#903888" opacity="0.6" rx="9" />
          <rect x="1238" y="83" width="234" height="14" fill="#E080CC" opacity="0.45" rx="7" />
          <ellipse cx="1302" cy="-14" rx="50" ry="32" fill="rgba(255,200,240,0.2)" />
        </g>

        {/* ── Planet 3: Small orange ringed Saturn (mid-right) ── */}
        {/* Ring — back half (drawn first, behind planet) */}
        <ellipse cx="1185" cy="390" rx="92" ry="17" fill="#C88C18" opacity="0.75" />
        <ellipse cx="1185" cy="390" rx="80" ry="13" fill="#F0B838" opacity="0.5" />
        {/* Planet body */}
        <circle cx="1185" cy="372" r="55" fill="#F0B838" />
        <g clipPath="url(#pc3)">
          <ellipse cx="1185" cy="348" rx="55" ry="9" fill="#C88818" opacity="0.55" />
          <ellipse cx="1185" cy="368" rx="55" ry="7" fill="#FFD060" opacity="0.45" />
          <ellipse cx="1185" cy="388" rx="55" ry="9" fill="#C88818" opacity="0.55" />
          <ellipse cx="1158" cy="350" rx="26" ry="17" fill="rgba(255,240,170,0.26)" />
        </g>
        {/* Ring — front half (below planet equator) */}
        <ellipse cx="1185" cy="390" rx="92" ry="17" fill="#C88C18" opacity="0.75" clipPath="url(#rc3)" />
        <ellipse cx="1185" cy="390" rx="80" ry="13" fill="#F0B838" opacity="0.5" clipPath="url(#rc3)" />

        {/* ── Planet 4: Blue planet (bottom-right) ── */}
        <circle cx="1390" cy="840" r="128" fill="#3870C0" />
        <g clipPath="url(#pc4)">
          <ellipse cx="1345" cy="770" rx="132" ry="52" fill="#5892E0" opacity="0.4" />
          <ellipse cx="1415" cy="825" rx="115" ry="40" fill="#2658A0" opacity="0.45" />
          <ellipse cx="1358" cy="876" rx="124" ry="36" fill="#5892E0" opacity="0.35" />
          <ellipse cx="1350" cy="785" rx="44" ry="28" fill="rgba(150,205,255,0.22)" />
        </g>

        {/* ── Planet 5: Green striped (bottom-center-left) ── */}
        <circle cx="265" cy="858" r="68" fill="#52BA42" />
        <g clipPath="url(#pc5)">
          <rect x="195" y="818" width="140" height="14" fill="#388828" opacity="0.7" rx="7" />
          <rect x="195" y="839" width="140" height="11" fill="#74DC58" opacity="0.55" rx="5" />
          <rect x="195" y="856" width="140" height="17" fill="#388828" opacity="0.65" rx="8" />
          <rect x="195" y="879" width="140" height="11" fill="#74DC58" opacity="0.5" rx="5" />
          <ellipse cx="232" cy="828" rx="32" ry="20" fill="rgba(198,255,175,0.2)" />
        </g>

        {/* ── Planet 6: Pink mini with ring (left) ── */}
        {/* Ring back */}
        <ellipse cx="75" cy="700" rx="70" ry="13" fill="#EE4A8C" opacity="0.7" />
        <ellipse cx="75" cy="700" rx="60" ry="10" fill="#FF80C0" opacity="0.45" />
        {/* Planet */}
        <circle cx="75" cy="688" r="44" fill="#FF70B8" />
        <g clipPath="url(#pc6)">
          <ellipse cx="55" cy="672" rx="28" ry="17" fill="rgba(255,200,230,0.28)" />
        </g>
        {/* Ring front */}
        <ellipse cx="75" cy="700" rx="70" ry="13" fill="#EE4A8C" opacity="0.7" clipPath="url(#rc6)" />
        <ellipse cx="75" cy="700" rx="60" ry="10" fill="#FF80C0" opacity="0.45" clipPath="url(#rc6)" />

        {/* Moon terrain - back layer (warm grey, peaks lit) */}
        <path d="M0,755 C60,732 130,748 200,736 C280,722 360,742 440,730 C520,718 600,738 680,726 C760,714 840,734 920,722 C1000,710 1080,730 1160,718 C1240,706 1320,726 1380,716 L1440,712 L1440,900 L0,900Z" fill="#3a3630" />
        {/* Ridge highlight on back layer */}
        <path d="M0,755 C60,732 130,748 200,736 C280,722 360,742 440,730 C520,718 600,738 680,726 C760,714 840,734 920,722 C1000,710 1080,730 1160,718 C1240,706 1320,726 1380,716 L1440,712 L1440,718 C1320,730 1240,710 1160,722 C1080,734 1000,714 920,726 C840,738 760,718 680,730 C600,742 520,722 440,734 C360,746 280,726 200,740 C130,752 60,736 0,759Z" fill="#4a453d" opacity="0.7" />
        {/* Mid layer */}
        <path d="M0,798 C80,778 160,792 240,782 C320,770 400,788 480,778 C560,768 640,784 720,776 C800,768 880,782 960,774 C1040,766 1120,780 1200,772 C1280,764 1360,778 1440,770 L1440,900 L0,900Z" fill="#272420" />
        {/* Mid ridge highlight */}
        <path d="M0,798 C80,778 160,792 240,782 C320,770 400,788 480,778 C560,768 640,784 720,776 C800,768 880,782 960,774 C1040,766 1120,780 1200,772 C1280,764 1360,778 1440,770 L1440,775 C1360,783 1280,769 1200,777 C1120,785 1040,771 960,779 C880,787 800,773 720,781 C640,789 560,773 480,783 C400,793 320,775 240,787 C160,797 80,783 0,803Z" fill="#33302b" opacity="0.6" />
        {/* Front layer */}
        <path d="M0,838 C100,822 200,836 300,826 C400,816 500,832 600,822 C700,812 800,828 900,820 C1000,812 1100,826 1200,818 C1300,810 1380,824 1440,816 L1440,900 L0,900Z" fill="#181512" />
        {/* Foreground (darkest) */}
        <path d="M0,868 C150,860 300,866 450,862 C600,858 750,864 900,860 C1050,856 1200,862 1440,858 L1440,900 L0,900Z" fill="#0d0b09" />
        {/* Crater depressions */}
        <ellipse cx="280" cy="855" rx="88" ry="11" fill="#111" opacity="0.5" />
        <ellipse cx="1100" cy="845" rx="62" ry="9" fill="#111" opacity="0.45" />
        <ellipse cx="680" cy="862" rx="48" ry="7" fill="#111" opacity="0.4" />
      </svg>
    </div>
  );
}
