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
  // Stars only in the dark space area above Earth horizon (~y=660)
  const stars = Array.from({ length: 200 }, () => ({
    x: rx() * 1440,
    y: ry() * 640,
    r: 0.25 + rr() * 1.3,
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
        <defs>
          {/* Atmosphere glow — radial from Earth center (720, 1760) */}
          <radialGradient id="atmoGlow" cx="720" cy="1760" r="1130" gradientUnits="userSpaceOnUse">
            <stop offset="90%"   stopColor="transparent" />
            <stop offset="93%"   stopColor="#1a5a9a" stopOpacity="0.32" />
            <stop offset="95.5%" stopColor="#5aaadd" stopOpacity="0.9" />
            <stop offset="97%"   stopColor="#88ccff" stopOpacity="0.65" />
            <stop offset="98.5%" stopColor="#4488aa" stopOpacity="0.25" />
            <stop offset="100%"  stopColor="transparent" />
          </radialGradient>

          {/* Earth surface — lit from upper-left */}
          <radialGradient id="earthBody" cx="620" cy="1520" r="820" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#4e8ec8" />
            <stop offset="40%"  stopColor="#2462a4" />
            <stop offset="100%" stopColor="#0c1e3e" />
          </radialGradient>

          {/* Clip: Earth disk */}
          <clipPath id="earthClip">
            <circle cx="720" cy="1760" r="1100" />
          </clipPath>
        </defs>

        {/* ── Deep space ── */}
        <rect width="1440" height="900" fill="#000308" />

        {/* ── Stars ── */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity} />
        ))}

        {/* 4-point sparkle accents */}
        <path d="M290,162 L292,154 L294,162 L302,164 L294,166 L292,174 L290,166 L282,164Z" fill="white" opacity="0.72" />
        <path d="M1110,105 L1111.4,100 L1112.8,105 L1118,106.4 L1112.8,107.8 L1111.4,113 L1110,107.8 L1105,106.4Z" fill="white" opacity="0.65" />
        <path d="M182,374 L183,370 L184,374 L188,375 L184,376 L183,380 L182,376 L178,375Z" fill="white" opacity="0.52" />
        <path d="M1040,310 L1040.8,307 L1041.6,310 L1044.6,310.8 L1041.6,311.6 L1040.8,314.6 L1040,311.6 L1037,310.8Z" fill="white" opacity="0.45" />

        {/* ── Earth body ── */}
        <circle cx="720" cy="1760" r="1100" fill="url(#earthBody)" />

        {/* ── Earth surface details (clouds, ocean bands) ── */}
        <g clipPath="url(#earthClip)">
          {/* Upper haze where atmosphere meets surface */}
          <rect x="0" y="650" width="1440" height="50" fill="rgba(120,185,235,0.16)" />
          <rect x="0" y="650" width="1440" height="25" fill="rgba(165,215,248,0.12)" />

          {/* Cloud bands */}
          <ellipse cx="150"  cy="722" rx="235" ry="56" fill="rgba(215,233,252,0.50)" />
          <ellipse cx="490"  cy="692" rx="295" ry="53" fill="rgba(218,236,252,0.52)" />
          <ellipse cx="820"  cy="704" rx="262" ry="55" fill="rgba(215,233,252,0.46)" />
          <ellipse cx="1130" cy="716" rx="225" ry="51" fill="rgba(218,236,252,0.44)" />
          <ellipse cx="1370" cy="702" rx="185" ry="49" fill="rgba(215,233,252,0.42)" />

          {/* Brighter cloud highlights */}
          <ellipse cx="195"  cy="718" rx="115" ry="29" fill="rgba(240,250,255,0.44)" />
          <ellipse cx="558"  cy="688" rx="132" ry="27" fill="rgba(240,250,255,0.42)" />
          <ellipse cx="890"  cy="698" rx="118" ry="28" fill="rgba(240,250,255,0.40)" />
          <ellipse cx="1165" cy="712" rx="104" ry="26" fill="rgba(240,250,255,0.38)" />

          {/* Second cloud layer */}
          <ellipse cx="340"  cy="742" rx="205" ry="44" fill="rgba(215,233,252,0.36)" />
          <ellipse cx="698"  cy="750" rx="245" ry="43" fill="rgba(215,233,252,0.33)" />
          <ellipse cx="1055" cy="744" rx="215" ry="44" fill="rgba(215,233,252,0.37)" />

          {/* Ocean depth variation */}
          <ellipse cx="480"  cy="700" rx="380" ry="90" fill="rgba(80,150,205,0.12)" />
          <ellipse cx="960"  cy="710" rx="310" ry="80" fill="rgba(60,130,185,0.10)" />
        </g>

        {/* ── Atmosphere glow at horizon ── */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#atmoGlow)" />

        {/* ── Astronaut floating in dark space ── */}
        <g transform="rotate(-14, 440, 348)" opacity="0.88">
          {/* Helmet */}
          <circle cx="440" cy="328" r="14" fill="#eceae4" />
          {/* Visor — golden */}
          <ellipse cx="441" cy="328" rx="9" ry="7.5" fill="#b8820a" />
          <ellipse cx="440" cy="326" rx="7" ry="5.5" fill="#d4a020" opacity="0.52" />
          {/* Visor glare */}
          <ellipse cx="436" cy="323" rx="3" ry="2.5" fill="rgba(255,240,180,0.35)" />
          {/* Torso */}
          <rect x="427" y="340" width="26" height="24" rx="5" fill="#eceae4" />
          {/* PLSS backpack */}
          <rect x="429" y="342" width="18" height="18" rx="2" fill="#e0ddd6" />
          {/* Chest details */}
          <rect x="432" y="344" width="12" height="4" rx="1" fill="#cccccc" opacity="0.6" />
          <rect x="433" y="350" width="10" height="3" rx="1" fill="#cccccc" opacity="0.5" />
          {/* Left arm */}
          <rect x="410" y="343" width="18" height="7" rx="3.5" fill="#eceae4" transform="rotate(-15 419 346)" />
          {/* Right arm + handheld tool */}
          <rect x="452" y="342" width="18" height="7" rx="3.5" fill="#eceae4" transform="rotate(20 461 345)" />
          <rect x="468" y="338" width="8" height="4" rx="2" fill="#c8c8c4" />
          <rect x="474" y="334" width="4" height="10" rx="1.5" fill="#b0b0ac" />
          {/* Left leg */}
          <rect x="428" y="362" width="9" height="15" rx="4" fill="#eceae4" transform="rotate(8 432 369)" />
          {/* Right leg */}
          <rect x="439" y="362" width="9" height="15" rx="4" fill="#eceae4" transform="rotate(-6 443 369)" />
          {/* Suit seam lines */}
          <line x1="440" y1="341" x2="440" y2="364" stroke="#d8d5ce" strokeWidth="0.8" opacity="0.5" />
        </g>
      </svg>
    </div>
  );
}
