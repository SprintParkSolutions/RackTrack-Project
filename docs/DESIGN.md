---
name: RackTrack High-Fidelity Enterprise
colors:
  surface: '#f9f9ff'
  surface-dim: '#d3daef'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f3ff'
  surface-container: '#e9edff'
  surface-container-high: '#e1e8fd'
  surface-container-highest: '#dce2f7'
  on-surface: '#141b2b'
  on-surface-variant: '#434655'
  inverse-surface: '#293040'
  inverse-on-surface: '#edf0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#525657'
  on-tertiary: '#ffffff'
  tertiary-container: '#6b6e70'
  on-tertiary-container: '#eff1f3'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f9f9ff'
  on-background: '#141b2b'
  surface-variant: '#dce2f7'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  section-padding: 80px
  container-max-width: 1280px
  gutter: 24px
  margin: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The brand personality is anchored in **Precision, Transparency, and Authority**. As an infrastructure visibility platform, the design system must convey absolute reliability and "human-crafted" intentionality. The aesthetic follows a **refined enterprise minimalism**—moving away from generic SaaS "playfulness" toward a sophisticated, structural clarity.

The visual language prioritizes functional density over decorative elements. High whitespace ratios (80px+ section verticality) are used to prevent cognitive overload during complex data analysis. Every element serves a specific information purpose; if a border or shadow does not aid in hierarchy, it is removed. The result is a calm, focused environment that respects the professional user's time and expertise.

## Colors

The palette is restricted to high-contrast, professional tones to ensure maximum readability and an "enterprise-grade" feel.

- **Surface Strategy:** The primary canvas is pure `#FFFFFF`. To differentiate functional zones (like sidebars or secondary content areas), `#F8FAFC` is utilized.
- **Typography:** Primary text uses `#111827` for deep contrast. Secondary metadata uses `#6B7280`, ensuring a clear hierarchy of information.
- **Action & Brand:** `#2563EB` (Primary Blue) is reserved exclusively for primary actions and critical status indicators. `#0F172A` (Accent) is used for high-level navigation and structural headers to ground the layout.
- **Utility:** Borders are kept thin and subtle using `#E5E7EB` to define boundaries without adding visual weight.

## Typography

The design system utilizes **Inter** exclusively to maintain a systematic, utilitarian aesthetic. 

- **Headlines:** Large scale headlines utilize tight letter-spacing and heavy weights to create a sense of importance and "editorial" structure.
- **Body:** Standard body text is set to 16px with a generous 1.5 line height to accommodate long-form technical documentation and data logs.
- **Labels:** Small labels and data headers use 500/600 weights to remain legible at reduced sizes.
- **Mobile scaling:** Headline-XL should drop to Headline-LG scale on mobile devices to prevent awkward text wrapping.

## Layout & Spacing

This design system follows a strict **12-column fluid grid** for dashboard views and a **centered fixed-width grid** for marketing or report pages.

- **The 80px Rule:** All major sections must be separated by a minimum of 80px vertical padding. This creates the "premium/spacious" feel requested and allows the user's eyes to rest between data modules.
- **Grid Geometry:** On desktop, use 24px gutters. Margins are 32px on tablet and 16px on mobile. 
- **Component Spacing:** Use an 8px base unit for internal component padding. Buttons and input fields should favor horizontal internal padding (e.g., 16px sides, 10px top/bottom) to emphasize a stable, wide stance.

## Elevation & Depth

To maintain a "minimalist and professional" tone, depth is communicated through **tonal layering and low-contrast outlines** rather than heavy shadows.

- **Surface Tiers:** Level 0 is the white background. Level 1 (Cards/Modals) uses a 1px border (`#E5E7EB`).
- **Shadows:** Shadows are used sparingly only for floating elements like dropdowns or active modals. They should be "ambient"—multi-layered with low opacity (e.g., `0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -2px rgba(0,0,0,0.05)`).
- **Interactive Depth:** On hover, cards should not lift significantly. Instead, a subtle border-color change to Primary Blue or a very slight increase in shadow spread is preferred.

## Shapes

The shape language is **balanced and geometric**. 

- **Standard Radius:** 0.5rem (8px) is the default for most components, providing a modern but structured appearance.
- **Large Components:** Cards and major containers utilize 1rem (16px) or 1.5rem (24px) for the "rounded-xl" token to soften the large surface areas.
- **Interactive Elements:** Buttons can scale up to the "rounded-lg" (12px) or "rounded-xl" (16px) specification to feel tactile and distinct from data-heavy tables which remain sharper at 4-8px.

## Components

- **Buttons:** 
  - Primary: Solid `#2563EB` fill with white text. 12px border-radius.
  - Secondary: 1px border (`#E5E7EB`) with `#111827` text.
  - Hover states: Subtle darken of fill or light grey background for secondary.
- **Cards:** 
  - Flat 1px border (`#E5E7EB`). Background is pure white or `#F8FAFC`. No heavy shadows.
  - Internal padding should be a minimum of 24px to maintain the spacious philosophy.
- **Input Fields:**
  - 1px border with a soft 8px radius. Use `#6B7280` for placeholder text. Active state uses a 1px blue border and a soft blue outer glow (2px).
- **Data Tables:**
  - Minimalist approach. No vertical borders. Horizontal borders only. 
  - Header row uses `#F8FAFC` background and `label-sm` typography.
- **Chips/Badges:**
  - Small 4px radius. Low-saturation background tints (e.g., soft blue or soft grey) with high-contrast text.
- **Iconography:**
  - 24px grid, 1.5pt line weight. Never use filled icons unless indicating an active toggle state. Use single-color `#111827` or `#6B7280`.