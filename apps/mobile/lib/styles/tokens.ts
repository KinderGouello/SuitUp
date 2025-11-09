// Enhanced Design Tokens for SuitUp
// Modern Gradient Design - Inspired by Figma Make
// Gender-neutral palette with vibrant indigo and sky gradients

export const colors = {
  // Primary Palette - Indigo (brand primary)
  indigo50: '#eef2ff',
  indigo100: '#e0e7ff',
  indigo200: '#c7d2fe',
  indigo300: '#a5b4fc',
  indigo400: '#818cf8',
  indigo500: '#6366f1',
  indigo600: '#4f46e5',    // PRIMARY brand color
  indigo700: '#4338ca',
  indigo800: '#3730a3',
  indigo900: '#312e81',

  // Secondary Palette - Sky (brand secondary)
  sky50: '#f0f9ff',
  sky100: '#e0f2fe',
  sky200: '#bae6fd',
  sky300: '#7dd3fc',
  sky400: '#38bdf8',
  sky500: '#0ea5e9',       // Secondary gradient color
  sky600: '#0284c7',
  sky700: '#0369a1',
  sky800: '#075985',
  sky900: '#0c4a6e',

  // Accent Palette - Amber
  amber50: '#fffbeb',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber300: '#fcd34d',
  amber400: '#fbbf24',
  amber500: '#f59e0b',     // Accent color
  amber600: '#d97706',
  amber700: '#b45309',
  amber800: '#92400e',
  amber900: '#78350f',

  // Neutral Foundation
  white: '#FFFFFF',
  background: '#fafafa',
  foreground: '#1a1a2e',
  lightGray: '#f5f5f7',
  gray: '#6b7280',
  darkGray: '#4b5563',
  charcoal: '#1a1a2e',

  // Brand gradient colors (used for gradients)
  brandPrimary: '#4f46e5',      // Indigo-600
  brandSecondary: '#0ea5e9',    // Sky-500
  brandAccent: '#f59e0b',       // Amber-500

  // Weather-aware colors
  weatherCold: '#0369a1',       // Sky-700
  weatherWarm: '#f59e0b',       // Amber-500
  weatherRain: '#0284c7',       // Sky-600
  weatherSnow: '#38bdf8',       // Sky-400

  // Status colors
  wornRecently: '#0ea5e9',      // Sky-500
  unworn: '#6b7280',            // Gray-500
  favorite: '#4f46e5',          // Indigo-600
  sustainable: '#10b981',       // Emerald-500

  // Semantic (WCAG compliant)
  success: '#10b981',           // Emerald-500
  warning: '#f59e0b',           // Amber-500
  error: '#ef4444',             // Red-500
  info: '#3b82f6',              // Blue-500
};

// Modern theme mapping with gradient accents
// Optimized for vibrant, engaging UI with accessibility
export const theme = {
  background: colors.background,        // #fafafa
  surface: colors.white,
  surface_alt: colors.indigo50,         // Very subtle indigo tint
  surface_elevated: colors.white,
  surface_subtle: colors.lightGray,

  // Text colors optimized for accessibility
  text_primary: colors.foreground,      // #1a1a2e
  text_secondary: colors.darkGray,      // #4b5563
  text_tertiary: colors.gray,           // #6b7280
  text_muted: colors.gray,              // #6b7280

  border_subtle: 'rgba(79, 70, 229, 0.15)',
  border_medium: 'rgba(79, 70, 229, 0.25)',
  border_strong: colors.indigo600,

  accent: colors.brandPrimary,          // #4f46e5 (Indigo-600)
  accent_hover: colors.indigo700,       // Darker on hover
  accent_light: colors.indigo100,       // Light variant
  accent_secondary: colors.brandSecondary, // #0ea5e9 (Sky-500)
  accent_subtle: colors.indigo50,       // Subtle backgrounds

  positive: colors.success,
  warning: colors.warning,
  danger: colors.error,
  shadow: 'rgba(79, 70, 229, 0.15)',
  shadow_soft: 'rgba(79, 70, 229, 0.08)',
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

// Border radii - Refined & minimal
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
  full: 9999,
};

// Elevation - Soft, modern depth with indigo tint
export const elevation = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: colors.indigo600,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: colors.indigo600,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.indigo600,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 4,
  },
  xl: {
    shadowColor: colors.indigo600,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.20,
    shadowRadius: 30,
    elevation: 5,
  },
};

// Typography - Elegant hierarchy with refined legibility
// Inspired by luxury editorial and minimal Swiss design
export const typography = {
  hero: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: '300' as const, // Light weight for elegance
    letterSpacing: -1,
  },
  displayLg: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '300' as const,
    letterSpacing: -0.8,
  },
  displayMd: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '400' as const, // Regular for refined look
    letterSpacing: -0.5,
  },
  display: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '400' as const,
    letterSpacing: -0.4,
  },
  h1: {
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const, // Semibold for structure
    letterSpacing: -0.3,
  },
  h2: {
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: -0.2,
  },
  title: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const, // Medium for subtle hierarchy
    letterSpacing: 0,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const, // Regular for optimal reading
    letterSpacing: 0,
  },
  bodyLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  caption: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '400' as const,
    letterSpacing: 0.1,
  },
  micro: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '400' as const,
    letterSpacing: 0.2,
  },
  overline: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  label: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '500' as const,
    letterSpacing: 0.5,
    textTransform: 'uppercase' as const,
  },
  button: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500' as const,
    letterSpacing: 0.2,
  },
  buttonLarge: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '500' as const,
    letterSpacing: 0.3,
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
