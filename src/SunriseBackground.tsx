export default function SunriseBackground() {
  return (
    <svg
      className="bg-scene"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#070b14" />
          <stop offset="45%" stopColor="#16213a" />
          <stop offset="72%" stopColor="#7a4a3d" />
          <stop offset="100%" stopColor="#f4b860" />
        </linearGradient>

        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4b860" />
          <stop offset="20%" stopColor="#6a4a3a" />
          <stop offset="100%" stopColor="#060a12" />
        </linearGradient>

        <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff3d6" stopOpacity="0.95" />
          <stop offset="40%" stopColor="#f4b860" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#f4b860" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0c1422" />
          <stop offset="100%" stopColor="#070b14" />
        </linearGradient>
      </defs>

      {/* sky */}
      <rect x="0" y="0" width="1600" height="470" fill="url(#sky)" />

      {/* lake */}
      <rect x="0" y="470" width="1600" height="430" fill="url(#lake)" />

      {/* sun glow + disc, straddling the horizon */}
      <circle cx="800" cy="470" r="260" fill="url(#sunGlow)" />
      <circle cx="800" cy="470" r="68" fill="#fff3d6" opacity="0.9" />

      {/* distant hill silhouette */}
      <path
        d="M0,500 C220,430 380,460 560,440 C760,415 880,455 1080,430 C1280,408 1420,445 1600,420 L1600,470 L0,470 Z"
        fill="url(#hill)"
        opacity="0.85"
      />

      {/* ripple lines on the lake, fading with distance */}
      <g stroke="#f4b860" strokeWidth="2" opacity="0.18">
        <line x1="560" y1="520" x2="1040" y2="520" />
        <line x1="520" y1="565" x2="1080" y2="565" />
        <line x1="600" y1="615" x2="1000" y2="615" />
      </g>

      {/* soft vignette so foreground text stays legible */}
      <rect x="0" y="0" width="1600" height="900" fill="#070b14" opacity="0.28" />
    </svg>
  );
}