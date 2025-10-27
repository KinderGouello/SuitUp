# Suit up! Design System Implementation

This document outlines the implementation of the **SuitUp_Minimal_Fashion_DS** design system as specified in `design.json`.

## Overview

The design system follows a **minimal, elegant, fashion-forward** aesthetic with:
- Airy whites and soft shadows
- Outline icons with 2px stroke
- Rounded cards with generous padding
- Bottom tab navigation
- Grid-based wardrobe browsing

## Design Tokens

All design tokens are centralized in `/lib/styles/tokens.ts` and follow the specification exactly.

### Colors

```typescript
// Light theme (default)
background: '#F7F7F7'      // App background
surface: '#FFFFFF'         // Card/component backgrounds
surface_alt: '#FAFAFA'     // Alternate surface for chips/inputs
text_primary: '#121212'    // Main text color
text_secondary: '#6A6A6A'  // Secondary text
text_tertiary: '#9A9A9A'   // Tertiary/meta text
border_subtle: '#EAEAEA'   // Soft borders
border_strong: '#DDDDDD'   // Stronger dividers
accent: '#121212'          // Primary action color (black)
```

### Typography

Following the design system's type scale:

- **Display Lg**: 34px / 700 weight - Hero screens
- **Display Md**: 28px / 700 weight - Large headings
- **H1**: 22px / 700 weight - Screen titles
- **H2**: 18px / 700 weight - Section headings
- **Subtitle**: 16px / 600 weight - Subsections
- **Body**: 15px / 500 weight - Main content
- **Body Muted**: 14px / 500 weight - Secondary content
- **Caption**: 12px / 500 weight - Meta information
- **Overline**: 11px / 700 weight / UPPERCASE - Section labels
- **Button**: 15px / 700 weight - Button text

### Spacing

Based on 8px grid:

```typescript
base: 8px
xs: 4px
sm: 8px
md: 12px
lg: 16px
xl: 20px
xxl: 24px
xxxl: 32px
```

### Radii

```typescript
xs: 6px
sm: 10px
md: 14px
lg: 16px
xl: 20px
pill: 999px  // For pill-shaped buttons
```

### Elevation

Soft shadows following design spec:

```typescript
sm: { y: 2, blur: 8, opacity: 0.06 }   // Cards, chips
md: { y: 6, blur: 16, opacity: 0.08 }  // Modals
lg: { y: 10, blur: 24, opacity: 0.10 } // FABs
```

### Layout Constants

```typescript
appBar.height: 56px
tabBar.height: 72px
pagePadding: { x: 16px, y: 12px }
grid: { columns: 2, gutter: 12px, cardMinWidth: 156px }
fab.primary: 56px diameter
fab.secondary: 44px diameter
```

## Component Updates

### Button

Follows `cta_primary` spec:
- Pill shape (999px border radius)
- 44px minimum height (touch target)
- Primary: Black background, white text
- Secondary: Light gray background with subtle border
- Ghost: Transparent with black text

### ItemCard

Follows `item_card` spec:
- 16px border radius
- 4:5 aspect ratio for images
- Soft shadow (sm elevation)
- 1px subtle border
- Contain image fit with surface_alt background
- 10px padding inside card
- Body weight (600) for title
- Caption for category/meta

### WeatherBadge

Follows `weather_badge` spec:
- Chip-style compact variant available
- Row layout with outline weather icon (18px, 2px stroke)
- Caption typography
- Surface_alt background for compact mode
- Full card uses surface background with subtle border

### Tab Bar

Follows `tab_bar` spec:
- 72px height
- Icon above label layout
- Outline icons at 22px size, 2px stroke width
- Accent color (#121212) for active state
- Text_secondary (#6A6A6A) for inactive
- Soft shadow (sm elevation)
- No top border (uses shadow instead)

### Tab Icons

All icons use:
- Outline style
- 2px stroke width
- 22px size
- Rounded corners
- Proper accessibility labels

## Screen Layouts

### Page Structure

All screens follow:
- Page padding: 16px horizontal, 12px vertical
- Section gap: 20px between major sections
- Row spacing: 12px between items
- Grid gutter: 12px between cards

### Typography Patterns

**Section Headers:**
- Overline (11px, uppercase, 700 weight) for kicker
- H2 (18px, 700 weight) for section title
- Caption for meta information

**Card Content:**
- Body (15px, 600 weight) for titles
- Caption (12px) for categories
- Text_tertiary color for metadata

### Grid Layout

- 2 columns on compact width
- 12px gutter between cards
- 156px minimum card width
- 4:5 aspect ratio for item images

## Iconography

All icons follow design system:
- **Style**: Outline (not filled)
- **Stroke width**: 2px
- **Sizes**:
  - sm: 18px (compact elements)
  - md: 22px (tab bar, standard UI)
  - lg: 28px (prominent actions)
- **Corner style**: Rounded
- **Colors**:
  - Default: text_primary (#121212)
  - Inactive: text_secondary (#6A6A6A)
  - Accented: accent (#121212)

## Accessibility

Following design system specs:
- Minimum touch target: 44px
- Hit slop: 8px on interactive elements
- Contrast ratio: 4.5:1 minimum
- Dynamic type support via typography tokens
- VoiceOver labels on all interactive elements

## Content Guidelines

- **Titles**: Sentence case (not title case)
- **Overlines**: UPPERCASE
- **Microcopy**: Short, confident, calm
- **Avoid**: Exclamation marks unless CTA
- **Truncation**: 1 line for card titles and subtitles

## States

**Loading**: Skeleton screens (not implemented yet)
**Empty**: Icon + title + helper text pattern
**Disabled**: 0.38 opacity
**Pressed**: 0.08 overlay opacity
**Muted**: 0.64 opacity

## Implementation Status

### ✅ Completed
- Design tokens system
- Color palette (light theme)
- Typography scale
- Spacing system
- Border radii
- Elevation/shadows
- Icon sizes and styling
- Layout constants
- Button component
- ItemCard component
- WeatherBadge component
- Tab bar styling
- Touch target sizing

### 🚧 Partial
- All screens use some design tokens
- Some components still need full redesign
- Dark theme defined but not implemented

### ⏳ Not Yet Implemented
- Skeleton loading states
- Bottom sheets with proper styling
- FAB (Floating Action Button) for add item
- Segmented pill control
- Chip component fully redesigned
- Search bar with proper pill shape
- Outfit canvas with collage styling
- Two-pane layouts for landscape
- Complete dark theme support

## Usage in Code

Import tokens in any component:

```typescript
import {
  theme,
  typography,
  spacing,
  radii,
  elevation,
  iconSizes
} from '@/lib/styles/tokens';

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderRadius: radii.lg,
    padding: spacing.lg,
    ...elevation.sm,
  },
  title: {
    ...typography.h2,
    color: theme.text_primary,
  },
});
```

## Future Enhancements

1. **Complete Component Library**
   - FAB component
   - Chip component (redesigned)
   - Search bar (pill-shaped)
   - Bottom sheet
   - Segmented control

2. **Dark Theme**
   - Implement theme switching
   - Update all components to use theme object
   - Add system theme detection

3. **Advanced States**
   - Skeleton loading screens
   - Enhanced error states
   - Toast notifications

4. **Animations**
   - Use motion tokens (120ms/180ms/240ms)
   - Implement easing curves
   - Add micro-interactions

5. **Responsive**
   - 3-column grid for tablets
   - Two-pane outfit builder for landscape
   - Persistent filters on larger screens

## Notes

- All components should inherit from design tokens, not hardcode values
- Favor whitespace and soft elevation over dense borders
- Icons are always outline style with 2px stroke
- Black (#121212) is the accent color, creating high contrast
- System uses light theme by default (dark theme available but not active)
