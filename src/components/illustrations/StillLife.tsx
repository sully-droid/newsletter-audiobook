// Editorial still-life vignette: vase with flowers, stack of newsletters, candle.
// Sits opposite the cat on the landing page.
export function StillLife({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 480"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="A still life with flowers, a stack of newsletters, and a candle"
      className={className}
    >
      <defs>
        <linearGradient id="vase" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#e8754c" />
          <stop offset="100%" stopColor="#c14d22" />
        </linearGradient>
      </defs>

      {/* Soft shadow */}
      <ellipse cx="160" cy="430" rx="130" ry="12" fill="#1f1a14" opacity="0.08" />

      {/* Shelf */}
      <rect
        x="20"
        y="380"
        width="280"
        height="40"
        rx="2"
        fill="#d4b483"
        stroke="#1f1a14"
        strokeWidth="2.5"
      />
      <line
        x1="20"
        y1="388"
        x2="300"
        y2="388"
        stroke="#1f1a14"
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* Picture frame in the back */}
      <g>
        <rect
          x="46"
          y="92"
          width="120"
          height="160"
          rx="4"
          fill="#fbf7ee"
          stroke="#1f1a14"
          strokeWidth="2.5"
        />
        <rect
          x="58"
          y="104"
          width="96"
          height="136"
          fill="#f5efe3"
          stroke="#1f1a14"
          strokeWidth="1.5"
        />
        {/* Abstract artwork inside frame */}
        <circle cx="86" cy="138" r="14" fill="#cc4477" />
        <rect x="112" y="124" width="32" height="20" fill="#1c2a5e" />
        <path
          d="M 70 180 q 16 -20 32 0 q 16 20 32 0"
          stroke="#5f8a4e"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="130" cy="210" r="8" fill="#f1bf3a" />
        <rect x="74" y="200" width="22" height="22" fill="#6e9bd1" />
      </g>

      {/* Vase with flowers */}
      <g>
        {/* Flowers — stems first, then blossoms on top */}
        <path
          d="M 220 200 q -2 -34 -8 -64"
          stroke="#5f8a4e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 232 200 q 2 -42 4 -82"
          stroke="#5f8a4e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 248 200 q 6 -28 16 -56"
          stroke="#5f8a4e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 244 200 q 0 -30 -12 -50"
          stroke="#5f8a4e"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <path
          d="M 232 156 q -8 -2 -12 4 q 8 2 12 -4"
          fill="#5f8a4e"
          stroke="#1f1a14"
          strokeWidth="1.5"
        />
        <path
          d="M 240 168 q 8 -2 12 4 q -8 2 -12 -4"
          fill="#5f8a4e"
          stroke="#1f1a14"
          strokeWidth="1.5"
        />

        {/* Lily-style blossoms */}
        <g transform="translate(212, 130)">
          <path
            d="M 0 0 q -10 -10 -4 -18 q 6 -2 8 6 q 2 -10 10 -8 q 4 8 -4 16 q 8 0 8 8 q -8 4 -14 -2 q 0 8 -8 4 q -4 -4 4 -6 z"
            fill="#e8754c"
            stroke="#1f1a14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="2" cy="0" r="2" fill="#1f1a14" />
        </g>
        <g transform="translate(236, 110)">
          <path
            d="M 0 0 q -10 -10 -4 -18 q 6 -2 8 6 q 2 -10 10 -8 q 4 8 -4 16 q 8 0 8 8 q -8 4 -14 -2 q 0 8 -8 4 q -4 -4 4 -6 z"
            fill="#e8754c"
            stroke="#1f1a14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="2" cy="0" r="2" fill="#1f1a14" />
        </g>
        <g transform="translate(258, 138)">
          <path
            d="M 0 0 q -10 -10 -4 -18 q 6 -2 8 6 q 2 -10 10 -8 q 4 8 -4 16 q 8 0 8 8 q -8 4 -14 -2 q 0 8 -8 4 q -4 -4 4 -6 z"
            fill="#cc4477"
            stroke="#1f1a14"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <circle cx="2" cy="0" r="2" fill="#1f1a14" />
        </g>

        {/* Vase body */}
        <path
          d="M 200 200 q 8 14 0 28 q -8 14 0 28 q 8 14 0 28 q 0 22 30 22 q 30 0 30 -22 q -8 -14 0 -28 q 8 -14 0 -28 q -8 -14 0 -28 z"
          fill="url(#vase)"
          stroke="#1f1a14"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        {/* Vase rim */}
        <ellipse
          cx="230"
          cy="202"
          rx="30"
          ry="6"
          fill="#c14d22"
          stroke="#1f1a14"
          strokeWidth="2"
        />
        {/* Sparkles on vase */}
        <path d="M 220 232 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" fill="#fbf7ee" opacity="0.9" />
      </g>

      {/* Stack of newsletter "books" on the shelf */}
      <g>
        <rect
          x="50"
          y="350"
          width="100"
          height="14"
          rx="1"
          fill="#1c2a5e"
          stroke="#1f1a14"
          strokeWidth="2"
        />
        <text
          x="68"
          y="362"
          fontSize="8"
          fontFamily="serif"
          fill="#fbf7ee"
          letterSpacing="2"
        >
          NEWSLETTER
        </text>
        <rect
          x="46"
          y="336"
          width="108"
          height="14"
          rx="1"
          fill="#f1bf3a"
          stroke="#1f1a14"
          strokeWidth="2"
        />
        <text
          x="68"
          y="348"
          fontSize="8"
          fontFamily="serif"
          fill="#1f1a14"
          letterSpacing="2"
        >
          ESSAYS
        </text>
        <rect
          x="54"
          y="322"
          width="92"
          height="14"
          rx="1"
          fill="#cc4477"
          stroke="#1f1a14"
          strokeWidth="2"
        />
        <text
          x="76"
          y="334"
          fontSize="8"
          fontFamily="serif"
          fill="#fbf7ee"
          letterSpacing="2"
        >
          WEEKLY
        </text>
      </g>

      {/* Candle on the right */}
      <g>
        {/* Flame */}
        <path
          d="M 280 268 q -4 -10 0 -16 q 4 6 0 16 z"
          fill="#f1bf3a"
          stroke="#e8754c"
          strokeWidth="1.5"
        />
        <line
          x1="280"
          y1="268"
          x2="280"
          y2="275"
          stroke="#1f1a14"
          strokeWidth="1.5"
        />
        {/* Candle */}
        <rect
          x="272"
          y="275"
          width="16"
          height="60"
          fill="#fbf7ee"
          stroke="#1f1a14"
          strokeWidth="2"
        />
        {/* Holder */}
        <path
          d="M 266 335 l 6 -4 l 16 0 l 6 4 l -4 12 l -20 0 z"
          fill="#cc4477"
          stroke="#1f1a14"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <line
          x1="266"
          y1="335"
          x2="294"
          y2="335"
          stroke="#1f1a14"
          strokeWidth="1.5"
        />
      </g>

      {/* Sparkles for warmth */}
      <g opacity="0.7">
        <path d="M 196 90 l 2 -6 l 2 6 l 6 2 l -6 2 l -2 6 l -2 -6 l -6 -2 z" fill="#f1bf3a" />
        <path d="M 30 280 l 2 -5 l 2 5 l 5 2 l -5 2 l -2 5 l -2 -5 l -5 -2 z" fill="#cc4477" />
      </g>
    </svg>
  );
}
