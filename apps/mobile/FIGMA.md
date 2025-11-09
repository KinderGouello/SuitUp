# Figma Design Specifications - Suit Up!

**Project URL**: https://www.figma.com/make/sYW1fSYng2AGCjFwGevIVE/Suit-Up-

## Design System Overview

### Color Palette

#### Primary Colors - Indigo & Sky Gradient
- **Primary (Indigo-600)**: `#4f46e5` - Main brand color
- **Secondary (Sky-500)**: `#0ea5e9` - Gradient complement
- **Accent (Amber-500)**: `#f59e0b` - Highlights and CTAs

#### Extended Palette
**Indigo Scale:**
- 50: `#eef2ff`
- 100: `#e0e7ff`
- 200: `#c7d2fe`
- 300: `#a5b4fc`
- 400: `#818cf8`
- 500: `#6366f1`
- 600: `#4f46e5` (PRIMARY)
- 700: `#4338ca`
- 800: `#3730a3`
- 900: `#312e81`

**Sky Scale:**
- 50: `#f0f9ff`
- 100: `#e0f2fe`
- 200: `#bae6fd`
- 300: `#7dd3fc`
- 400: `#38bdf8`
- 500: `#0ea5e9` (SECONDARY)
- 600: `#0284c7`
- 700: `#0369a1`
- 800: `#075985`
- 900: `#0c4a6e`

**Amber Scale:**
- 50: `#fffbeb`
- 100: `#fef3c7`
- 200: `#fde68a`
- 300: `#fcd34d`
- 400: `#fbbf24`
- 500: `#f59e0b` (ACCENT)
- 600: `#d97706`
- 700: `#b45309`
- 800: `#92400e`
- 900: `#78350f`

#### Neutral Colors
- **Background**: `#fafafa`
- **Foreground**: `#1a1a2e`
- **White**: `#ffffff`
- **Light Gray**: `#f5f5f7`
- **Gray**: `#6b7280`
- **Dark Gray**: `#4b5563`

#### Semantic Colors
- **Success**: `#10b981` (Emerald-500)
- **Warning**: `#f59e0b` (Amber-500)
- **Error**: `#ef4444` (Red-500)
- **Info**: `#3b82f6` (Blue-500)

### Typography

**Base Font Size**: 16px

**Font Scale:**
- **Hero**: 40px / 48px line-height, -1px letter-spacing, weight 300
- **Display Large**: 36px / 44px, -0.8px, weight 300
- **Display Medium**: 32px / 40px, -0.5px, weight 400
- **Display**: 28px / 36px, -0.4px, weight 400
- **H1**: 24px / 32px, -0.3px, weight 600
- **H2**: 20px / 28px, -0.2px, weight 600
- **Title**: 18px / 26px, weight 600
- **Subtitle**: 16px / 24px, weight 500
- **Body**: 16px / 24px, weight 400
- **Body Large**: 18px / 28px, weight 400
- **Body Small**: 14px / 20px, weight 400
- **Caption**: 13px / 18px, 0.1px, weight 400
- **Micro**: 11px / 16px, 0.2px, weight 400
- **Label**: 12px / 16px, 0.5px, weight 500, uppercase

### Spacing Scale

Based on 4px base unit:
- **Micro**: 4px
- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 24px
- **XXL**: 32px
- **Jumbo**: 48px

### Border Radius

- **XS**: 4px
- **SM**: 8px
- **MD**: 12px
- **LG**: 16px
- **XL**: 24px
- **Pill**: 100px
- **Full**: 9999px (circular)

### Elevation (Shadows)

All shadows use Indigo-600 color with varying opacity:

- **SM**: `shadowOffset: {0, 1}`, opacity: 0.08, radius: 6px
- **MD**: `shadowOffset: {0, 3}`, opacity: 0.12, radius: 12px
- **LG**: `shadowOffset: {0, 6}`, opacity: 0.15, radius: 20px
- **XL**: `shadowOffset: {0, 10}`, opacity: 0.20, radius: 30px

---

## Screen Specifications

### 1. Dashboard (Home Screen)

#### Layout Structure
- **Padding**: 24px horizontal, 24px vertical
- **Content Gap**: 24px between sections
- **Bottom Padding**: 48px (for tab bar clearance)

#### Components

##### 1.1 Brand Header
- **Logo Icon**: Sparkles (32px, Indigo-600)
- **Title**: "Suit Up!" (28px, gradient Indigo-600 → Sky-500)
- **Tagline**: "Your style, perfected daily ✨" (14px, Gray-600)
- **Background**: Gradient overlay from Indigo-600/10% with blur
- **Padding**: 16px horizontal, 24px vertical

##### 1.2 Stats Row (3 Cards)
- **Layout**: Horizontal row with 8px gap
- **Card Properties**:
  - Border: 2px solid Indigo-100
  - Border Radius: 16px
  - Gradient Background: Indigo-50 → White (diagonal)
  - Padding: 12px
  - Shadow: SM elevation
  - Alignment: Center

**Stat 1 - Streak:**
- Icon: Flame (20px, Amber-500, filled)
- Value: Number (H1, 24px, weight 600)
- Label: "Day Streak" (11px, uppercase, Gray-500)

**Stat 2 - Style Score:**
- Icon: Star (20px, Amber-500, filled)
- Value: Number (H1, 24px, weight 600)
- Label: "Style Score" (11px, uppercase, Gray-500)

**Stat 3 - Outfits:**
- Icon: Trophy (20px, Indigo-600)
- Value: Number (H1, 24px, weight 600)
- Label: "Outfits" (11px, uppercase, Gray-500)

##### 1.3 Daily Motivation Card
- **Background**: Linear gradient Indigo-600 → Sky-500
- **Border Radius**: 16px
- **Padding**: 16px
- **Shadow**: MD elevation
- **Layout**: Horizontal flex
- **Icon Container**:
  - Background: `rgba(255, 255, 255, 0.2)`
  - Border Radius: 16px
  - Padding: 12px
  - Icon: Zap (24px, white, filled)
- **Text Container**:
  - Label: "Daily Boost" (13px, white 90% opacity)
  - Message: Motivational text (16px, white, weight 600)

##### 1.4 Weather Card
- **Border**: 2px solid Blue-100
- **Border Radius**: 24px
- **Padding**: 24px
- **Shadow**: SM elevation
- **Header**:
  - Location: (20px, weight 600)
  - Date: Long format (13px, Gray-600)
  - Weather Icon: Conditional (48px, Blue-600)
- **Temperature Display**:
  - Main Temp: 60px font size
  - Condition: 20px, Gray-600
- **Details Row**:
  - Humidity: Icon + percentage (14px, Gray-600)
  - Wind: Icon + speed (14px, Gray-600)

##### 1.5 Daily Outfit Suggestion
- **Border**: 2px solid Indigo-100
- **Border Radius**: 16px
- **Header**:
  - Title: "Today's Perfect Match" (20px)
  - Subtitle: Weather context (13px, Gray-600)
  - Badge: "AI Picked" (gradient background)
- **Outfit Grid**: 3 columns, 12px gap
- **Item Cards**:
  - Aspect Ratio: Square
  - Border Radius: 16px
  - Ring: 2px Purple-100
  - Category Badge: Indigo-50 background, Indigo-700 text
  - Name: Truncated (12px)
- **Style Match Score**:
  - Background: Indigo-50
  - Border: 1px Indigo-100
  - Border Radius: 12px
  - Padding: 12px
  - Progress Bar: 95% (8px height)
  - Label: "Style Match" (14px)
  - Percentage: "95%" (14px)

##### 1.6 Generate Outfit CTA
- **Background**: Linear gradient Indigo-600 → Sky-500
- **Border Radius**: 16px
- **Padding**: 24px
- **Shadow**: XL elevation
- **Layout**: Horizontal with gap 16px
- **Icon Container**:
  - Background: `rgba(255, 255, 255, 0.2)`
  - Border Radius: 24px
  - Padding: 16px
  - Size: 64x64px
  - Icon: Sparkles (32px, white, filled)
- **Text Container**:
  - Title: "Want a fresh look?" (16px, white, weight 600)
  - Subtitle: Description (14px, white 90% opacity)
  - Button:
    - Background: White
    - Border Radius: 12px
    - Padding: 8px 16px
    - Icon: Sparkles (16px, Indigo-600)
    - Text: "Generate Outfit" (14px, Indigo-600, weight 600)
    - Shadow: SM elevation

---

### 2. Wardrobe (Closet) Screen

#### Layout
- **Padding**: 24px horizontal
- **Content Gap**: 16px

#### Components

##### 2.1 Header
- **Title**: "My Collection" (28px, gradient Indigo-600 → Sky-500)
  - Implementation: Using MaskedView with LinearGradient
- **Subtitle**:
  - Icon: Sparkles (12px, Indigo-500)
  - Text: "{count} amazing pieces" (14px, Gray-600)
  - Layout: Horizontal with 4px gap

##### 2.2 Search Bar
- **Background**: White
- **Border**: 1.5px solid Indigo-200
- **Border Radius**: 16px
- **Height**: 48px
- **Padding**: 16px horizontal
- **Layout**: Horizontal with 8px gap
- **Icon**: Search (20px, Indigo-400)
- **Placeholder**: "Search your style..." (16px, Gray-500)

##### 2.3 Category Filter Pills
- **Layout**: Horizontal scroll
- **Gap**: 8px
- **Pill Properties**:
  - Inactive:
    - Background: White
    - Border: 1.5px solid Border-medium
    - Border Radius: 100px
    - Padding: 10px 16px
    - Text: 13px, Gray-600, weight 600, capitalize
  - Active:
    - Background: Indigo-600
    - Border: 1.5px solid Indigo-600
    - Text: White

##### 2.4 Clothing Cards (Grid)
- **Grid**: 2 columns
- **Gap**: 16px
- **Card Properties**:
  - Border: 2px solid Indigo-50
  - Border Radius: 16px
  - Hover: Border changes to Indigo-200, -4px translate-y
  - Shadow: Transitions to XL with Indigo-100/50% on hover
  - Cursor: Pointer

**Image Container:**
- Aspect Ratio: Square
- Background: Gray-100
- Overlay on Hover: Gradient from `black/60` bottom to transparent
- View Details:
  - Icon: Eye (12px, white)
  - Text: "View Details" (12px, white)
  - Position: Bottom center

**Content:**
- Padding: 12px
- Category Badge: Purple-100 background, Purple-700 text
- Season Badge: Outline, Pink-200 border, Pink-700 text
- Name: Truncated (14px)
- Color: (12px, Gray-500)

##### 2.5 Empty State
- **Alignment**: Center
- **Padding**: 48px
- **Gap**: 16px
- **Title**: (24px, weight 600)
- **Description**: (16px, Gray-600, center aligned)

---

### 3. Preferences (Profile) Screen

#### Layout
- **Padding**: 24px
- **Content Gap**: 32px

#### Components

##### 3.1 Profile Card (Gradient Header)
- **Background**: Linear gradient Indigo-600 → Sky-500
- **Border Radius**: 16px
- **Padding**: 24px
- **Shadow**: MD elevation
- **Layout**: Horizontal, gap 16px

**Avatar:**
- Size: 72x72px
- Border Radius: Full circle
- Background: `rgba(255, 255, 255, 0.2)`
- Border: 3px solid White
- Icon: User (32px, white)
- Badge:
  - Position: Bottom-right (-4px offset)
  - Background: Indigo-600
  - Border: 2px white
  - Border Radius: Full circle
  - Padding: 4px
  - Icon: Crown (16px, white, filled)

**Profile Info:**
- Name: "Style Profile" (24px, white, weight 600)
- Subtitle: "Customize your preferences" (14px, white 90% opacity)

##### 3.2 Section Cards
- **Border**: 2px solid Indigo-100
- **Border Radius**: 16px
- **Padding**: 16px
- **Gap**: 12px

**Section Header:**
- Title: (16px, weight 500)
- Description: (13px, Gray-600)

**Dropdown Fields:**
- Background: White
- Border: 1px Border-subtle
- Border Radius: 12px
- Padding: 16px
- Layout: Horizontal space-between
- Icon: ChevronDown (20px, Gray-600)

**Dropdown Menu:**
- Background: White
- Border: 1px Border-subtle
- Border Radius: 12px
- Shadow: MD elevation
- Margin Top: 4px
- Items:
  - Padding: 16px
  - Border Bottom: 1px Border-subtle
  - Selected: Background tint, text Indigo-600, weight 600

**Switch Controls:**
- Container:
  - Padding: 12px
  - Border Radius: 12px
  - Hover: Purple-50/50% background
- Label: Cursor pointer
- Description: (12px, Gray-500, 4px margin top)

##### 3.3 Save Button
- **Variant**: Gradient (Indigo-600 → Sky-500)
- **Width**: Full width
- **Size**: Large (56px height)
- **Border Radius**: 16px
- **Shadow**: LG with Purple-200
- **Icon**: Save (16px, white)
- **Text**: "Save Preferences" (18px, white, weight 500)

---

### 4. Add Item Screen

#### Layout
- **Padding**: 16px
- **Bottom Padding**: 80px (for form clearance)
- **Content Gap**: 16px

#### Components

##### 4.1 Header
- **Title**: "Add New Item" (24px, gradient Indigo-600 → Sky-500)
- **Subtitle**:
  - Icon: Sparkles (12px, Indigo-500)
  - Text: "Expand your style collection" (14px, Gray-600)

##### 4.2 Photo Upload Cards
- **Border**: 2px solid Indigo-100
- **Border Radius**: 16px

**Upload Areas:**
- Aspect Ratio: Square
- Border: 2px dashed Indigo-200
- Border Radius: 16px
- Background: Indigo-50/30%
- Hover:
  - Border: Indigo-400
  - Background: Indigo-50/50%
- Cursor: Pointer

**Empty State:**
- Icon Container:
  - Background: Gradient Indigo-500 → Sky-500
  - Border Radius: Full circle
  - Padding: 12px
  - Icon: Camera/Upload (24px, white)
- Primary Text: (14px, Indigo-600)
- Secondary Text: (12px, Gray-500)

**With Photo:**
- Image: Full container, border-radius 16px
- Remove Button:
  - Position: Top-right (8px offset)
  - Background: White
  - Border Radius: Full circle
  - Padding: 6px
  - Shadow: LG
  - Hover: Red-50 background
  - Icon: X (16px, Red-500)
- Success Badge:
  - Position: Bottom-right (8px offset)
  - Background: Gradient Green-500 → Emerald-500
  - Border Radius: Full circle
  - Padding: 6px
  - Shadow: LG
  - Icon: Check (16px, white)

##### 4.3 Form Fields
- **Input Fields**:
  - Border: 1px Indigo-200
  - Border Radius: 8px
  - Focus: Ring Indigo-500
  - Padding: 12px

- **Select Fields**:
  - Border: 1px Indigo-200
  - Border Radius: 8px
  - Trigger padding: 12px

- **Textarea**:
  - Border: 1px Indigo-200
  - Border Radius: 8px
  - Rows: 3
  - Focus: Ring Indigo-500

##### 4.4 Submit Button
- **Background**: Gradient Indigo-600 → Sky-500
- **Width**: Full width
- **Size**: Large
- **Border**: None
- **Shadow**: LG with Indigo-200
- **Icon**: Sparkles (16px, white)
- **Text**: "Add to Collection" (weight 500)

---

### 5. Outfit Generator Screen

#### Pre-Generation View

##### 5.1 Back Button
- **Variant**: Ghost
- **Hover**: Purple-50 background
- **Icon**: ArrowLeft (16px)
- **Text**: "Back"

##### 5.2 Generation Card (Centered)
- **Max Width**: 384px (sm breakpoint)
- **Border**: 2px solid Purple-100
- **Border Radius**: 16px

**Icon Container:**
- Background: Gradient Purple-600 → Pink-500
- Border Radius: Full circle
- Size: 80x80px
- Margin: Auto, 16px bottom
- Icon: Sparkles (40px, white, filled)

**Content:**
- Title: "Ready to Suit Up?" (24px, gradient Purple-600 → Pink-500)
- Description: (16px, Gray-600, 8px margin top, center aligned)
- Weather Context: (12px, Gray-500, center aligned)

**Loading State:**
- Icon: RefreshCw (20px, Purple-600, spinning)
- Text: "Analyzing your wardrobe..." (14px, Purple-600)
- Progress Bar: 66% (8px height)

**Generate Button:**
- Background: Gradient Purple-600 → Pink-500
- Width: Full
- Size: Large
- Shadow: LG with Purple-200
- Icon: Sparkles (16px, white)

#### Post-Generation View

##### 5.3 Header
- **Border Bottom**: 1px Purple-100
- **Padding**: 16px
- **Title**: "Today's Outfit" (24px, gradient Purple-600 → Pink-500)
- **Date**: Long format (14px, Gray-600)
- **Regenerate Button**:
  - Variant: Outline
  - Border: Purple-200
  - Text: Purple-600
  - Hover: Purple-50 background
  - Icon: RefreshCw (16px)
  - Size: Small

##### 5.4 Style Match Score Card
- **Border**: 2px solid Purple-100
- **Background**: Gradient Purple-50 → White
- **Border Radius**: 16px
- **Padding**: 16px
- **Badge**: "Perfect Match" (gradient background)
- **Progress**: 95% (8px height)
- **Description**: (12px, Gray-600)

##### 5.5 Outfit Item Cards
- **Border**: 2px solid Purple-100
- **Border Radius**: 16px
- **Padding**: 16px
- **Gap**: 16px between cards

**Image:**
- Size: 96x96px
- Border Radius: 12px
- Ring: 2px Purple-100
- Background: Gray-100

**Content Layout:**
- Category Badge: Purple-100 background, Purple-700 text
- Name: Truncated (16px)
- Reason:
  - Icon: Sparkles (12px, Purple-500)
  - Text: (12px, Gray-600)
  - Layout: Horizontal with 4px gap

**Action Buttons:**
- Swap Button:
  - Variant: Outline
  - Border: Purple-200
  - Hover: Purple-50
  - Icon: RefreshCw (12px)
  - Size: Small

- Laundry Button:
  - Variant: Outline
  - Border: Orange-200
  - Text: Orange-600
  - Hover: Orange-50
  - Icon: Trash2 (12px)
  - Size: Small

##### 5.6 Confirm Button
- **Background**: Gradient Purple-600 → Pink-500
- **Width**: Full width
- **Size**: Large
- **Shadow**: LG with Purple-200
- **Icon**: Check (16px, white)
- **Text**: "Love It! Suit Up"

##### 5.7 Swap Item Dialog
- **Max Width**: 448px (md breakpoint)
- **Border Radius**: 16px
- **Title**: "Swap {category}"
- **Description**: "Choose an alternative from your wardrobe"

**Alternative Item Grid:**
- Columns: 2
- Gap: 12px
- Items:
  - Border: 2px solid Purple-100
  - Border Radius: 12px
  - Hover: Purple-400 border, shadow LG
  - Aspect Ratio: Square
  - Image: Full container
  - Overlay on Hover: Gradient black/60 bottom to transparent
  - Name: (12px, white, bottom position on hover)
  - Footer: White background, 8px padding, name truncated

---

## Bottom Navigation (Tab Bar)

### Layout
- **Position**: Fixed bottom
- **Width**: Full (max-width: 448px, centered)
- **Background**: `rgba(255, 255, 255, 0.8)` with blur
- **Border Top**: 2px solid Indigo-100
- **Shadow**: XL with Indigo-200/50%
- **Padding**: 8px

### Tab Items (4 total)
1. Home
2. Closet (Wardrobe)
3. Add (Center, highlighted)
4. Profile (Preferences)

**Tab Properties:**
- **Inactive**:
  - Text: Gray-600
  - Icon: 24px
  - Hover: Indigo-600 text, Indigo-50 background
  - Border Radius: 16px
  - Padding: 8px 16px

- **Active** (except Add):
  - Background: Gradient Indigo-600 → Sky-500
  - Background Blur: Blurred gradient behind
  - Border Radius: 16px
  - Text: White
  - Icon: 24px, White
  - Sparkle Accent:
    - Position: Top-right (-4px offset)
    - Icon: Sparkles (12px, Amber-400, filled)

- **Add Tab** (Special):
  - Always has gradient background
  - Circle container for icon
  - Icon: Plus (20px, white)
  - Text: White

**Tab Layout:**
- Flexbox: Horizontal, space-around
- Gap: 4px
- Text: (12px below icon)

---

## Gradient Specifications

### Primary Gradient (Indigo → Sky)
- **Colors**: `#4f46e5` → `#0ea5e9`
- **Direction**: Diagonal (45°) or Horizontal
- **Start**: `{x: 0, y: 0}`
- **End**: `{x: 1, y: 1}` (diagonal) or `{x: 1, y: 0}` (horizontal)
- **Usage**: Primary buttons, CTA cards, headers

### Secondary Gradient (Purple → Pink)
- **Colors**: `#9333ea` (Purple-600) → `#ec4899` (Pink-500)
- **Direction**: Diagonal
- **Usage**: Outfit generator, special features

### Subtle Gradients (Backgrounds)
- **Indigo Subtle**: `#eef2ff` → `#ffffff`
- **Amber Subtle**: `#fffbeb` → `#ffffff`
- **Direction**: Diagonal
- **Usage**: Stat cards, soft backgrounds

---

## Interactive States

### Buttons
- **Default**: Solid or gradient background
- **Hover**: Slightly darker background (700 variant), scale 1.02
- **Pressed**: Darker background, scale 0.98, increased shadow
- **Disabled**: 38% opacity
- **Loading**: Spinner, disabled interaction

### Cards
- **Default**: White background, subtle border
- **Hover**: Enhanced shadow, slight translate-y (-4px), border color change
- **Pressed**: Shadow reduced, scale 0.99
- **Selected**: Enhanced border (2px), accent color

### Inputs
- **Default**: Border subtle
- **Focus**: Ring in accent color (2px), border accent
- **Error**: Border red, ring red
- **Disabled**: 38% opacity, cursor not-allowed

---

## Iconography

### Icon Library
**Lucide React** (lucide-react or lucide-react-native)

### Common Icons
- **Sparkles**: Magic, AI features, premium
- **Star**: Ratings, favorites, achievements
- **Flame**: Streaks, hot items
- **Trophy**: Achievements, goals
- **Zap**: Energy, quick actions, boosts
- **Crown**: Premium, special status
- **Camera**: Photo upload
- **Upload**: File/image upload
- **Eye**: View details, preview
- **RefreshCw**: Regenerate, swap, refresh
- **Check**: Success, confirm, complete
- **X**: Close, remove, delete
- **Trash2**: Delete, laundry basket
- **ArrowLeft**: Back navigation
- **ChevronDown**: Dropdown indicator
- **Search**: Search functionality
- **User**: Profile, account
- **Plus**: Add new item
- **Home**: Home screen
- **Shirt**: Wardrobe, clothing
- **Settings**: Preferences, configuration

### Icon Sizes
- **Small**: 12-16px (badges, inline text)
- **Medium**: 20-24px (buttons, standard UI)
- **Large**: 32-40px (hero sections, primary features)

---

## Special Components

### Linear Gradient (React Native)
```typescript
import { LinearGradient } from 'expo-linear-gradient';

// Indigo → Sky
<LinearGradient
  colors={['#4f46e5', '#0ea5e9']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={styles.gradient}
/>
```

### Gradient Text (React Native)
```typescript
import MaskedView from '@react-native-masked-view/masked-view';

<MaskedView
  maskElement={<Text style={styles.text}>Text</Text>}
>
  <LinearGradient
    colors={['#4f46e5', '#0ea5e9']}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
  >
    <Text style={[styles.text, { opacity: 0 }]}>Text</Text>
  </LinearGradient>
</MaskedView>
```

### Backdrop Blur (React Native)
```typescript
import { BlurView } from 'expo-blur';

<BlurView intensity={80} tint="light" style={styles.blur}>
  {/* Content */}
</BlurView>
```

---

## Responsive Breakpoints

### Mobile First Design
- **Base**: 375px (iPhone SE)
- **Small**: 390px (iPhone 12/13)
- **Medium**: 428px (iPhone 14 Pro Max)
- **Large**: 768px (iPad)

### Max Container Width
- **Mobile**: 448px (centered on larger screens)
- **Tablet**: 640px

---

## Accessibility

### Color Contrast (WCAG AA/AAA)
- **Text on White**: Use Foreground (#1a1a2e) - 14.7:1 AAA
- **Text on Indigo**: Use White - Sufficient contrast
- **Links**: Indigo-600 on White - AA compliant
- **Buttons**: White text on gradients - AAA compliant

### Touch Targets
- **Minimum**: 44x44px (iOS guidelines)
- **Comfortable**: 48x48px
- **Hero Actions**: 56x56px

### Focus States
- **Ring**: 2px solid accent color
- **Offset**: 2px from element
- **Visible**: Always on keyboard navigation

---

## Animation & Motion

### Transitions
- **Duration**: 200-300ms
- **Easing**: ease-in-out, cubic-bezier(0.4, 0, 0.2, 1)

### Common Animations
- **Fade In**: Opacity 0 → 1, 200ms
- **Slide Up**: translate-y 20px → 0, 300ms
- **Scale**: scale 0.95 → 1, 200ms
- **Hover Lift**: translate-y 0 → -4px, 200ms
- **Spinner**: Rotate 360°, continuous

### Performance
- Use `transform` and `opacity` for best performance
- Avoid animating `height`, `width`, `top`, `left`
- Use `will-change` sparingly

---

## Implementation Notes

### React Native Considerations
1. **NativeWind**: Use for Tailwind CSS in React Native
2. **LinearGradient**: Requires `expo-linear-gradient`
3. **MaskedView**: Requires `@react-native-masked-view/masked-view`
4. **Blur**: Requires `expo-blur` (iOS/Android only)
5. **Icons**: Use `lucide-react-native`
6. **Shadows**: Use `elevation` property on Android, `shadow*` on iOS
7. **Border Radius**: Some complex shapes may need clipping
8. **Gradients**: Cannot be applied directly to text, use MaskedView

### Web Considerations
1. **Tailwind CSS**: Standard implementation
2. **Gradients**: CSS `linear-gradient()`
3. **Blur**: CSS `backdrop-filter: blur()`
4. **Icons**: Use `lucide-react`
5. **Hover States**: Full support
6. **Shadows**: CSS `box-shadow`

---

## Brand Voice & Tone

### Visual Communication
- **Modern**: Clean gradients, soft shadows, rounded corners
- **Friendly**: Playful icons (Sparkles, Crown), encouraging messages
- **Empowering**: "Suit Up!", "Style icon in the making!"
- **Smart**: AI-powered, data-driven (Style Match Score)
- **Gender-Neutral**: Indigo/Sky palette, inclusive language

### Messaging Examples
- "Your style, perfected daily ✨"
- "Want a fresh look?"
- "You're killing it! 🔥"
- "Expand your style collection"
- "Your perfect outfit is ready!"
- "Love It! Suit Up"

---

## File Export Settings (from Figma)

### Images
- **Format**: PNG for photos, SVG for icons
- **Scale**: 1x, 2x, 3x for React Native
- **Quality**: 80-90% for web, 100% for app assets

### Icons
- **Format**: SVG
- **Size**: 24x24px base (scale as needed)
- **Stroke Width**: 2px
- **Fill**: None (use currentColor)

### Spacing
- **Export**: 4px grid system
- **Measurement**: px (convert to dp/sp in code)

---

## Features & Functionality

This section documents the interactive features, user flows, data structures, and business logic visible in the Figma screens.

---

### Dashboard (Home Screen) - Features

#### User Stats Display
**Purpose**: Gamification and progress tracking

**Features:**
- **Day Streak Counter**
  - Tracks consecutive days of app usage
  - Displays current streak number
  - Icon: Flame (visual reinforcement of "hot" streak)
  - Updates daily at midnight

- **Style Score**
  - Numeric score (0-100) representing user's style consistency
  - Calculated based on: outfit variety, weather appropriateness, color matching
  - Icon: Star (achievement/rating metaphor)

- **Outfits Created Counter**
  - Total count of generated outfits in user's history
  - Increments with each outfit generation
  - Icon: Trophy (accomplishment)

**Data Structure:**
```typescript
interface UserStats {
  streak: number;           // Days of consecutive usage
  styleScore: number;       // 0-100
  outfitsCreated: number;   // Total count
}
```

#### Daily Motivation
**Purpose**: User engagement and positive reinforcement

**Features:**
- Rotates through 5+ motivational messages
- Selection based on current day of week (`new Date().getDay()`)
- Messages include emojis for visual appeal
- Always visible on dashboard load

**Message Examples:**
- "You're killing it! 🔥"
- "Style icon in the making! ⭐"
- "Confidence looks good on you! 💫"
- "Ready to slay the day! 👑"
- "Your best look awaits! ✨"

#### Weather Display
**Purpose**: Context for outfit recommendations

**Features:**
- **Real-time Weather Data**:
  - Current temperature (°F or °C based on user preference)
  - Weather condition (e.g., "Partly Cloudy", "Rainy")
  - Humidity percentage
  - Wind speed (mph or km/h)
  - Location (city, state/country)

- **Dynamic Weather Icon**:
  - Cloud icon for cloudy conditions
  - CloudRain icon for rainy conditions
  - Sun icon for clear conditions
  - Icon size: 48px

- **Date Display**:
  - Long format: "Thursday, November 4, 2025"
  - Uses `toLocaleDateString()` with locale options

**Data Structure:**
```typescript
interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  wind: number;
  location: string;
}
```

**API Integration**: Open-Meteo API (free weather service)

#### Daily Outfit Suggestion
**Purpose**: Automated outfit recommendation preview

**Features:**
- **AI-Generated Outfit Display**:
  - Shows 3 clothing items in grid layout
  - Each item includes: photo, name, category badge
  - Items selected based on weather + user preferences

- **Style Match Score**:
  - Percentage (0-100%) indicating outfit quality
  - Visual progress bar representation
  - Calculated by recommendation algorithm
  - Factors: weather appropriateness, color harmony, style consistency

- **AI Badge**:
  - "AI Picked" label with gradient background
  - Indicates automated recommendation

- **Weather Context**:
  - "Styled for 22° and partly cloudy"
  - Provides reasoning for outfit selection

**Data Structure:**
```typescript
interface OutfitItem {
  id: string;
  name: string;
  image: string;      // Photo URL
  category: string;   // Top, Bottom, Shoes, etc.
}

interface DailyOutfit {
  items: OutfitItem[];
  styleMatchScore: number;  // 0-100
  weatherContext: string;
}
```

#### Generate Outfit CTA
**Purpose**: Primary action to create new outfit

**Features:**
- **Call to Action**:
  - Title: "Want a fresh look?"
  - Description: "Generate a new outfit based on today's weather and your style!"
  - Button: "Generate Outfit" with Sparkles icon

- **User Flow**:
  1. User taps "Generate Outfit" button
  2. Triggers `onGenerateOutfit()` callback
  3. Navigates to Outfit Generator screen
  4. Runs recommendation algorithm

**Navigation:**
- Triggers navigation to `/outfit-generator` or shows modal
- Passes current weather data to generator

---

### Wardrobe (Closet) Screen - Features

#### Search Functionality
**Purpose**: Quick item discovery

**Features:**
- **Real-time Search**:
  - Filters items as user types
  - Searches across: item name, brand name
  - Case-insensitive matching
  - Instant results (no submit button)

- **Search Input**:
  - Placeholder: "Search your style..."
  - Icon: Search (magnifying glass)
  - Keyboard type: Text

**Implementation:**
```typescript
const filteredItems = wardrobeItems.filter((item) => {
  return item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
});
```

#### Category Filtering
**Purpose**: Browse items by type

**Features:**
- **Filter Options**:
  - All Items (default)
  - Tops
  - Bottoms
  - Dresses
  - Outerwear
  - Shoes
  - Accessories

- **Single Selection**:
  - Only one category filter active at a time
  - Combined with search query (AND logic)

- **UI Control**: Dropdown/Select menu with icon (SlidersHorizontal)

**Implementation:**
```typescript
const filteredItems = wardrobeItems.filter((item) => {
  const matchesSearch = /* search logic */;
  const matchesCategory = categoryFilter === "all" ||
                         item.category === categoryFilter;
  return matchesSearch && matchesCategory;
});
```

#### Clothing Item Cards
**Purpose**: Visual inventory display

**Features:**
- **2-Column Grid Layout**:
  - Responsive grid
  - Equal card heights
  - 16px gap between cards

- **Card Information**:
  - Item photo (square aspect ratio)
  - Category badge (e.g., "Top", "Shoes")
  - Season badge (e.g., "Summer", "All Season")
  - Item name (truncated if too long)
  - Color description

- **Hover/Press Interaction**:
  - Card lifts slightly (-4px translate)
  - Shadow increases
  - Border color changes from Indigo-50 to Indigo-200
  - "View Details" overlay appears on image

- **Tap Action**:
  - Opens item detail dialog
  - Shows full item information

**Data Structure:**
```typescript
interface ClothingItem {
  id: string;
  name: string;
  image: string;        // Main photo URL
  labelImage: string;   // Care label photo URL
  category: string;     // Category enum
  season: string;       // Season enum
  color: string;
  brand: string;
  size: string;
  material: string;
  notes: string;
}
```

#### Item Detail Dialog
**Purpose**: View complete item information

**Features:**
- **Dual Photo Display**:
  - Item photo (left)
  - Label photo (right)
  - Both photos are square, equal size

- **Detailed Information**:
  - Category badge
  - Season badge
  - Brand name
  - Size
  - Color
  - Material
  - Personal notes (if any)

- **Notes Display**:
  - Special background (Indigo-50)
  - Border (Indigo-100)
  - Rounded corners
  - Optional field (only shows if notes exist)

**User Actions:**
- Tap outside dialog to close
- Tap "Close" button to dismiss
- No edit capability (view-only)

#### Empty State
**Purpose**: First-time user guidance

**Features:**
- **Display Condition**: No items match current filters
- **Message**:
  - Primary: "No items found"
  - Secondary: "Try adjusting your search or filters"
- **Centered Layout**: Vertically and horizontally centered
- **Visual Weight**: Reduced opacity for secondary message

---

### Preferences (Profile) Screen - Features

#### Profile Display
**Purpose**: User identity and status

**Features:**
- **Profile Information**:
  - User name (editable)
  - Email address (editable)
  - Location (editable, used for weather)

- **Avatar**:
  - Placeholder with user initials fallback
  - Can upload custom photo (not shown in Figma, implied)
  - Circular shape with border

- **Status Badge**:
  - "Style Pro" badge with gradient background
  - Crown icon in corner (premium/achievement indicator)
  - Non-interactive (display-only)

**Data Structure:**
```typescript
interface UserProfile {
  name: string;
  email: string;
  location: string;
  avatar?: string;  // Optional photo URL
}
```

#### Profile Information Editing
**Purpose**: Update user details

**Features:**
- **Editable Fields**:
  - Name input field
  - Email input field (with email validation)
  - Location input field (with MapPin icon)

- **Input Validation**:
  - Email format validation
  - Required field indicators
  - Real-time updates to state

- **Location Integration**:
  - Location used for weather API calls
  - Format: "City, State/Country"
  - Could integrate with device GPS (not shown)

#### Style Preferences Configuration
**Purpose**: Customize outfit recommendations

**Features:**
- **Style Preference Selection**:
  - Dropdown with emoji icons
  - Options:
    - 🎯 Casual
    - 💼 Business
    - ⚡ Sporty
    - ✨ Elegant
    - 🔥 Streetwear
    - ⚪ Minimalist
  - Single selection
  - Affects recommendation algorithm weights

- **Color Palette Preference**:
  - Dropdown selection
  - Options:
    - ⚪ Neutral Tones
    - 🌈 Bold Colors
    - 🎨 Pastel Colors
    - ⬛ Monochrome
    - 🌿 Earth Tones
  - Influences color matching in outfits

- **Formality Level Slider**:
  - Range: 1-5 (Casual to Formal)
  - Visual slider control
  - Current level displayed as badge
  - Label shows "Level X of 5"
  - Affects outfit occasion matching

**Data Structure:**
```typescript
interface StylePreferences {
  stylePreference: 'casual' | 'business' | 'sporty' | 'elegant' | 'streetwear' | 'minimalist';
  colorPalette: 'neutral' | 'bold' | 'pastel' | 'monochrome' | 'earth';
  formality: number[];  // [1-5], array for slider component
}
```

#### Outfit Suggestion Toggles
**Purpose**: Control automated features

**Features:**
- **Daily Suggestion Toggle**:
  - Description: "Get a fresh outfit every morning"
  - When ON: Daily outfit generated automatically
  - When OFF: User must manually generate outfits
  - Default: ON

- **Weather-Based Toggle**:
  - Description: "Match outfits to weather conditions"
  - When ON: Algorithm considers temperature, precipitation, wind
  - When OFF: Weather ignored in recommendations
  - Default: ON

- **Occasion-Based Toggle**:
  - Description: "Consider your calendar events"
  - When ON: Checks calendar for events, adjusts formality
  - When OFF: Occasion context ignored
  - Default: ON (future feature, not fully implemented)

**Data Structure:**
```typescript
interface OutfitSuggestionSettings {
  dailySuggestion: boolean;
  weatherBased: boolean;
  occasionBased: boolean;
}
```

**Note**: Calendar integration requires system permissions (iOS/Android)

#### Notification Preferences
**Purpose**: Control push notifications

**Features:**
- **Enable Notifications Master Toggle**:
  - Description: "Receive app notifications"
  - When OFF: All other notification toggles disabled
  - Requires system notification permission

- **Outfit Reminder Toggle**:
  - Description: "Morning outfit notifications"
  - Sends push notification at configurable time (e.g., 8 AM)
  - Shows daily outfit suggestion

- **Weather Alerts Toggle**:
  - Description: "Get weather change alerts"
  - Notifies if weather changes significantly
  - Examples: "Rain expected today", "Temperature drop"

**Data Structure:**
```typescript
interface NotificationSettings {
  notifications: boolean;      // Master toggle
  outfitReminder: boolean;
  weatherAlerts: boolean;
}
```

**System Integration**: Requires push notification permissions (iOS/Android)

#### Save Preferences Action
**Purpose**: Persist user settings

**Features:**
- **Save Button**:
  - Full-width gradient button
  - Icon: Save
  - Text: "Save Preferences"

- **Save Behavior**:
  - Validates all fields
  - Persists to database/storage
  - Shows success toast: "🎉 Preferences saved successfully!"
  - No navigation (stays on screen)

- **Auto-save** (not shown, but recommended):
  - Could implement debounced auto-save
  - Would eliminate need for explicit save button

**Toast Notification**: Uses Sonner library for success feedback

---

### Add Item Screen - Features

#### Photo Upload System
**Purpose**: Capture clothing item and care label

**Features:**
- **Dual Photo Requirement**:
  - Item photo (main product shot)
  - Label photo (care instructions, brand tag)
  - Both required before submission

- **Photo Capture Methods** (implementation-dependent):
  - Take photo with camera
  - Choose from photo library
  - Both methods via `expo-image-picker` (React Native)

- **Upload States**:
  - **Empty**: Dashed border, upload icon, call-to-action text
  - **Uploading**: Progress indicator (not shown in Figma)
  - **Success**: Photo displayed, check badge, remove button

- **Photo Actions**:
  - Tap empty area → Open image picker
  - Tap X button → Remove photo, return to empty state
  - No crop/edit functionality shown

**Validation:**
- Both photos required
- File size limit (implementation-dependent, suggest 5MB max)
- Format: JPG, PNG

**Data Structure:**
```typescript
interface PhotoUpload {
  itemPhoto: string | null;   // Local file URI or base64
  labelPhoto: string | null;  // Local file URI or base64
}
```

#### Form Fields - Basic Information
**Purpose**: Catalog item metadata

**Features:**
- **Item Name** (Required):
  - Text input
  - Placeholder: "e.g., White Cotton T-Shirt"
  - Max length: 100 characters (recommended)

- **Category** (Required):
  - Dropdown selection
  - Options: Top, Bottom, Dress, Outerwear, Shoes, Accessories
  - Single selection

- **Season** (Optional):
  - Dropdown selection
  - Options: Spring, Summer, Fall, Winter, All Season
  - Multiple selection could be added

- **Color** (Optional):
  - Text input
  - Placeholder: "e.g., White"
  - Could implement color picker (not shown)
  - Could extract from photo automatically (future feature)

**Data Structure:**
```typescript
interface ItemBasicInfo {
  name: string;       // Required
  category: string;   // Required
  season?: string;
  color?: string;
}
```

#### Form Fields - Additional Details
**Purpose**: Extended item information

**Features:**
- **Brand** (Optional):
  - Text input
  - Placeholder: "e.g., Nike"
  - Could implement brand autocomplete (not shown)

- **Size** (Optional):
  - Text input
  - Placeholder: "e.g., M"
  - Free-form (XS, S, M, L, XL, or numeric)

- **Material** (Optional):
  - Text input
  - Placeholder: "e.g., 100% Cotton"
  - Could extract from label photo via OCR (future feature)

- **Notes** (Optional):
  - Textarea (3 rows)
  - Placeholder: "Add any additional notes about this item..."
  - Max length: 500 characters (recommended)
  - Examples: "Perfect for casual occasions", "Dry clean only"

**Data Structure:**
```typescript
interface ItemAdditionalDetails {
  brand?: string;
  size?: string;
  material?: string;
  notes?: string;
}

interface CompleteItemForm extends ItemBasicInfo, ItemAdditionalDetails {
  itemPhoto: string;
  labelPhoto: string;
}
```

#### Form Validation
**Purpose**: Ensure data quality

**Features:**
- **Required Field Validation**:
  - Item name cannot be empty
  - Category must be selected
  - Both photos must be uploaded

- **Validation Timing**:
  - On submit (not real-time)

- **Error Messages**:
  - "Please add both item and label photos"
  - "Please fill in required fields"
  - Toast notifications for errors

**Validation Logic:**
```typescript
if (!itemPhoto || !labelPhoto) {
  toast.error("Please add both item and label photos");
  return;
}

if (!formData.name || !formData.category) {
  toast.error("Please fill in required fields");
  return;
}
```

#### Submit Action
**Purpose**: Save item to wardrobe

**Features:**
- **Submit Button**:
  - Full-width gradient button
  - Icon: Sparkles
  - Text: "Add to Collection"
  - Disabled until photos uploaded (not shown but recommended)

- **Submit Behavior**:
  1. Validate all required fields
  2. Upload photos to storage (if using cloud)
  3. Save item data to database
  4. Show success toast: "🎉 Item added to your collection!"
  5. Reset form to empty state
  6. Could navigate to wardrobe screen (not shown)

- **Error Handling**:
  - Network errors
  - Storage quota errors
  - Validation errors

**Data Flow:**
```
User fills form
  → Taps submit
  → Validation
  → Photo upload
  → Database save
  → Success feedback
  → Form reset
```

---

### Outfit Generator Screen - Features

#### Pre-Generation State
**Purpose**: Initiate outfit generation

**Features:**
- **Back Navigation**:
  - Ghost button with arrow icon
  - Returns to previous screen (Dashboard)

- **Generation Card**:
  - Centered on screen
  - Title: "Ready to Suit Up?"
  - Description explains AI feature
  - Weather context display: "22° • Partly Cloudy • Casual Style"

- **Generate Button**:
  - Primary action
  - Text: "Generate My Outfit"
  - Icon: Sparkles
  - Triggers `handleGenerate()` function

**Loading State:**
- **Loading Indicator**:
  - Spinning RefreshCw icon
  - Text: "Analyzing your wardrobe..."
  - Progress bar at 66% (indeterminate animation)
  - Duration: ~2 seconds

**User Flow:**
```
Dashboard
  → Tap "Generate Outfit"
  → Navigate to Generator
  → Tap "Generate My Outfit"
  → Loading (2s)
  → Results shown
```

#### Outfit Generation Algorithm
**Purpose**: Select clothing items intelligently

**Features (inferred from code):**
- **Input Data**:
  - Current weather (temp, condition, wind, precipitation)
  - User style preferences
  - All wardrobe items
  - Item last worn dates

- **Selection Logic**:
  1. Filter available items (not in laundry, not archived)
  2. Score each item based on:
     - Weather appropriateness
     - Color harmony with other pieces
     - Style match to user preferences
     - Recency (avoid recently worn items)
  3. Select highest-scoring items per category:
     - 1 Top (or 1 Dress instead of top+bottom)
     - 1 Bottom (if no dress)
     - 1 Shoes
     - 1 Outerwear (if weather requires)
     - 1 Accessory (optional)

- **Output**:
  - Array of 3-5 outfit items
  - Style match percentage (0-100%)
  - Explanation for each item selection

**Item Scoring Example:**
```typescript
// Weather appropriateness
if (temp >= 24) warmthRequired = 0;        // Summer
else if (temp >= 16) warmthRequired = 1;   // Light layers
else if (temp >= 8) warmthRequired = 2;    // Jacket
else warmthRequired = 3;                   // Coat

// Item scoring
score = 100;
if (item.warmth >= warmthRequired) score += 10;  // Adequate warmth
if (item.warmth < warmthRequired) score -= 20;   // Too cold
if (daysSinceWorn < 7) score -= (10 * (7 - daysSinceWorn));  // Recently worn penalty
```

#### Post-Generation Display
**Purpose**: Show recommended outfit

**Features:**
- **Header Bar**:
  - Title: "Today's Outfit"
  - Date display
  - Regenerate button (outline style)

- **Regenerate Action**:
  - Re-runs algorithm with same inputs
  - May produce different results (randomization/variation)
  - Loading state shown during regeneration

#### Style Match Score
**Purpose**: Confidence indicator

**Features:**
- **Score Display**:
  - Percentage value (typically 85-100%)
  - Visual progress bar
  - Badge: "Perfect Match" (for high scores)

- **Score Explanation**:
  - Text: "This outfit perfectly matches your preferences and the weather!"
  - Provides reasoning for confidence level

- **Score Calculation** (inferred):
  - Weather match: 40% weight
  - Color harmony: 30% weight
  - Style preference match: 20% weight
  - Variety/freshness: 10% weight

#### Outfit Item Cards
**Purpose**: Display selected items with context

**Features:**
- **Item Display** (per item):
  - 96x96px square photo
  - Category badge (Top, Bottom, Shoes, etc.)
  - Item name
  - Selection reason with Sparkles icon

- **Selection Reason Examples**:
  - "Light & breathable for 22° weather"
  - "Versatile for partly cloudy conditions"
  - "Comfortable & matches your casual style"

- **Action Buttons** (per item):
  - **Swap Button**:
    - Outline style with RefreshCw icon
    - Opens swap dialog for that category

  - **In Laundry Button**:
    - Orange outline style
    - Marks item as unavailable
    - Auto-selects alternative from same category
    - Toast: "🧺 {item} marked as in laundry. Auto-selected {alt}!"

#### Swap Item Functionality
**Purpose**: Replace item with alternative

**Features:**
- **Swap Dialog**:
  - Title: "Swap {category}" (e.g., "Swap Top")
  - Description: "Choose an alternative from your wardrobe"

- **Alternative Items Grid**:
  - 2-column grid
  - Shows items from same category
  - Filtered by: same category, not in laundry, available

- **Item Selection**:
  - Tap item card to select
  - Replaces original item in outfit
  - Dialog closes automatically
  - Toast: "✨ Swapped to {item}!"
  - Reason updates to: "Swapped by you - great choice!"

**Data Structure:**
```typescript
interface SwapDialog {
  selectedItemToSwap: OutfitItem | null;
  alternativeItems: { [category: string]: WardrobeItem[] };
}
```

**Swap Logic:**
```typescript
const handleSwapItem = (item: WardrobeItem) => {
  const newOutfit = outfit.map(outfitItem =>
    outfitItem.id === selectedItemToSwap.id
      ? { ...item, reason: "Swapped by you - great choice!" }
      : outfitItem
  );
  setOutfit(newOutfit);
  setSelectedItemToSwap(null);
};
```

#### Laundry Basket Feature
**Purpose**: Mark items as unavailable

**Features:**
- **Laundry Action**:
  - Marks item as "in laundry" (unavailable)
  - Automatically selects random alternative from same category
  - Updates outfit immediately
  - No confirmation required

- **Auto-Selection Logic**:
  - Filters alternatives: same category, not in laundry
  - Randomly picks one alternative
  - Updates reason: "Auto-picked (original in laundry)"

- **Persistence** (implied):
  - Item remains in laundry status
  - Excluded from future outfit generations
  - User can manually mark as clean (not shown in Figma)

**Implementation:**
```typescript
const handleLaundryBasket = (item: OutfitItem) => {
  const alternatives = alternativeItems[item.category] || [];
  if (alternatives.length > 0) {
    const randomAlt = alternatives[Math.floor(Math.random() * alternatives.length)];
    const newOutfit = outfit.map(outfitItem =>
      outfitItem.id === item.id
        ? { ...randomAlt, reason: "Auto-picked (original in laundry)" }
        : outfitItem
    );
    setOutfit(newOutfit);
  }
};
```

#### Confirm Outfit Action
**Purpose**: Finalize outfit selection

**Features:**
- **Confirm Button**:
  - Full-width gradient button
  - Icon: Check
  - Text: "Love It! Suit Up"

- **Confirmation Behavior**:
  1. Saves outfit to history/database
  2. Marks all items as worn today (updates `lastWorn` timestamp)
  3. Increments user's "Outfits Created" stat
  4. Could update daily streak
  5. Success toast or navigation to outfit detail
  6. Returns to Dashboard

**Data Persistence:**
```typescript
interface OutfitHistory {
  id: string;
  date: number;           // Timestamp
  items: OutfitItem[];
  weather: WeatherData;
  styleMatchScore: number;
}
```

**Post-Confirmation Actions:**
- Update `items.lastWorn` for all outfit items
- Create `OutfitHistory` record
- Increment `userStats.outfitsCreated`
- Update `userStats.streak` if first outfit today

---

### Bottom Navigation (Tab Bar) - Features

#### Navigation Structure
**Purpose**: Primary app navigation

**Features:**
- **4 Main Tabs**:
  1. **Home**: Dashboard with stats and outfit suggestions
  2. **Closet**: Wardrobe/collection browsing
  3. **Add**: Create new wardrobe item (special centered tab)
  4. **Profile**: User preferences and settings

- **Active Tab Indication**:
  - Gradient background (Indigo → Sky)
  - White text and icon
  - Sparkle accent icon in top-right corner
  - Blurred gradient behind (depth effect)

- **Inactive Tab**:
  - Gray-600 text and icon
  - Transparent background
  - Hover: Indigo-600 text, Indigo-50 background

#### Add Button (Special Tab)
**Purpose**: Quick access to item creation

**Features:**
- **Always Highlighted**:
  - Always has gradient background
  - Circular container (distinct from other tabs)
  - Plus icon (20px, white)
  - White text label

- **Prominence**:
  - Slightly larger than other tabs
  - Always visually distinct
  - Encourages content creation

#### Tab Navigation Behavior
**Purpose**: Screen transitions

**Features:**
- **Tap Behavior**:
  - Navigates to corresponding screen
  - Updates active state immediately
  - Screen slides in (platform-dependent animation)

- **Deep Linking** (implied):
  - Each tab has persistent URL/route
  - Can link directly to specific tab
  - State preserved per tab

- **Badge Notifications** (not shown, but possible):
  - Could show notification badge on tabs
  - Example: New outfit suggestion on Home tab

**Navigation Routes:**
```typescript
const routes = {
  home: '/',
  wardrobe: '/wardrobe',
  add: '/add-item',
  preferences: '/preferences',
};
```

---

### Cross-Screen Features

#### Toast Notifications
**Purpose**: User feedback for actions

**Features:**
- **Success Toasts**:
  - Green checkmark or emoji
  - Examples:
    - "✨ Item photo added!"
    - "🎉 Item added to your collection!"
    - "🎉 Preferences saved successfully!"
    - "✨ Your perfect outfit is ready!"
    - "✨ Swapped to {item}!"

- **Error Toasts**:
  - Red X or warning icon
  - Examples:
    - "Please add both item and label photos"
    - "Please fill in required fields"

- **Info Toasts**:
  - Blue info icon
  - Example: "🧺 {item} marked as in laundry. Auto-selected {alt}!"

**Implementation**: Sonner library (v2.0.3)

#### Image Handling
**Purpose**: Robust photo display

**Features:**
- **ImageWithFallback Component**:
  - Attempts to load primary image URL
  - Falls back to placeholder on error
  - Shows loading state during fetch
  - Handles broken/missing images gracefully

- **Image Sources**:
  - Unsplash API (demo/mockups)
  - Local device storage (user photos)
  - Remote cloud storage (if using backend)

#### Responsive Layout
**Purpose**: Adapt to different screen sizes

**Features:**
- **Mobile-First Design**:
  - Base: 375px (iPhone SE)
  - Optimized for: 390px-428px (modern iPhones)
  - Max width: 448px (larger screens show centered)

- **Grid Adaptation**:
  - Wardrobe: 2 columns on mobile
  - Could expand to 3 columns on tablet (not shown)

- **Touch Targets**:
  - Minimum 44x44px (iOS guidelines)
  - Comfortable 48x48px for primary actions
  - Hero actions: 56x56px

#### Data Persistence
**Purpose**: Save user data locally

**Features (inferred, not shown in Figma):**
- **Local Storage**:
  - User preferences
  - Wardrobe items
  - Outfit history
  - User stats

- **Cloud Sync** (optional):
  - Backup to cloud storage
  - Sync across devices
  - Restore on new device

- **Offline Support**:
  - All core features work offline
  - Weather data cached
  - Sync when connection restored

**Storage Technologies:**
- React Native: AsyncStorage or Expo SQLite
- Web: LocalStorage or IndexedDB

---

### Algorithm Details

#### Outfit Recommendation Algorithm
**Purpose**: Intelligent outfit generation

**Inputs:**
1. **Weather Data**:
   - Temperature (°F/°C)
   - Condition (sunny, cloudy, rainy)
   - Humidity (%)
   - Wind speed (mph/km/h)
   - Precipitation (mm/in)

2. **User Preferences**:
   - Style preference (casual, business, sporty, etc.)
   - Color palette preference
   - Formality level (1-5)
   - Avoided tags/patterns (not shown in Figma)

3. **Wardrobe Items**:
   - All available items
   - Item metadata (category, warmth, color, etc.)
   - Last worn dates
   - Availability status (not in laundry)

**Algorithm Steps:**

**Step 1: Temperature-Based Warmth Requirements**
```
if temp >= 24°C (75°F):
  warmthLevel = 0 (summer clothing)
elif temp >= 16°C (61°F):
  warmthLevel = 1 (light layers)
elif temp >= 8°C (46°F):
  warmthLevel = 2 (jacket required)
else:
  warmthLevel = 3 (coat required)
```

**Step 2: Weather-Specific Requirements**
```
if precipitation >= 1mm:
  requireWaterproof = true
  priorityCategory = "Outerwear"

if windSpeed >= 25 kph:
  requireWindproof = true
  priorityCategory = "Outerwear"
```

**Step 3: Item Filtering**
```
availableItems = items.filter(item =>
  !item.archived &&
  !item.inLaundry &&
  item.warmth >= warmthLevel - 1 &&
  item.warmth <= warmthLevel + 1
)
```

**Step 4: Item Scoring**
```
function scoreItem(item, context):
  score = 100  // Base score

  // Weather appropriateness
  if item.warmth == warmthLevel:
    score += 10  // Perfect warmth match
  elif item.warmth < warmthLevel:
    score -= 20  // Too cold
  elif item.warmth > warmthLevel:
    score -= 10  // Too warm

  // Waterproof/windproof bonuses
  if requireWaterproof && item.waterproof:
    score += 15
  if requireWindproof && item.windproof:
    score += 15

  // Recency penalty (encourage variety)
  daysSinceWorn = (today - item.lastWorn) / 86400000
  if daysSinceWorn < 7:
    score -= 10 * (7 - daysSinceWorn)

  // Style preference match
  if item.tags.includes(userPreferences.stylePreference):
    score += 15

  // Color palette match
  if item.color in userPreferences.colorPalette:
    score += 10

  // Avoided tags penalty
  if item.tags.some(tag => userPreferences.avoidedTags.includes(tag)):
    score -= 50

  return score
```

**Step 5: Outfit Construction**
```
outfit = []

// Try to find a dress first
dress = findBestMatch(availableItems, category="Dress")
if dress:
  outfit.push(dress)
else:
  // Find top and bottom separately
  top = findBestMatch(availableItems, category="Top")
  bottom = findBestMatch(availableItems, category="Bottom")
  outfit.push(top, bottom)

// Always find shoes
shoes = findBestMatch(availableItems, category="Shoes")
if requireWaterproof:
  shoes = findBestMatch(availableItems, category="Shoes", waterproof=true)
outfit.push(shoes)

// Find outerwear if needed
if warmthLevel >= 2:
  outerwear = findBestMatch(availableItems, category="Outerwear")
  outfit.push(outerwear)

// Optionally find accessory
if random() > 0.5:  // 50% chance
  accessory = findBestMatch(availableItems, category="Accessory")
  if accessory:
    outfit.push(accessory)
```

**Step 6: Style Match Score Calculation**
```
function calculateStyleMatch(outfit, weather, preferences):
  // Weather appropriateness (40%)
  weatherScore = 0
  for item in outfit:
    if item.warmth == requiredWarmth:
      weatherScore += 25
  weatherScore = min(weatherScore, 100) * 0.4

  // Color harmony (30%)
  colorScore = calculateColorHarmony(outfit.colors) * 0.3

  // Style preference (20%)
  styleScore = 0
  for item in outfit:
    if item.styleMatch(preferences.stylePreference):
      styleScore += 20
  styleScore = min(styleScore, 100) * 0.2

  // Variety/freshness (10%)
  varietyScore = calculateVariety(outfit, recentOutfits) * 0.1

  totalScore = weatherScore + colorScore + styleScore + varietyScore
  return round(totalScore)  // 0-100
```

**Output:**
```typescript
{
  items: OutfitItem[],           // 3-5 items
  styleMatchScore: number,       // 85-100 typical
  explanations: {
    [itemId]: string            // "Light & breathable for 22° weather"
  },
  weatherContext: string        // "Styled for 22° and partly cloudy"
}
```

---

### Form Validation Rules

#### Add Item Form
**Field Validation:**

| Field | Required | Type | Min | Max | Validation |
|-------|----------|------|-----|-----|------------|
| Item Photo | Yes | Image | - | 5MB | JPG/PNG format |
| Label Photo | Yes | Image | - | 5MB | JPG/PNG format |
| Name | Yes | Text | 1 char | 100 chars | Non-empty |
| Category | Yes | Select | - | - | One of enum values |
| Season | No | Select | - | - | One of enum values |
| Color | No | Text | - | 50 chars | - |
| Brand | No | Text | - | 50 chars | - |
| Size | No | Text | - | 20 chars | - |
| Material | No | Text | - | 100 chars | - |
| Notes | No | Textarea | - | 500 chars | - |

#### Preferences Form
**Field Validation:**

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| Name | Yes | Text | 1-100 chars |
| Email | Yes | Email | Valid email format |
| Location | Yes | Text | 1-100 chars |
| Style Preference | Yes | Select | One of enum |
| Color Palette | Yes | Select | One of enum |
| Formality Level | Yes | Number | 1-5 |
| All Toggles | Yes | Boolean | true/false |

---

### Error Handling & Edge Cases

#### Network Errors
- **Weather API Failure**:
  - Show cached weather data
  - Display "Unable to update weather" message
  - Allow outfit generation with last known weather

- **Image Upload Failure**:
  - Retry upload automatically (3 attempts)
  - Show error toast with retry button
  - Save form data locally (prevent data loss)

#### Data Edge Cases
- **Empty Wardrobe**:
  - Show empty state: "Add items to start generating outfits"
  - CTA button: "Add Your First Item"
  - Disable outfit generation

- **Insufficient Items**:
  - If < 3 items per category, show warning
  - Still generate outfit with available items
  - Suggest adding more items

- **All Items In Laundry**:
  - Show message: "All items in this category are in laundry"
  - Suggest marking items as clean
  - Skip category in outfit

#### User Input Edge Cases
- **Special Characters in Names**:
  - Allow emojis and unicode
  - Sanitize for database storage

- **Very Long Item Names**:
  - Truncate in card view with ellipsis
  - Show full name in detail view

- **Duplicate Item Names**:
  - Allow duplicates (different items can have same name)
  - Distinguish by photo and ID

---

### Performance Considerations

#### Image Optimization
- **Thumbnail Generation**:
  - Create 200x200px thumbnails for grid display
  - Store original resolution for detail view
  - Lazy load images as user scrolls

- **Caching**:
  - Cache images locally after first load
  - Set cache expiration (30 days)
  - Clear cache on app update

#### Algorithm Performance
- **Outfit Generation Speed**:
  - Target: < 2 seconds
  - Use memoization for scoring functions
  - Cache color harmony calculations

- **Search Performance**:
  - Debounce search input (300ms)
  - Index items by name/brand for faster search
  - Limit results to 100 items max

#### Database Queries
- **Lazy Loading**:
  - Load wardrobe items in batches (20 at a time)
  - Infinite scroll for large collections

- **Indexing**:
  - Index by category, lastWorn, createdAt
  - Optimize for common queries

---

*Last Updated: November 2025*
*Design System Version: 1.0*
*Figma Project: Suit Up! - Modern Wardrobe Manager*
*Features Documentation: Complete*
