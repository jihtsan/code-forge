---
name: Precision Editorial & Logistics Studio
colors:
  surface: '#fcf8fb'
  surface-dim: '#dcd9dc'
  surface-bright: '#fcf8fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f5'
  surface-container: '#f0edef'
  surface-container-high: '#eae7ea'
  surface-container-highest: '#e4e2e4'
  on-surface: '#1b1b1d'
  on-surface-variant: '#414753'
  inverse-surface: '#303032'
  inverse-on-surface: '#f3f0f2'
  outline: '#717785'
  outline-variant: '#c1c6d6'
  surface-tint: '#005cbb'
  primary: '#0059b5'
  on-primary: '#ffffff'
  primary-container: '#0071e3'
  on-primary-container: '#fcfbff'
  inverse-primary: '#abc7ff'
  secondary: '#006e28'
  on-secondary: '#ffffff'
  secondary-container: '#6ffb85'
  on-secondary-container: '#00732a'
  tertiary: '#006762'
  on-tertiary: '#ffffff'
  tertiary-container: '#00827c'
  on-tertiary-container: '#effffc'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d7e2ff'
  primary-fixed-dim: '#abc7ff'
  on-primary-fixed: '#001b3f'
  on-primary-fixed-variant: '#00458f'
  secondary-fixed: '#72fe88'
  secondary-fixed-dim: '#53e16f'
  on-secondary-fixed: '#002107'
  on-secondary-fixed-variant: '#00531c'
  tertiary-fixed: '#61f9ef'
  tertiary-fixed-dim: '#39dcd2'
  on-tertiary-fixed: '#00201e'
  on-tertiary-fixed-variant: '#00504c'
  background: '#fcf8fb'
  on-background: '#1b1b1d'
  surface-variant: '#e4e2e4'
typography:
  display-hero:
    fontFamily: libreFranklin
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: libreFranklin
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-xl:
    fontFamily: libreFranklin
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: libreFranklin
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: libreFranklin
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: libreFranklin
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: libreFranklin
    fontSize: 17px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: libreFranklin
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-md:
    fontFamily: libreFranklin
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: libreFranklin
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: libreFranklin
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-caps:
    fontFamily: libreFranklin
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
  mono-data:
    fontFamily: jetbrainsMono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  spacing-2xs: 0.125rem
  spacing-xs: 0.25rem
  spacing-sm: 0.5rem
  spacing-md: 0.75rem
  spacing-base: 1rem
  spacing-lg: 1.25rem
  spacing-xl: 1.5rem
  spacing-2xl: 2rem
  spacing-3xl: 2.5rem
  spacing-4xl: 3rem
  spacing-5xl: 4rem
  spacing-6xl: 6rem
  gutter-mobile: 1rem
  gutter-desktop: 1.5rem
  margin-mobile: 1.25rem
  margin-tablet: 2rem
  margin-desktop: 3rem
  max-width-canvas: 88rem
---

## Brand & Style
The design system adopts a crystalline, high-fidelity aesthetic inspired by modern industrial Apple software and precision vector instruments. Designed for demanding logistics pipelines, vector barcode generation, and publishing distribution systems, the interface commands absolute clarity, frictionless interaction, and visual serenity.

- **Personality:** Authoritative, razor-sharp, meticulously refined, uncluttered, and effortlessly fluid.
- **Target Audience:** Production directors, packaging graphic engineers, logistics architects, and technical publishing operators who require extreme visual fidelity and exactitude.
- **Emotional Response:** Inspires calm mastery, absolute reliability, and executive polish through immense spatial breathing room and crystalline legibility.
- **Design Style:** Modern Minimalist Frosted Cupertino. Surfaces rely on pure whites (`#ffffff`) layered over porcelain and ceramic neutral planes (`#f5f5f7`, `#fbfbfd`), accented with translucent frosted glassmorphism (`backdrop-filter: blur(20px)`), razor-thin 0.5px hairline dividers, and the signature California azure accent.

## Colors
The palette is hyper-disciplined, dominated by luminous neutral ceramic layers that elevate vector barcode linework and typographic detail.

- **Surface System:**
  - `surface-canvas`: `#fbfbfd` (ultra-pale ambient studio backdrop)
  - `surface-base`: `#ffffff` (crisp card, modal, and structural canvas)
  - `surface-secondary`: `#f5f5f7` (segmented control backdrops, toolbars, and inactive wells)
  - `surface-tertiary`: `#f2f2f7` (nested containers, subtle code block fields)
  - `surface-frosted`: `rgba(255, 255, 255, 0.82)` with `backdrop-filter: blur(24px) saturate(180%)`
- **Border & Hairline System:**
  - `border-subtle`: `rgba(0, 0, 0, 0.05)`
  - `border-default`: `rgba(0, 0, 0, 0.10)` / `#e5e5ea`
  - `border-strong`: `#d1d1d6`
- **Text & Content Tone:**
  - `text-primary`: `#1d1d1f` (deep ink black, optimal optical contrast)
  - `text-secondary`: `#86868b` (muted slate for metadata, captions, and secondary labels)
  - `text-tertiary`: `#aeaeb2` (placeholders, disabled icons)
- **Accents & Semantics:**
  - `accent-primary`: `#0071e3` (interactive blue, CTA buttons, focus rings, selected vector nodes)
  - `accent-primary-hover`: `#0077ed`
  - `accent-success`: `#34c759` (emerald for verified scan status, checksum approvals)
  - `accent-info`: `#00c7be` (cyan for active telemetry tags and data-stream highlights)
  - `accent-warning`: `#ff9f0a` (amber for non-critical barcode density warnings)
  - `accent-danger`: `#ff3b30` (crimson for validation failure or payload overflow)

## Typography
Libre Franklin provides pristine legibility, crisp geometric apertures, and an authentic humanist balance that mirrors Cupertino's native system typography.

- **Tracking Rules:** Tighter negative tracking (`-0.03em` to `-0.015em`) must be strictly applied to headings and titles above 17px to recreate typographic density and confident poise. Labels and metadata under 12px leverage neutral to positive letter spacing (`0.01em` to `0.06em`).
- **Data & Barcode Codecs:** Barcode alphanumeric payloads, ISBN checksums, GS1 application identifiers, and raw binary coordinates must render using `mono-data` (`jetbrainsMono`) with tabular lining figures to guarantee character column alignment.
- **Hierarchy Enforcements:** Never apply bold weights purely for emphasis; rely on contrast between `#1d1d1f` and `#86868b` to structure visual importance without creating graphic clutter.

## Layout & Spacing
The layout architecture emphasizes generous white space, disciplined modular grids, and clear structural separation.

- **Grid Framework:**
  - **Desktop (≥1024px):** 12-column dynamic fluid grid with a maximum structural width of `88rem` (1408px), `1.5rem` (24px) gutters, and `3rem` outer margins.
  - **Tablet (768px – 1023px):** 8-column grid with `1.25rem` (20px) gutters and `2rem` outer margins.
  - **Mobile (<768px):** 4-column layout with `1rem` (16px) gutters and `1.25rem` outer margins.
- **Rhythm & Padding:** Component spacing conforms to an 8pt base grid with a 4pt micro-subdivision. Structural content bands use generous vertical breathing room (`4rem` to `6rem`) to produce an editorial gallery aura.
- **Precision Vectors & Workspace:** In barcode design views and inspection viewports, toolbars dock floating in the center-top or bottom-center surrounded by uninterrupted ceramic white space.

## Elevation & Depth
Depth is constructed through ambient atmospheric diffusion, translucent material layers, and microscopic hairlines rather than harsh shadows.

- **Atmospheric Diffusion Shadows:**
  - `elevation-subtle`: `0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)` (interactive buttons, segmented pills)
  - `elevation-card`: `0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)` (floating panels, barcode inspect cards)
  - `elevation-floating`: `0 12px 32px rgba(0, 0, 0, 0.06), 0 2px 6px rgba(0, 0, 0, 0.03)` (floating inspectors, popovers, vector toolbars)
  - `elevation-modal`: `0 24px 60px rgba(0, 0, 0, 0.08), 0 6px 16px rgba(0, 0, 0, 0.04)` (modal dialogs, key production drawers)
- **Glassmorphism & Surface Materials:**
  - Floating top navigation bars, filter toolbars, and contextual inspectors feature `rgba(255, 255, 255, 0.82)` paired with `backdrop-filter: blur(20px) saturate(180%)`.
  - Glass panels carry a razor-thin inner top highlight: `box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.9)`.
- **Micro-Hairline Boundaries:**
  - All cards, panels, and dropdown containers must be bounded by a 1px (or 0.5px retina) stroke using `border-subtle` (`rgba(0, 0, 0, 0.07)`).

## Shapes
Shapes celebrate Cupertino's signature smooth continuous curvature (squircle geometry). Corners flow naturally without optical pinching.

- **Base Radius Standards:**
  - Default Elements (`rounded`): `0.5rem` (8px) for input fields, list tiles, and small action controls.
  - Medium Elements (`rounded-lg`): `1rem` (16px) for cards, modular inspector panels, vector preview viewports, and modals.
  - Large Elements (`rounded-xl`): `1.5rem` (24px) for hero containers and overarching page framing.
  - Pills: `9999px` strictly reserved for status badges, segmented control sliders, search bars, and primary floating action buttons.
- **Corner Smoothing:** Where CSS allows, implement `corner-smoothing: 60%` or use squircle clip-paths to emulate native iOS/macOS curvature.

## Components

### Buttons
- **Primary:** Background `#0071e3`, text `#ffffff`, font weight `500`. Border-radius `9999px` (pill) or `8px` depending on context. Micro-shadow `0 2px 8px rgba(0, 113, 227, 0.25)`. On hover: `#0077ed`, transforms subtly with `transform: scale(1.01)`.
- **Secondary / Ghost:** Ceramic background `#f5f5f7`, text `#1d1d1f`, hairline border `1px solid rgba(0, 0, 0, 0.05)`. On hover: `#e5e5ea`.
- **Frosted Minimal:** Translucent background `rgba(255, 255, 255, 0.7)`, backdrop blur `12px`, border `1px solid rgba(0, 0, 0, 0.08)`, text `#1d1d1f`.

### Input Fields & Search Bars
- **Style:** Clean rectangular surface in `#ffffff` or filled background `#f5f5f7` with a 0.5px hairline border `#d1d1d6`.
- **Focus State:** Hairline switches to `#0071e3` accompanied by a soft atmospheric halo `0 0 0 4px rgba(0, 113, 227, 0.15)`. No default browser outlines.
- **Typography:** `body-md` in `#1d1d1f` with placeholders in `#86868b`.

### Segmented Controls (Cupertino Switchers)
- **Container:** Recessed `#f2f2f7` background, `0.5rem` rounded, padded with `2px`.
- **Active Segment:** `#ffffff` pill or squircle, shadow `0 2px 6px rgba(0,0,0,0.08)`, text `#1d1d1f` with bold weight `600`.
- **Inactive Segment:** Text `#86868b`, hover transition to `#1d1d1f`.

### Cards & Precision Inspectors
- **Architecture:** Pure crisp white surface `#ffffff`, radius `1rem` (16px), bordered with `1px solid rgba(0, 0, 0, 0.06)`, shadow `0 4px 20px rgba(0, 0, 0, 0.04)`.
- **Inner Header:** Border-bottom `1px solid #f2f2f7`, padded with `1.25rem 1.5rem`.

### Chips & Verified Status Badges
- **Verified / Passed:** Pill container with background `rgba(52, 199, 89, 0.12)`, text `#248a3d`, border `1px solid rgba(52, 199, 89, 0.25)`. Features a 6px circular green indicator dot.
- **Telemetry / Vector Active:** Background `rgba(0, 199, 190, 0.12)`, text `#00837d`, border `1px solid rgba(0, 199, 190, 0.25)`.
- **Neutral Tag:** Background `#f5f5f7`, text `#86868b`, border `1px solid rgba(0, 0, 0, 0.06)`.

### Barcode & Vector Viewport Canvas
- **Design:** Crisp `#ffffff` canvas floating over `#fbfbfd`. Subtle vector grid lines using `rgba(0, 0, 0, 0.03)` with 10px subdivisions.
- **Ruler & Coordinates:** Monospace 10px text `#86868b` pinned along top and left hairlines.
- **Selection Bounding Box:** `#0071e3` 1px border with `rgba(0, 113, 227, 0.08)` fill and 6px rounded corner nodes.

### Checkboxes & Radio Controls
- **Radio Buttons:** Circular, checked state renders an outer `#0071e3` ring with an inner concentric white pip.
- **Checkboxes:** Smooth 4px squircle. Selected state is solid `#0071e3` with a crisp `#ffffff` vector checkmark.