// Cool cat reading a newsletter on a laptop with earbuds in.
// Editorial-illustration style: warm fills, dark line work, organic shapes.
export function CatReading({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A content cat in earbuds reading a newsletter on a laptop"
      className={className}
    >
      <defs>
        <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="2"
            seed="3"
          />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.07 0" />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <linearGradient id="catFur" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e8754c" />
          <stop offset="100%" stopColor="#c14d22" />
        </linearGradient>
      </defs>

      {/* Soft shadow behind the scene */}
      <ellipse cx="180" cy="430" rx="140" ry="14" fill="#1f1a14" opacity="0.08" />

      {/* Desk surface */}
      <rect
        x="20"
        y="370"
        width="320"
        height="48"
        rx="3"
        fill="#d4b483"
        stroke="#1f1a14"
        strokeWidth="2.5"
      />
      <line
        x1="20"
        y1="378"
        x2="340"
        y2="378"
        stroke="#1f1a14"
        strokeWidth="1.5"
        opacity="0.3"
      />
      <line
        x1="80"
        y1="370"
        x2="84"
        y2="418"
        stroke="#1f1a14"
        strokeWidth="1"
        opacity="0.25"
      />
      <line
        x1="200"
        y1="370"
        x2="206"
        y2="418"
        stroke="#1f1a14"
        strokeWidth="1"
        opacity="0.25"
      />
      <line
        x1="290"
        y1="370"
        x2="294"
        y2="418"
        stroke="#1f1a14"
        strokeWidth="1"
        opacity="0.25"
      />

      {/* Steaming coffee mug, top-left */}
      <g>
        <path
          d="M 50 305 q 4 -28 12 -38 q 6 -8 0 0 q -4 8 -2 18"
          stroke="#998d7c"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <path
          d="M 64 308 q 5 -24 14 -30"
          stroke="#998d7c"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          opacity="0.55"
        />
        <rect
          x="38"
          y="320"
          width="44"
          height="48"
          rx="4"
          fill="#fbf7ee"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />
        <path
          d="M 82 332 q 14 4 14 18 q 0 14 -14 18"
          fill="none"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />
        <rect
          x="38"
          y="320"
          width="44"
          height="6"
          fill="#5a3d1e"
          opacity="0.85"
        />
      </g>

      {/* The cat — body sitting upright behind the laptop */}
      <g>
        {/* Body (peeks above the laptop) */}
        <path
          d="M 110 220 q 0 -60 70 -60 q 70 0 70 60 q 0 30 -8 60 l -124 0 q -8 -30 -8 -60 z"
          fill="url(#catFur)"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />

        {/* Tabby stripes on body */}
        <path
          d="M 130 200 q 8 -6 16 0"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 215 200 q 8 -6 16 0"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 170 175 q 10 -4 20 0"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* White chest patch */}
        <path
          d="M 165 240 q 15 12 30 0 q 0 30 -15 36 q -15 -6 -15 -36 z"
          fill="#fbf7ee"
          stroke="#1f1a14"
          strokeWidth="2"
        />

        {/* Head */}
        <ellipse
          cx="180"
          cy="148"
          rx="62"
          ry="56"
          fill="url(#catFur)"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />

        {/* Tabby head stripes */}
        <path
          d="M 158 108 q 4 -6 8 -2"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 180 102 q 4 -6 8 -2"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />
        <path
          d="M 200 108 q 4 -6 8 -2"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Ears */}
        <path
          d="M 128 110 l -10 -42 l 36 22 z"
          fill="url(#catFur)"
          stroke="#1f1a14"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M 232 110 l 10 -42 l -36 22 z"
          fill="url(#catFur)"
          stroke="#1f1a14"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Inner ears */}
        <path
          d="M 132 105 l -4 -22 l 18 12 z"
          fill="#f4a583"
        />
        <path
          d="M 228 105 l 4 -22 l -18 12 z"
          fill="#f4a583"
        />

        {/* Eyes — closed/content */}
        <path
          d="M 150 150 q 8 -8 18 0"
          stroke="#1f1a14"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 192 150 q 8 -8 18 0"
          stroke="#1f1a14"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Nose */}
        <path
          d="M 174 168 l 6 6 l 6 -6 z"
          fill="#cc4477"
          stroke="#1f1a14"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Mouth */}
        <path
          d="M 180 174 l 0 6 q -4 4 -8 4"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 180 174 l 0 6 q 4 4 8 4"
          stroke="#1f1a14"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <path
          d="M 152 174 l -22 -4 M 152 180 l -22 6"
          stroke="#1f1a14"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M 208 174 l 22 -4 M 208 180 l 22 6"
          stroke="#1f1a14"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Earbuds — white pearl in each ear */}
        <circle cx="138" cy="108" r="7" fill="#fbf7ee" stroke="#1f1a14" strokeWidth="2" />
        <circle cx="222" cy="108" r="7" fill="#fbf7ee" stroke="#1f1a14" strokeWidth="2" />
        {/* Earbud cords trailing down behind the laptop */}
        <path
          d="M 137 115 q -4 30 -8 60 q -2 20 0 50"
          stroke="#1f1a14"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 223 115 q 4 30 8 60 q 2 20 0 50"
          stroke="#1f1a14"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Paws on the laptop */}
        <ellipse cx="130" cy="328" rx="20" ry="14" fill="url(#catFur)" stroke="#1f1a14" strokeWidth="2.5" />
        <ellipse cx="230" cy="328" rx="20" ry="14" fill="url(#catFur)" stroke="#1f1a14" strokeWidth="2.5" />
        {/* Toe lines */}
        <path d="M 122 332 q 2 -4 4 0 M 130 334 q 2 -4 4 0 M 138 332 q 2 -4 4 0"
          stroke="#1f1a14" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
        <path d="M 222 332 q 2 -4 4 0 M 230 334 q 2 -4 4 0 M 238 332 q 2 -4 4 0"
          stroke="#1f1a14" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.6" />
      </g>

      {/* Laptop */}
      <g>
        {/* Laptop base (closed wedge under the screen) */}
        <path
          d="M 80 360 l 16 -12 l 168 0 l 16 12 z"
          fill="#bdb4a5"
          stroke="#1f1a14"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <rect
          x="80"
          y="360"
          width="200"
          height="6"
          fill="#998d7c"
          stroke="#1f1a14"
          strokeWidth="2"
        />

        {/* Screen */}
        <rect
          x="96"
          y="252"
          width="168"
          height="100"
          rx="4"
          fill="#1c2a5e"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />
        <rect
          x="102"
          y="258"
          width="156"
          height="88"
          rx="2"
          fill="#fbf7ee"
        />

        {/* Newsletter content lines on screen */}
        <rect x="110" y="266" width="60" height="6" rx="1.5" fill="#1f1a14" />
        <rect x="110" y="280" width="140" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="288" width="138" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="296" width="132" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="304" width="120" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="318" width="80" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="326" width="100" height="3" rx="1" fill="#998d7c" />
        <rect x="110" y="334" width="60" height="3" rx="1" fill="#998d7c" />
        {/* Play button */}
        <circle cx="240" cy="328" r="9" fill="#e8754c" stroke="#1f1a14" strokeWidth="1.5" />
        <path d="M 237 324 l 0 8 l 7 -4 z" fill="#fbf7ee" />
      </g>

      {/* Tiny sparkles for warmth */}
      <g opacity="0.7">
        <path d="M 60 200 l 3 -8 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 z" fill="#f1bf3a" />
        <path d="M 310 180 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 z" fill="#f1bf3a" />
        <path d="M 295 280 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" fill="#cc4477" />
      </g>
    </svg>
  );
}
