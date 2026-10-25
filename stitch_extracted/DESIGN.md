---
name: Executive Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0d1c2f'
  on-tertiary-container: '#76859b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d5e3fd'
  tertiary-fixed-dim: '#b9c7e0'
  on-tertiary-fixed: '#0d1c2f'
  on-tertiary-fixed-variant: '#3a485c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  surface-light: '#F8FAFC'
  surface-muted: '#F1F5F9'
  border-subtle: '#E2E8F0'
  border-dark: '#1E293B'
  pure-white: '#FFFFFF'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.005em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies the identity of a modern digital engineering and design consultancy catering to ambitious startups and enterprise entities. The emotional resonance is defined by quiet authority, architectural rigor, and uncompromising clarity.

The visual execution combines **Modern Corporate Minimalism** with high-end **Editorial Rhythm**:
- Disciplined layout structures governed by strong vertical alignments and deliberate whitespace.
- Restrained, purposeful bursts of high-saturation cobalt accentuating interactive focal points against deeply composed navy or crisp light canvases.
- Avoidance of ornamental trends (no heavy frosted glass, skeuomorphic gloss, or multi-colored neon glows). Depth is instead communicated via structural borders, refined type scale contrasts, and disciplined elevation tiers.

## Colors

The palette leverages a high-contrast corporate framework balanced by an energetic accent tone.

- **Primary (`#0F172A` - Midnight Navy):** The structural core. Dictates foundational text, dominant headers, dark-mode surfaces, and prominent UI framing.
- **Secondary (`#2563EB` - Electric Blue):** High-priority interaction layer. Reserved for primary calls-to-action, focus indicators, active navigation segments, and key micro-interactions. Used sparingly to preserve impact.
- **Tertiary (`#334155` - Slate):** Supporting structural tint for secondary iconography, de-emphasized actions, and deep borders.
- **Neutral (`#64748B` - Muted Slate):** Utilized for metadata, secondary copy, captions, and structural borders (`#E2E8F0` on light mode).

### Usage Rules
- In light mode, backgrounds default to pure white (`#FFFFFF`) with sectioning or card backdrops utilizing `#F8FAFC` and `#F1F5F9`.
- High-emphasis cards or banner callouts may invert into deep Midnight Navy (`#0F172A`) with border outlines of `#1E293B` and electric blue focal accents.

## Typography

The typographic hierarchy pairs the structured, geometric optimism of **Plus Jakarta Sans** with the utilitarian precision of **Inter**.

- **Display & Headings (Plus Jakarta Sans):** Tightly tracked display and headline styles create an authoritative editorial feel. Headings above 24px employ negative letter spacing (`-0.01em` to `-0.03em`) to maintain optical density.
- **Body & Paragraphs (Inter):** Highly legible, neutral workhorse type optimized for dense case studies, technical documentation, and dashboard views. Standard line-height is tuned to 1.5x–1.6x for fatigue-free reading.
- **Labels, Navigation & Microcopy (Plus Jakarta Sans):** Used at medium and semi-bold weights for navigation, chips, buttons, and system flags, ensuring immediate visual anchor points.

## Layout & Spacing

The layout is built upon an 8pt base grid with an editorial 12-column dynamic framework.

- **Desktop (1024px+):** 12 columns, max-width container capped at `1280px`, `1.5rem` (`24px`) gutters, and `2rem` (`32px`) safe side margins.
- **Tablet (768px - 1023px):** 8 columns, `1.5rem` gutters, and `1.5rem` side margins.
- **Mobile (< 768px):** 4 columns, `1rem` (`16px`) gutters, and `1rem` (`16px`) outer margins.

Vertical rhythm is strictly maintained: stack groups use `space-sm` (`8px`) for tight pairings (e.g., label + input), `space-md` (`16px`) for paragraph sequences, `space-lg` (`24px`) between card elements, and `space-xl` (`40px`) or multiples for primary section dividers.

## Elevation & Depth

This system avoids heavy, diffuse shadows in favor of **disciplined border architecture** and **subtle ambient elevation**.

1. **Flat Tonal Grounding (Level 0):** Canvas layers (`#FFFFFF` or `#0F172A`) framed by crisp 1px borders (`#E2E8F0` or `#1E293B`).
2. **Subtle Surface Lift (Level 1):** Used on cards and static interactive surfaces. Achieved using a 1px border combined with an ambient drop: `0px 1px 3px rgba(15, 23, 42, 0.05), 0px 1px 2px rgba(15, 23, 42, 0.03)`.
3. **Floating Overlays & Popovers (Level 2):** Context menus, tooltips, and floating navigation bars. Elevated with `0px 10px 15px -3px rgba(15, 23, 42, 0.08), 0px 4px 6px -4px rgba(15, 23, 42, 0.04)` alongside a sharp 1px border.
4. **Modal Dialogs (Level 3):** Centered modal viewports utilize `0px 20px 25px -5px rgba(15, 23, 42, 0.12), 0px 8px 10px -6px rgba(15, 23, 42, 0.06)` with backdrop wash `rgba(15, 23, 42, 0.6)`.

## Shapes

The interface adopts a calibrated modern curvature (Level 2 - Rounded) that balances tech-forward friendliness with structural discipline.

- **Standard Elements (0.5rem / 8px):** Buttons, text inputs, dropdown triggers, and basic interactive chips.
- **Container Surfaces (1rem / 16px):** Content cards, dialog boxes, and segmented control backgrounds.
- **Large Panels (1.5rem / 24px):** Hero feature modules, prominent case study cards, and modal containers.
- **Full Pill (`9999px`):** Status badges, live indicator pills, and tag counters only.

## Components

### Buttons
- **Primary:** Solid `#2563EB` background with `#FFFFFF` text. Height: 44px (md), 36px (sm). Padding: 0 20px. Hover: `#1D4ED8`. Active state: subtle scale down (`transform: scale(0.98)`).
- **Secondary / Studio Dark:** Solid `#0F172A` background, white text, subtle border (`1px solid #1E293B`). Hover: `#1E293B`.
- **Outline / Minimal:** Background transparent, border: `1px solid #E2E8F0`, text: `#0F172A`. Hover: background `#F8FAFC`, border `#CBD5E1`.

### Input Fields
- **Container:** Height 44px, border `1px solid #E2E8F0`, background `#FFFFFF`, text `#0F172A` (`body-md`), border-radius `0.5rem`.
- **States:** Focus invokes a crisp ring: `border-color: #2563EB` with `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15)`. Placeholder color set to `#94A3B8`.

### Cards & Modules
- **Editorial Card:** Light background (`#FFFFFF`), `1px solid #E2E8F0`, padding `space-lg` (`24px`), border-radius `1rem`. Subtle elevation on hover (`translateY(-2px)` + Level 2 shadow).
- **Dark Studio Feature Card:** Background `#0F172A`, border `1px solid #1E293B`, title in pure white, secondary body text in `#94A3B8`, with Electric Blue accents on micro-labels or arrow icons.

### Badges & Chips
- **Status Pills:** Height 24px, pill-shaped (`9999px`), padding: `0 10px`, font: `label-sm`.
- **Active / Accent Badge:** Background `rgba(37, 99, 235, 0.08)`, text `#2563EB`, border: `1px solid rgba(37, 99, 235, 0.2)`.
- **Neutral Tag:** Background `#F1F5F9`, text `#475569`, border: `1px solid #E2E8F0`.

### Selection Controls (Checkboxes & Radios)
- **Checkbox:** 18px × 18px, border `1.5px solid #CBD5E1`, radius `4px`. Checked: background `#2563EB`, border `#2563EB`, white checkmark glyph.
- **Radio:** 18px × 18px circular, border `1.5px solid #CBD5E1`. Checked: border `#2563EB` with an internal 6px solid `#2563EB` core.

### Lists & Key-Value Grids
- Separated by clean `1px solid #E2E8F0` horizontal divider rules. Content uses `space-md` padding top and bottom with primary values weighted in `Plus Jakarta Sans` 600 and labels in `Inter` 400 (`#64748B`).