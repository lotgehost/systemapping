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
          <path d="M650,640 C680,625 730,620 770,628 C810,636 845,640 870,650 C900,662 915,672 910,688 C905,702 890,710 868,715 C845,720 820,718 800,712 C780,706 762,708 745,718 C728,728 715,730 700,722 C685,714 675,700 670,685 C665,668 662,655 650,640Z" fill="#4a8f3f" />
          {/* Africa */}
          <path d="M720,720 C735,712 752,710 765,718 C780,728 785,745 782,762 C779,778 770,790 758,796 C745,802 730,798 722,788 C714,778 710,762 710,747 C710,733 712,726 720,720Z" fill="#5a9a44" />
          {/* Americas */}
          <path d="M530,665 C545,655 562,653 575,660 C588,667 595,680 592,695 C589,710 578,719 564,721 C550,723 538,715 532,703 C526,691 524,675 530,665Z" fill="#4a8f3f" />
          <path d="M505,720 C518,713 530,715 538,725 C546,737 544,753 534,761 C524,769 510,765 503,755 C496,745 496,729 505,720Z" fill="#4a8f3f" />
          {/* Australia */}
          <path d="M920,780 C932,774 946,774 956,782 C966,790 968,804 962,814 C956,822 942,824 930,818 C918,812 914,798 920,780Z" fill="#5a9a44" />

          {/* Antarctica ice */}
          <path d="M560,980 C610,968 680,964 750,966 C820,968 890,972 950,982 C990,990 1010,1002 1000,1012 C985,1024 930,1022 870,1018 C810,1014 750,1014 690,1016 C630,1018 575,1016 548,1006 C535,1000 538,988 560,980Z" fill="rgba(220,235,255,0.92)" />

          {/* North pole ice */}
          <path d="M670,630 C705,618 755,614 800,618 C842,622 878,632 880,642 C882,652 852,658 815,658 C778,658 740,655 708,650 C680,645 662,640 670,630Z" fill="rgba(220,235,255,0.88)" />

          {/* Cloud band 1 */}
          <path d="M620,690 C655,683 710,680 760,685 C808,690 850,698 860,708 C868,716 855,722 828,724 C798,726 752,722 710,718 C668,714 635,710 622,702 C612,696 612,692 620,690Z" fill="rgba(255,255,255,0.55)" />
          {/* Cloud band 2 */}
          <path d="M700,760 C738,753 790,750 835,756 C875,762 900,772 898,782 C896,790 872,794 838,792 C802,790 760,786 725,782 C694,778 678,772 686,764 C690,760 696,758 700,760Z" fill="rgba(255,255,255,0.45)" />
          {/* Cloud wisps */}
          <path d="M840,720 C865,715 892,714 910,720 C925,726 928,734 918,738 C906,742 880,740 858,736 C838,732 828,724 840,720Z" fill="rgba(255,255,255,0.5)" />
          <path d="M630,830 C658,824 690,822 716,828 C736,833 740,842 728,846 C713,850 685,848 660,844 C638,840 622,834 630,830Z" fill="rgba(255,255,255,0.4)" />

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
