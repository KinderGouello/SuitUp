module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Suit Up! Modern Design System - Indigo & Sky Gradient
        background: '#fafafa',
        foreground: '#1a1a2e',
        card: '#ffffff',
        'card-foreground': '#1a1a2e',
        popover: '#ffffff',
        'popover-foreground': '#1a1a2e',

        // Primary Indigo palette
        primary: {
          DEFAULT: '#4f46e5', // Indigo-600
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // Primary brand color
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          foreground: '#ffffff',
        },

        // Secondary Sky palette
        secondary: {
          DEFAULT: '#e0e7ff',
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9', // Sky-500 for gradients
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          foreground: '#4f46e5',
        },

        // Accent Amber
        accent: {
          DEFAULT: '#f59e0b',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          foreground: '#1a1a2e',
        },

        // Neutrals
        muted: {
          DEFAULT: '#f5f5f7',
          foreground: '#6b7280',
        },

        // Destructive
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#ffffff',
        },

        // Border
        border: 'rgba(79, 70, 229, 0.15)',
        input: 'transparent',
        ring: '#4f46e5',

        // Gradient brand colors
        'brand-primary': '#4f46e5',
        'brand-secondary': '#0ea5e9',
        'brand-accent': '#f59e0b',

        // Status colors
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['System'],
      },
      fontSize: {
        'hero': ['40px', { lineHeight: '48px', letterSpacing: '-1px', fontWeight: '300' }],
        'display-lg': ['36px', { lineHeight: '44px', letterSpacing: '-0.8px', fontWeight: '300' }],
        'display-md': ['32px', { lineHeight: '40px', letterSpacing: '-0.5px', fontWeight: '400' }],
        'display': ['28px', { lineHeight: '36px', letterSpacing: '-0.4px', fontWeight: '400' }],
        'h1': ['24px', { lineHeight: '32px', letterSpacing: '-0.3px', fontWeight: '600' }],
        'h2': ['20px', { lineHeight: '28px', letterSpacing: '-0.2px', fontWeight: '600' }],
        'title': ['18px', { lineHeight: '26px', fontWeight: '600' }],
        'subtitle': ['16px', { lineHeight: '24px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-lg': ['18px', { lineHeight: '28px', fontWeight: '400' }],
        'body-sm': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'caption': ['13px', { lineHeight: '18px', letterSpacing: '0.1px', fontWeight: '400' }],
        'micro': ['11px', { lineHeight: '16px', letterSpacing: '0.2px', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '16px', letterSpacing: '0.5px', fontWeight: '500' }],
      },
      spacing: {
        'micro': '4px',
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'xxl': '32px',
        'jumbo': '48px',
      },
      borderRadius: {
        'xs': '4px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '24px',
        'pill': '100px',
      },
    },
  },
  plugins: [],
};
