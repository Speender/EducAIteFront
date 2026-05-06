# Landing Page Production UI Spec (Codebase-Aligned)

## Purpose
This document defines how to implement the landing page as a production-ready experience while strictly matching the existing EducAIte frontend visual system and engineering patterns.

It is based on actual project files and existing UI behavior, not generic assumptions.

## Source-of-Truth References
- `src/index.css`
- `src/App.tsx`
- `src/components/Navbar.tsx`
- `src/components/LandingPageNavbar.tsx`
- `src/pages/landing/index.tsx`
- `src/pages/landing/components/LandingPage.tsx`
- `src/pages/landing/components/FeatureCarousel.tsx`
- `src/pages/landing/components/Developers.tsx`
- `src/pages/landing/components/Footer.tsx`
- `src/pages/auth/login/index.tsx`
- `src/pages/auth/login/components/LoginForm.tsx`
- `src/pages/auth/register/components/RegisterForm.tsx`
- `src/pages/main/components/DashboardHeader.tsx`
- `src/pages/main/components/BentoCards.tsx`
- `src/pages/auth/forgot/components/ForgotForm.tsx`

## Extracted UI Standards

### 1) Color Palette
Primary active brand patterns in production pages:
- Base background: `bg-black`
- Surface/card fills: `bg-[#111111]`, `bg-[#0A0A0A]`, `bg-[#050505]`
- Text: `text-white`, secondary text as `text-white/70`, `text-white/60`, `text-white/50`
- Accent: `#00CEC8` (`text-[#00CEC8]`, `border-[#00CEC8]`, glow/ring variants with alpha)
- Borders: `border-white/10`, `border-white/20`, often `border-[1.5px]`
- Interactive accent backgrounds: `bg-[#00CEC8]/10`, `bg-[#00CEC8]/15`, `bg-[#00CEC8]/20`

Note: The project has shadcn CSS variables in `src/index.css`, but route-level UI currently uses explicit dark + cyan utility classes as the dominant production style.

### 2) Typography
- Global family: `font-sans` (Geist Variable is configured in theme inline; Poppins is also imported)
- Typical heading style:
  - `font-bold`
  - `tracking-tight` or `tracking-tighter`
  - sizes such as `text-[56px]`, `text-[44px]`, `text-4xl`, `text-3xl`
- Body/caption styles:
  - body: `text-base` / `text-lg`
  - helper/meta: `text-sm`, `text-xs`
  - muted opacity variants on white text

### 3) Spacing and Rhythm
Common layout rhythm:
- Page shell: `min-h-screen`, `overflow-x-hidden`, `antialiased`
- Main container patterns: `max-w-[1200px]` to `max-w-[1280px]`, `mx-auto`, `px-6 md:px-12 lg:px-20`
- Section spacing tends to use viewport-based offsets in landing (`pt-[12vh]`, `pb-[6vh]`, `mt-[10vh]`) and token-style spacing in app pages (`p-6`, `p-8`, `p-10`, `p-12`)

### 4) Radius, Borders, Shadows
- Radius: `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-[24px]`, `rounded-[32px]`, `rounded-full`
- Border weight frequently: `border` or `border-[1.5px]`
- Shadow style:
  - soft dark depth on surfaces
  - selective glow on primary CTAs and active cyan states
  - examples: `shadow-[0_8px_30px_rgba(...)]`, `shadow-[0_0_20px_rgba(...)]`

### 5) Buttons
Established patterns:
- Primary CTA:
  - white background, black text
  - `font-bold`/`font-semibold`
  - rounded (`rounded-xl` or `rounded-full`)
  - subtle scale/shine on hover/active
- Secondary CTA:
  - black/transparent with white alpha border
  - white text
  - hover background lightening (`hover:bg-white/10`)

### 6) Inputs and Forms
Current convention from auth/forms:
- Dark form cards with white alpha border
- Inputs with dark fill and white text (except specific forgot-password input variant using white fill)
- Focus state uses cyan border and cyan-tinted ring shadow
- Placeholder uses white alpha

### 7) Cards/Panels
- Near-black surface + white alpha border + generous radius
- Internal spacing commonly `p-6` to `p-12`
- Accent labels/headings in cyan

### 8) Navigation Pattern
- Floating/fixed capsule nav in landing and main app:
  - `bg-black/50`, `backdrop-blur-md`
  - `border-[1.5px] border-white/20`
  - `rounded-full`
- Active states use stronger text + cyan underline/glow (main app navbar)

### 9) Interaction and Motion
- Motion is subtle and purposeful:
  - `transition-all` / `transition-colors` / `transition-transform`
  - hover scale between ~1.02 and 1.10 depending on control size
  - active downscale for press feedback
- Some animate-in utilities exist; avoid introducing unrelated heavy animation systems.

### 10) Engineering/Composition Patterns
- Functional React components with local state/hooks
- Tailwind utility-first inline class strings
- Minimal abstraction layer; no dominant shared `components/ui/*` system currently in use
- Naming follows feature-folder structure and page-level composition

## Landing Page: Production Requirements (Requested Scope)
Target: full landing route, including all important UX behavior.

### A) Sections Covered
1. Hero (`LandingPage.tsx`)
2. Features (`FeatureCarousel.tsx`)
3. About/Developers (`Developers.tsx`)
4. Footer (`Footer.tsx`)
5. Fixed landing navbar (`LandingPageNavbar.tsx`)

### B) Must-Have UX Hardening
- Loading states for remote image-heavy sections (carousel/developer images)
- Error fallback UI for failed image/media loads
- Empty-safe rendering if items arrays are missing or empty
- Keyboard-focus visibility on interactive controls
- Reduced-motion-aware fallback for intense animated surfaces
- Overflow-safe text behavior for long labels/content
- Clear disabled states where interaction is temporarily blocked

### C) Modal / Toast / Feedback Coverage
No landing-specific modal/toast system currently exists in this module.
If feedback UI is added for production parity:
- Match existing style language (dark surface, white text, cyan accents, rounded-xl/2xl, white alpha border)
- Keep transitions subtle and consistent with current pages
- Avoid introducing a new visual paradigm or unrelated component kit style

### D) Responsive Adaptation Requirements
- Preserve current desktop visual identity
- Ensure mobile-safe behavior for:
  - large absolute-positioned hero elements
  - fixed nav touch targets
  - feature headers with viewport-relative paddings
  - stack/carousel components that currently rely on large canvas/card sizes
- Maintain consistent spacing rhythm (`px-6` baseline and existing breakpoints)

## Consistency Guardrails (Do Not Violate)
- Do not introduce a new color palette
- Do not replace established cyan accent with another accent
- Do not add random card/button/input variants
- Do not switch to a different typography system
- Do not add heavy glassmorphism/gradient language not already present
- Do not introduce icon families inconsistent with existing usage

## Reuse Targets Before Building New UI
Prefer reuse/extension of:
- Existing CTA button class patterns from auth and main pages
- Existing dark card panel patterns from auth/course/calendar/analytics
- Existing nav capsule behavior from landing/main navbars
- Existing loading micro-pattern from forgot-password submit state

## Impeccable Skills Applied
- `normalize`: extracted and enforced design-system-consistent implementation boundaries
- `harden`: identified robustness requirements (error/loading/empty/reduced-motion/overflow)
- `adapt`: established responsive adaptation expectations for landing-specific absolute layouts
- `polish`: defined final visual and interaction quality checklist for production readiness

## Implementation Acceptance Checklist
- [ ] Looks native to current EducAIte pages
- [ ] Uses existing dark + white + cyan language
- [ ] Reuses existing shape/border/shadow/button/input patterns
- [ ] Adds resilient loading/error/empty behavior where needed
- [ ] Mobile/tablet/desktop layouts remain coherent
- [ ] No new design system introduced
- [ ] Code remains maintainable and composition-friendly

## Assumptions
- "All of the page" refers to the landing route (`/`) and all child sections/components.
- "Modals, toast, loading, everything important" is interpreted as production-grade state/feedback hardening for landing UX while preserving current codebase style.
