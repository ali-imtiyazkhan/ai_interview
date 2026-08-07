export const colors = {
  background: {
    primary: 'oklch(0.09 0 0)',
    secondary: 'oklch(0.11 0 0)',
    tertiary: 'oklch(0.13 0 0)',
    elevated: 'oklch(0.15 0 0)',
    overlay: 'oklch(0.09 0 0 / 0.8)',
  },
  foreground: {
    primary: 'oklch(0.95 0 0)',
    secondary: 'oklch(0.85 0 0)',
    tertiary: 'oklch(0.65 0 0)',
    muted: 'oklch(0.55 0 0)',
    inverse: 'oklch(0.09 0 0)',
  },
  accent: {
    primary: 'oklch(0.6 0.25 280)',
    secondary: 'oklch(0.55 0.2 160)',
    tertiary: 'oklch(0.6 0.22 320)',
    muted: 'oklch(0.6 0.25 280 / 0.15)',
    glow: 'oklch(0.6 0.25 280 / 0.4)',
  },
  semantic: {
    success: 'oklch(0.65 0.2 145)',
    warning: 'oklch(0.75 0.18 85)',
    error: 'oklch(0.6 0.2 20)',
    info: 'oklch(0.6 0.25 280)',
  },
  border: {
    subtle: 'oklch(1 0 0 / 0.05)',
    default: 'oklch(1 0 0 / 0.1)',
    strong: 'oklch(1 0 0 / 0.2)',
    accent: 'oklch(0.6 0.25 280 / 0.3)',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.02)',
    border: 'rgba(255, 255, 255, 0.08)',
    highlight: 'rgba(255, 255, 255, 0.12)',
    shadow: 'rgba(0, 0, 0, 0.4)',
  },
};

export const spacing = {
  0: '0',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  32: '8rem',
};

export const typography = {
  fontFamilies: {
    sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
    display: '"Instrument Serif", serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
    '7xl': '4.5rem',
    '8xl': '6rem',
    '9xl': '8rem',
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.0',
    snug: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

export const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.3)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.35)',
  md: '0 4px 8px rgba(0, 0, 0, 0.4)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.45)',
  xl: '0 16px 32px rgba(0, 0, 0, 0.5)',
  '2xl': '0 24px 48px rgba(0, 0, 0, 0.55)',
  '3xl': '0 32px 64px rgba(0, 0, 0, 0.6)',
  inner: 'inset 0 2px 4px rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px oklch(0.6 0.25 280 / 0.3)',
  'glow-lg': '0 0 40px oklch(0.6 0.25 280 / 0.4)',
  'glow-accent': '0 0 30px -8px oklch(0.6 0.25 280 / 0.5)',
};

export const radii = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
};

export const transitions = {
  fast: '150ms ease-out',
  normal: '200ms ease-out',
  slow: '300ms ease-out',
  slower: '500ms ease-out',
  spring: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: '500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const zIndices = {
  base: 0,
  dropdown: 100,
  sticky: 200,
  fixed: 300,
  modal: 400,
  popover: 500,
  tooltip: 600,
  toast: 700,
};

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

export const animationDurations = {
  instant: '0ms',
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
  page: '400ms',
};

export const easings = {
  linear: 'linear',
  easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
  easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const layerStyles = {
  glass: {
    background: colors.glass.background,
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${colors.glass.border}`,
    boxShadow: `inset 0 1px 1px ${colors.glass.highlight}, ${shadows.lg}`,
  },
  glassStrong: {
    background: 'rgba(255, 255, 255, 0.04)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: `1px solid ${colors.glass.border}`,
    boxShadow: `inset 0 1px 2px ${colors.glass.highlight}, ${shadows.xl}`,
  },
  card: {
    background: colors.background.tertiary,
    border: `1px solid ${colors.border.default}`,
    borderRadius: radii.xl,
    boxShadow: shadows.lg,
  },
  cardHover: {
    borderColor: colors.border.strong,
    boxShadow: shadows.xl,
  },
};

export const focusStyles = {
  ring: `0 0 0 3px ${colors.accent.primary} / 0.4`,
  ringOffset: '2px',
  outline: 'none',
};

export const motion = {
  reduced: {
    transition: 'none',
    animation: 'none',
  },
  respectReducedMotion: '@media (prefers-reduced-motion: reduce)',
};