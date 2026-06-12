export function HeroIllustration() {
  return (
    <svg
      viewBox="0 0 500 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="h-full w-full"
    >
      <defs>
        <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.25 280 / 0.4)" />
          <stop offset="100%" stopColor="oklch(0.6 0.25 280 / 0.1)" />
        </linearGradient>
        <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.2 160 / 0.3)" />
          <stop offset="100%" stopColor="oklch(0.6 0.2 160 / 0.05)" />
        </linearGradient>
        <linearGradient id="grad3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.22 320 / 0.3)" />
          <stop offset="100%" stopColor="oklch(0.6 0.22 320 / 0.05)" />
        </linearGradient>
        <linearGradient id="grad4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.25 280 / 0.6)" />
          <stop offset="100%" stopColor="oklch(0.4 0.15 280 / 0.2)" />
        </linearGradient>
        <linearGradient id="bubbleLeft" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.25 280 / 0.25)" />
          <stop offset="100%" stopColor="oklch(0.6 0.25 280 / 0.08)" />
        </linearGradient>
        <linearGradient id="bubbleRight" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.6 0.2 160 / 0.2)" />
          <stop offset="100%" stopColor="oklch(0.6 0.2 160 / 0.06)" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.6 0.25 280 / 0.15)" />
          <stop offset="100%" stopColor="oklch(0.6 0.25 280 / 0)" />
        </radialGradient>
        <filter id="glowFilter">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <circle cx="250" cy="210" r="160" fill="url(#glow)" />

      {/* Left chat bubble */}
      <g className="animate-float" style={{ animationDuration: "4s" }}>
        <rect
          x="40"
          y="160"
          width="160"
          height="72"
          rx="16"
          fill="url(#bubbleLeft)"
          stroke="oklch(0.6 0.25 280 / 0.2)"
          strokeWidth="1"
        />
        <circle cx="56" cy="196" r="4" fill="oklch(0.6 0.25 280 / 0.5)" />
        <rect x="68" y="181" width="80" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.3)" />
        <rect x="68" y="193" width="100" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.2)" />
        <rect x="68" y="205" width="60" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.15)" />
        <path d="M200 232 l-16 -16 h-8 z" fill="url(#bubbleLeft)" stroke="oklch(0.6 0.25 280 / 0.2)" strokeWidth="1" />
      </g>

      {/* Right chat bubble */}
      <g className="animate-float" style={{ animationDuration: "5s", animationDelay: "0.5s" }}>
        <rect
          x="300"
          y="120"
          width="170"
          height="80"
          rx="16"
          fill="url(#bubbleRight)"
          stroke="oklch(0.6 0.2 160 / 0.2)"
          strokeWidth="1"
        />
        <circle cx="316" cy="160" r="4" fill="oklch(0.6 0.2 160 / 0.5)" />
        <rect x="328" y="145" width="90" height="5" rx="2.5" fill="oklch(0.6 0.2 160 / 0.3)" />
        <rect x="328" y="157" width="110" height="5" rx="2.5" fill="oklch(0.6 0.2 160 / 0.2)" />
        <rect x="328" y="169" width="70" height="5" rx="2.5" fill="oklch(0.6 0.2 160 / 0.15)" />
        <rect x="328" y="181" width="50" height="5" rx="2.5" fill="oklch(0.6 0.2 160 / 0.1)" />
        <path d="M300 200 l16 -16 h8 z" fill="url(#bubbleRight)" stroke="oklch(0.6 0.2 160 / 0.2)" strokeWidth="1" />
      </g>

      {/* Bottom chat bubble */}
      <g className="animate-float" style={{ animationDuration: "4.5s", animationDelay: "1s" }}>
        <rect
          x="100"
          y="280"
          width="180"
          height="65"
          rx="16"
          fill="url(#grad1)"
          stroke="oklch(0.6 0.25 280 / 0.15)"
          strokeWidth="1"
        />
        <rect x="116" y="298" width="100" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.25)" />
        <rect x="116" y="310" width="130" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.15)" />
        <rect x="116" y="322" width="80" height="5" rx="2.5" fill="oklch(0.6 0.25 280 / 0.1)" />
        <path d="M280 345 l-16 -16 h-8 z" fill="url(#grad1)" stroke="oklch(0.6 0.25 280 / 0.15)" strokeWidth="1" />
      </g>

      {/* Central brain/network node */}
      <g filter="url(#glowFilter)">
        <circle cx="250" cy="200" r="36" fill="url(#grad4)" stroke="oklch(0.6 0.25 280 / 0.3)" strokeWidth="1.5" />
        <path
          d="M235 192 Q250 178 265 192 Q270 200 265 208 Q250 222 235 208 Q230 200 235 192Z"
          fill="oklch(0.6 0.25 280 / 0.3)"
        />
        <circle cx="242" cy="197" r="3" fill="oklch(0.6 0.25 280 / 0.6)" />
        <circle cx="258" cy="197" r="3" fill="oklch(0.6 0.25 280 / 0.6)" />
        <path d="M245 206 Q250 210 255 206" stroke="oklch(0.6 0.25 280 / 0.5)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </g>

      {/* Satellite nodes */}
      <circle cx="200" cy="155" r="6" fill="oklch(0.6 0.2 160 / 0.4)" stroke="oklch(0.6 0.2 160 / 0.2)" strokeWidth="1" />
      <circle cx="310" cy="175" r="5" fill="oklch(0.6 0.22 320 / 0.4)" stroke="oklch(0.6 0.22 320 / 0.2)" strokeWidth="1" />
      <circle cx="180" cy="270" r="5" fill="oklch(0.6 0.25 280 / 0.3)" stroke="oklch(0.6 0.25 280 / 0.15)" strokeWidth="1" />
      <circle cx="330" cy="260" r="6" fill="oklch(0.6 0.2 160 / 0.3)" stroke="oklch(0.6 0.2 160 / 0.15)" strokeWidth="1" />
      <circle cx="280" cy="300" r="4" fill="oklch(0.6 0.22 320 / 0.3)" stroke="oklch(0.6 0.22 320 / 0.15)" strokeWidth="1" />

      {/* Connection lines */}
      <line x1="250" y1="164" x2="200" y2="155" stroke="oklch(0.6 0.2 160 / 0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="286" y1="200" x2="310" y2="175" stroke="oklch(0.6 0.22 320 / 0.15)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="230" y1="230" x2="180" y2="270" stroke="oklch(0.6 0.25 280 / 0.12)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="270" y1="230" x2="330" y2="260" stroke="oklch(0.6 0.2 160 / 0.12)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="260" y1="236" x2="280" y2="300" stroke="oklch(0.6 0.22 320 / 0.12)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Decorative dots */}
      <circle cx="120" cy="100" r="2" fill="oklch(0.6 0.25 280 / 0.3)" />
      <circle cx="380" cy="90" r="2.5" fill="oklch(0.6 0.25 280 / 0.25)" />
      <circle cx="420" cy="200" r="1.5" fill="oklch(0.6 0.25 280 / 0.2)" />
      <circle cx="80" cy="320" r="2" fill="oklch(0.6 0.25 280 / 0.2)" />
      <circle cx="440" cy="310" r="2" fill="oklch(0.6 0.25 280 / 0.15)" />
      <circle cx="150" cy="60" r="1.5" fill="oklch(0.6 0.25 280 / 0.15)" />
      <circle cx="350" cy="50" r="2" fill="oklch(0.6 0.25 280 / 0.2)" />

      {/* Sparkle particles */}
      <g filter="url(#glowFilter)">
        <path
          d="M130 140 l2 -6 l2 6 l-6 -2 l6 0Z"
          fill="oklch(0.6 0.25 280 / 0.5)"
          className="animate-float"
          style={{ animationDuration: "3s" }}
        />
        <path
          d="M400 150 l1.5 -5 l1.5 5 l-5 -1.5 l5 0Z"
          fill="oklch(0.6 0.2 160 / 0.4)"
          className="animate-float"
          style={{ animationDuration: "3.5s", animationDelay: "0.8s" }}
        />
        <path
          d="M360 320 l1.5 -4 l1.5 4 l-4 -1.5 l4 0Z"
          fill="oklch(0.6 0.22 320 / 0.4)"
          className="animate-float"
          style={{ animationDuration: "4s", animationDelay: "1.5s" }}
        />
      </g>

      {/* Bottom wave */}
      <path
        d="M0 390 Q125 370 250 385 Q375 400 500 380 L500 420 L0 420Z"
        fill="oklch(0.6 0.25 280 / 0.04)"
      />
    </svg>
  );
}
