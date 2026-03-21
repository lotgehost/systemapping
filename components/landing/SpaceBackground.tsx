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
          {/* Earth atmosphere glow */}
          <radialGradient id="earthGlow" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#1a6fd4" stopOpacity="0" />
            <stop offset="90%" stopColor="#4fa3e8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#7ec8f8" stopOpacity="0" />
          </radialGradient>
          {/* Earth sphere shading */}
          <radialGradient id="earthShade" cx="35%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#8ac8f0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#1a5fb4" stopOpacity="0" />
            <stop offset="100%" stopColor="#060d1f" stopOpacity="0.55" />
          </radialGradient>
          <clipPath id="earthClip">
            <circle cx="720" cy="1020" r="440" />
          </clipPath>
        </defs>

        {/* Atmosphere halo */}
        <circle cx="720" cy="1020" r="458" fill="url(#earthGlow)" />

        {/* Earth base ocean */}
        <circle cx="720" cy="1020" r="440" fill="#1a5fb4" />

        <g clipPath="url(#earthClip)">
          {/* Deep ocean variation */}
          <ellipse cx="580" cy="920" rx="280" ry="220" fill="#1e6bbf" opacity="0.7" />
          <ellipse cx="860" cy="980" rx="200" ry="180" fill="#1560ae" opacity="0.5" />

          {/* Eurasia */}
          <path d="M560,640 C590,625 640,620 680,628 C720,636 755,640 780,650 C810,662 825,672 820,688 C815,702 800,710 778,715 C755,720 730,718 710,712 C690,706 672,708 655,718 C638,728 625,730 610,722 C595,714 585,700 580,685 C575,668 572,655 560,640Z" fill="#4a8f3f" />
          {/* Africa */}
          <path d="M630,720 C645,712 662,710 675,718 C690,728 695,745 692,762 C689,778 680,790 668,796 C655,802 640,798 632,788 C624,778 620,762 620,747 C620,733 622,726 630,720Z" fill="#5a9a44" />
          {/* Americas */}
          <path d="M480,660 C495,650 512,648 525,655 C538,662 545,675 542,690 C539,705 528,714 514,716 C500,718 488,710 482,698 C476,686 474,670 480,660Z" fill="#4a8f3f" />
          <path d="M455,715 C468,708 480,710 488,720 C496,732 494,748 484,756 C474,764 460,760 453,750 C446,740 446,724 455,715Z" fill="#4a8f3f" />
          {/* Australia */}
          <path d="M860,780 C872,774 886,774 896,782 C906,790 908,804 902,814 C896,822 882,824 870,818 C858,812 854,798 860,780Z" fill="#5a9a44" />

          {/* Antarctica ice */}
          <path d="M530,980 C580,968 650,964 720,966 C790,968 860,972 920,982 C960,990 980,1002 970,1012 C955,1024 900,1022 840,1018 C780,1014 720,1014 660,1016 C600,1018 545,1016 518,1006 C505,1000 508,988 530,980Z" fill="rgba(220,235,255,0.92)" />

          {/* North pole ice */}
          <path d="M600,630 C635,618 685,614 730,618 C772,622 808,632 810,642 C812,652 782,658 745,658 C708,658 670,655 638,650 C610,645 592,640 600,630Z" fill="rgba(220,235,255,0.88)" />

          {/* Cloud band 1 */}
          <path d="M540,690 C575,683 630,680 680,685 C728,690 770,698 780,708 C788,716 775,722 748,724 C718,726 672,722 630,718 C588,714 555,710 542,702 C532,696 532,692 540,690Z" fill="rgba(255,255,255,0.55)" />
          {/* Cloud band 2 */}
          <path d="M620,760 C658,753 710,750 755,756 C795,762 820,772 818,782 C816,790 792,794 758,792 C722,790 680,786 645,782 C614,778 598,772 606,764 C610,760 616,758 620,760Z" fill="rgba(255,255,255,0.45)" />
          {/* Cloud wisps */}
          <path d="M760,720 C785,715 812,714 830,720 C845,726 848,734 838,738 C826,742 800,740 778,736 C758,732 748,724 760,720Z" fill="rgba(255,255,255,0.5)" />
          <path d="M550,830 C578,824 610,822 636,828 C656,833 660,842 648,846 C633,850 605,848 580,844 C558,840 542,834 550,830Z" fill="rgba(255,255,255,0.4)" />

          {/* Sphere shading overlay */}
          <circle cx="720" cy="1020" r="440" fill="url(#earthShade)" />
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
