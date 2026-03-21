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

        {/* Earth surface — gradient clouds that blend naturally */}
        <g clipPath="url(#earthClip)">
          {/* Atmosphere-surface haze band at the very top */}
          <rect x="0" y="650" width="1440" height="70" fill="url(#haze)" />

          {/* Large diffuse cloud masses — cC (blue-grey, deep/background) */}
          <ellipse cx="200"  cy="730" rx="320" ry="90"  fill="url(#cC)" />
          <ellipse cx="650"  cy="710" rx="380" ry="100" fill="url(#cC)" />
          <ellipse cx="1080" cy="725" rx="340" ry="88"  fill="url(#cC)" />
          <ellipse cx="1380" cy="715" rx="280" ry="80"  fill="url(#cC)" />

          {/* Mid cloud layer — cA (main cloud white-blue) */}
          <ellipse cx="120"  cy="718" rx="240" ry="65"  fill="url(#cA)" />
          <ellipse cx="440"  cy="696" rx="300" ry="72"  fill="url(#cA)" />
          <ellipse cx="750"  cy="708" rx="270" ry="68"  fill="url(#cA)" />
          <ellipse cx="1040" cy="700" rx="255" ry="66"  fill="url(#cA)" />
          <ellipse cx="1310" cy="712" rx="220" ry="62"  fill="url(#cA)" />

          {/* Second mid layer, offset horizontally for overlap */}
          <ellipse cx="300"  cy="738" rx="255" ry="60"  fill="url(#cA)" />
          <ellipse cx="600"  cy="745" rx="290" ry="58"  fill="url(#cA)" />
          <ellipse cx="920"  cy="738" rx="260" ry="60"  fill="url(#cA)" />
          <ellipse cx="1200" cy="742" rx="235" ry="58"  fill="url(#cA)" />

          {/* Bright cloud highlights — cB (brightest whites) */}
          <ellipse cx="155"  cy="712" rx="130" ry="36"  fill="url(#cB)" />
          <ellipse cx="480"  cy="690" rx="150" ry="34"  fill="url(#cB)" />
          <ellipse cx="790"  cy="702" rx="138" ry="35"  fill="url(#cB)" />
          <ellipse cx="1065" cy="694" rx="125" ry="33"  fill="url(#cB)" />
          <ellipse cx="1340" cy="706" rx="115" ry="32"  fill="url(#cB)" />
          <ellipse cx="340"  cy="732" rx="120" ry="30"  fill="url(#cB)" />
          <ellipse cx="650"  cy="740" rx="135" ry="30"  fill="url(#cB)" />
          <ellipse cx="960"  cy="734" rx="120" ry="31"  fill="url(#cB)" />
        </g>

        {/* Atmosphere glow at horizon */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#atmoGlow)" />
      </svg>
    </div>
  );
}
