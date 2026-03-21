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
            <circle cx="720" cy="1040" r="440" />
          </clipPath>
        </defs>

        {/* Atmosphere halo */}
        <circle cx="720" cy="1040" r="460" fill="url(#earthGlow)" />

        {/* Earth base ocean */}
        <circle cx="720" cy="1040" r="440" fill="#1a5fb4" />

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
          <circle cx="720" cy="1040" r="440" fill="url(#earthShade)" />
        </g>

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
