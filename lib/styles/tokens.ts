// Enhanced Design Tokens for Suit up!
// Fashion-first, speed-optimized wardrobe app

export const colors = {
  // Wardrobe Neutrals - warm, inviting base
  ivory: '#FDFBF7',
  linen: '#F5F3EE',
  charcoal: '#2C2C2C',
  slate: '#6B7280',
  mist: '#E8E6E0',

  // Closet Organization - accent colors
  midnight: '#1A1A1A',
  camel: '#C4A47C',
  sage: '#9CA986',
  terracotta: '#D4745F',
  navy: '#2D3E50',

  // Weather-aware colors
  weatherCold: '#6BA3D4',
  weatherWarm: '#F4B860',
  weatherRain: '#708090',

  // Status colors
  wornRecently: '#E8D4B8',
  unworn: '#9CA986',
  favorite: '#D4A574',

  // Semantic
  success: '#9CA986',
  warning: '#D4745F',
  error: '#C85C5C',
  info: '#2D3E50',
};

// Current theme mapping (light mode)
export const theme = {
  background: colors.ivory,
  surface: colors.linen,
  surface_alt: '#FAFAFA',
  surface_elevated: '#FFFFFF',
  text_primary: colors.charcoal,
  text_secondary: colors.slate,
  text_tertiary: '#9CA3AF',
  border_subtle: colors.mist,
  border_strong: '#D1CEC7',
  accent: colors.midnight,
  accent_hover: '#000000',
  accent_secondary: colors.camel,
  positive: colors.sage,
  warning: colors.terracotta,
  danger: colors.error,
  shadow: 'rgba(44, 44, 44, 0.04)',
};

// Spacing based on 4px base (more granular)
export const spacing = {
  micro: 4,
  xs: 4,
  small: 8,
  sm: 8,
  base: 12,
  md: 12,
  medium: 16,
  lg: 16,
  large: 24,
  xl: 24,
  xlarge: 32,
  xxl: 32,
  jumbo: 48,
};

// Border radii - softer, warmer
export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 24,
  full: 9999,
};

// Elevation - subtle, barely-there shadows
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

// Typography - scannable hierarchy
export const typography = {
  hero: {
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900' as const,
    letterSpacing: -0.5,
  },
  displayLg: {
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  displayMd: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  display: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: -0.25,
  },
  h1: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  h2: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '700' as const,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700' as const,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500' as const,
  },
  bodyMuted: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  caption: {
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '500' as const,
  },
  micro: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
  },
  overline: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '700' as const,
    letterSpacing: 1.2,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700' as const,
  },
};

// Layout constants
export const layout = {
  appBar: {
    height: 56,
  },
  tabBar: {
    height: 72,
  },
  searchBar: {
    height: 48,
  },
  pagePadding: {
    horizontal: 16,
    vertical: 12,
  },
  grid: {
    columns: {
      compact: 2,
      standard: 2,
      expanded: 3,
    },
    gutter: 8,
    cardMinWidth: 156,
    imageAspectRatio: 4 / 5,
  },
  fab: {
    primary: 64,
    secondary: 48,
    mini: 40,
    margin: 16,
  },
  section: {
    gap: 20,
    marginBottom: 24,
  },
};

// Opacity for states
export const opacity = {
  disabled: 0.38,
  muted: 0.64,
  divider: 0.12,
  overlay: 0.08,
  pressed: 0.92,
};

// Icon sizes
export const iconSizes = {
  sm: 18,
  md: 22,
  lg: 28,
  xl: 32,
};

// Touch targets
export const touchTarget = {
  min: 44,
  comfortable: 48,
  hero: 56,
};

// Animation durations (ms)
export const motion = {
  fast: 100,
  base: 200,
  smooth: 300,
  slow: 400,
};

// Z-index layers
export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modal: 1300,
  popover: 1400,
  toast: 1500,
};

// Exports for backwards compatibility
export const shadows = elevation;
export const borderRadius = radii;
export const hitSlop = 8;
export const minTouchTarget = touchTarget.min;
