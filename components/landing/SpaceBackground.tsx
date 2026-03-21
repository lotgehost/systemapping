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
          {/* Atmosphere glow */}
          <radialGradient id="atmoGlow" cx="720" cy="1760" r="1130" gradientUnits="userSpaceOnUse">
            <stop offset="90%"   stopColor="transparent" />
            <stop offset="93%"   stopColor="#1a5a9a" stopOpacity="0.32" />
            <stop offset="95.5%" stopColor="#5aaadd" stopOpacity="0.9" />
            <stop offset="97%"   stopColor="#88ccff" stopOpacity="0.65" />
            <stop offset="98.5%" stopColor="#4488aa" stopOpacity="0.25" />
            <stop offset="100%"  stopColor="transparent" />
          </radialGradient>

          {/* Earth body */}
          <radialGradient id="earthBody" cx="620" cy="1520" r="820" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#4e8ec8" />
            <stop offset="40%"  stopColor="#2462a4" />
            <stop offset="100%" stopColor="#0c1e3e" />
          </radialGradient>

          {/* Cloud gradients — center opaque, edge fully transparent */}
          <radialGradient id="cA" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ddeeff" stopOpacity="0.60" />
            <stop offset="55%"  stopColor="#ddeeff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#ddeeff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cB" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#eef6ff" stopOpacity="0.55" />
            <stop offset="50%"  stopColor="#eef6ff" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#eef6ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cC" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#c8dff5" stopOpacity="0.40" />
            <stop offset="60%"  stopColor="#c8dff5" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c8dff5" stopOpacity="0" />
          </radialGradient>
          {/* Haze band gradient */}
          <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#a8d4f0" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#a8d4f0" stopOpacity="0" />
          </linearGradient>

          {/* Earth clip */}
          <clipPath id="earthClip">
            <circle cx="720" cy="1760" r="1100" />
          </clipPath>
        </defs>

        {/* Deep space */}
        <rect width="1440" height="900" fill="#000308" />

        {/* Stars */}
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="white" opacity={s.opacity} />
        ))}

        {/* 4-point sparkle accents */}
        <path d="M290,162 L292,154 L294,162 L302,164 L294,166 L292,174 L290,166 L282,164Z" fill="white" opacity="0.72" />
        <path d="M1110,105 L1111.4,100 L1112.8,105 L1118,106.4 L1112.8,107.8 L1111.4,113 L1110,107.8 L1105,106.4Z" fill="white" opacity="0.65" />
        <path d="M182,374 L183,370 L184,374 L188,375 L184,376 L183,380 L182,376 L178,375Z" fill="white" opacity="0.52" />
        <path d="M1040,310 L1040.8,307 L1041.6,310 L1044.6,310.8 L1041.6,311.6 L1040.8,314.6 L1040,311.6 L1037,310.8Z" fill="white" opacity="0.45" />

        {/* Earth body */}
        <circle cx="720" cy="1760" r="1100" fill="url(#earthBody)" />

        {/* Earth surface — gradient clouds spread across full visible area */}
        <g clipPath="url(#earthClip)">
          {/* Atmosphere-surface haze band at the very top */}
          <rect x="0" y="650" width="1440" height="70" fill="url(#haze)" />

          {/* ── Row 1: near horizon y≈690–720 ── */}
          <ellipse cx="80"   cy="700" rx="280" ry="80"  fill="url(#cC)" />
          <ellipse cx="480"  cy="688" rx="340" ry="92"  fill="url(#cC)" />
          <ellipse cx="900"  cy="695" rx="310" ry="85"  fill="url(#cC)" />
          <ellipse cx="1300" cy="704" rx="290" ry="82"  fill="url(#cC)" />

          <ellipse cx="160"  cy="696" rx="210" ry="58"  fill="url(#cA)" />
          <ellipse cx="510"  cy="684" rx="250" ry="62"  fill="url(#cA)" />
          <ellipse cx="840"  cy="690" rx="230" ry="60"  fill="url(#cA)" />
          <ellipse cx="1140" cy="698" rx="215" ry="58"  fill="url(#cA)" />
          <ellipse cx="1390" cy="692" rx="190" ry="55"  fill="url(#cA)" />

          <ellipse cx="210"  cy="692" rx="120" ry="32"  fill="url(#cB)" />
          <ellipse cx="560"  cy="680" rx="138" ry="30"  fill="url(#cB)" />
          <ellipse cx="870"  cy="686" rx="125" ry="31"  fill="url(#cB)" />
          <ellipse cx="1175" cy="694" rx="112" ry="29"  fill="url(#cB)" />

          {/* ── Row 2: mid y≈740–770 ── */}
          <ellipse cx="0"    cy="755" rx="260" ry="78"  fill="url(#cC)" />
          <ellipse cx="360"  cy="748" rx="320" ry="88"  fill="url(#cC)" />
          <ellipse cx="760"  cy="755" rx="300" ry="84"  fill="url(#cC)" />
          <ellipse cx="1160" cy="748" rx="285" ry="80"  fill="url(#cC)" />
          <ellipse cx="1440" cy="758" rx="260" ry="76"  fill="url(#cC)" />

          <ellipse cx="60"   cy="752" rx="200" ry="56"  fill="url(#cA)" />
          <ellipse cx="380"  cy="744" rx="240" ry="60"  fill="url(#cA)" />
          <ellipse cx="680"  cy="750" rx="225" ry="58"  fill="url(#cA)" />
          <ellipse cx="980"  cy="744" rx="210" ry="56"  fill="url(#cA)" />
          <ellipse cx="1270" cy="752" rx="200" ry="55"  fill="url(#cA)" />

          <ellipse cx="100"  cy="748" rx="115" ry="30"  fill="url(#cB)" />
          <ellipse cx="425"  cy="740" rx="130" ry="29"  fill="url(#cB)" />
          <ellipse cx="730"  cy="746" rx="118" ry="30"  fill="url(#cB)" />
          <ellipse cx="1030" cy="740" rx="110" ry="28"  fill="url(#cB)" />
          <ellipse cx="1310" cy="748" rx="108" ry="28"  fill="url(#cB)" />

          {/* ── Row 3: lower y≈800–830 ── */}
          <ellipse cx="180"  cy="812" rx="300" ry="82"  fill="url(#cC)" />
          <ellipse cx="580"  cy="806" rx="330" ry="88"  fill="url(#cC)" />
          <ellipse cx="1000" cy="814" rx="305" ry="82"  fill="url(#cC)" />
          <ellipse cx="1380" cy="808" rx="270" ry="78"  fill="url(#cC)" />

          <ellipse cx="120"  cy="808" rx="215" ry="58"  fill="url(#cA)" />
          <ellipse cx="460"  cy="800" rx="245" ry="62"  fill="url(#cA)" />
          <ellipse cx="780"  cy="806" rx="230" ry="60"  fill="url(#cA)" />
          <ellipse cx="1090" cy="800" rx="215" ry="58"  fill="url(#cA)" />
          <ellipse cx="1360" cy="808" rx="195" ry="55"  fill="url(#cA)" />

          <ellipse cx="180"  cy="804" rx="122" ry="31"  fill="url(#cB)" />
          <ellipse cx="510"  cy="796" rx="135" ry="30"  fill="url(#cB)" />
          <ellipse cx="830"  cy="802" rx="120" ry="30"  fill="url(#cB)" />
          <ellipse cx="1130" cy="796" rx="112" ry="29"  fill="url(#cB)" />

          {/* ── Row 4: bottom y≈858–880 ── */}
          <ellipse cx="300"  cy="864" rx="310" ry="80"  fill="url(#cC)" />
          <ellipse cx="750"  cy="858" rx="340" ry="86"  fill="url(#cC)" />
          <ellipse cx="1200" cy="866" rx="300" ry="80"  fill="url(#cC)" />

          <ellipse cx="240"  cy="860" rx="220" ry="58"  fill="url(#cA)" />
          <ellipse cx="600"  cy="854" rx="248" ry="62"  fill="url(#cA)" />
          <ellipse cx="940"  cy="860" rx="232" ry="60"  fill="url(#cA)" />
          <ellipse cx="1260" cy="854" rx="215" ry="57"  fill="url(#cA)" />

          <ellipse cx="290"  cy="856" rx="125" ry="31"  fill="url(#cB)" />
          <ellipse cx="650"  cy="850" rx="138" ry="30"  fill="url(#cB)" />
          <ellipse cx="990"  cy="856" rx="122" ry="30"  fill="url(#cB)" />
          <ellipse cx="1295" cy="850" rx="112" ry="29"  fill="url(#cB)" />
        </g>

        {/* Atmosphere glow at horizon */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#atmoGlow)" />
      </svg>
    </div>
  );
}
