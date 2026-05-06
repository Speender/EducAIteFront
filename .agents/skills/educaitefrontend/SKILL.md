---
name: educaitefrontend
description: >
  Enforces the frontend architecture, routing, component, styling, state,
  API integration, and code-quality patterns used in the EducAIte frontend codebase.
---

## Scope
RULE: Apply this skill to the Vite React frontend under `Frontend/src`, wired from `main.tsx` to `App.tsx` — Evidence: `Frontend/src/main.tsx`

## Project Structure
RULE: Route-level pages live in `src/pages`, with many route entries using `index.tsx` per page folder — Evidence: `Frontend/src/pages/auth/login/index.tsx`  
RULE: Shared reusable UI and app-wide components live in `src/components` and `src/components/ui` — Evidence: `Frontend/src/components/ProtectedRoute.tsx`  
RULE: Domain logic is organized by feature under `src/features/<feature>` with local `api`, `components`, `hooks`, and `lib` folders as needed — Evidence: `Frontend/src/features/resume/hooks/useResumeStore.ts`

## Tech Stack
RULE: Frontend uses React + TypeScript + Vite, with Tailwind v4 and shadcn setup — Evidence: `Frontend/package.json`  
RULE: Async server state is handled with TanStack Query via a shared `QueryClientProvider` — Evidence: `Frontend/src/main.tsx`  
RULE: Forms use `react-hook-form` + `zod` validation resolvers — Evidence: `Frontend/src/pages/auth/login/components/LoginForm.tsx`

## Architecture Pattern
RULE: App shell composes router, toast provider, and protected/public route split in a single app entry flow — Evidence: `Frontend/src/App.tsx`  
RULE: API flow is `dto schema` + optional `mappers` + `service` + `hooks` (React Query wrapper) — Evidence: `Frontend/src/features/auth/api/service.ts`  
RULE: Feature hooks own query keys and cache invalidation behavior — Evidence: `Frontend/src/features/notes/api/hooks.ts`

## Routing Rules
RULE: Root route redirects authenticated users to `/main`; unauthenticated users see landing page — Evidence: `Frontend/src/App.tsx`  
RULE: Protected routes use `<Route element={<ProtectedRoute />}>` with `Outlet` + redirect to `/login` — Evidence: `Frontend/src/components/ProtectedRoute.tsx`  
RULE: Feature sub-routing is nested inside page modules (example: flashcards workspace/card/session routes) — Evidence: `Frontend/src/pages/flashcards/index.tsx`  
RULE: Route path helper functions are centralized per feature where used — Evidence: `Frontend/src/features/flashcards/routes.ts`

## Component Rules
RULE: Shadcn-style primitives are kept in `src/components/ui` and use `cn(...)` + CVA variants — Evidence: `Frontend/src/components/ui/button.tsx`  
RULE: Feature-specific reusable pieces live in `src/features/<feature>/components` — Evidence: `Frontend/src/features/certificates/components/CertificateList.tsx`  
RULE: Page-local UI fragments live in `src/pages/<page>/components` — Evidence: `Frontend/src/pages/settings/components/ProfileTab.tsx`  
RULE: Toast access is via `useToast`, and must be used within `ToastProvider` — Evidence: `Frontend/src/components/ToastProvider.tsx`

## UI and Styling Rules
RULE: Styling is Tailwind utility-first in component `className` strings — Evidence: `Frontend/src/pages/certificates/index.tsx`  
RULE: Global design tokens and dark-mode CSS variables are defined in `src/index.css` — Evidence: `Frontend/src/index.css`  
RULE: Shadcn CSS integration and aliases are configured through `components.json` — Evidence: `Frontend/components.json`  
RULE: Tailwind v4 is integrated through Vite plugin, not a Tailwind config file — Evidence: `Frontend/vite.config.ts`

## API Integration Rules
RULE: All HTTP clients come from centralized axios instances (`apiClient`, `publicApiClient`) — Evidence: `Frontend/src/lib/api/client.ts`  
RULE: Request/response payloads are parsed with Zod schemas in services before use — Evidence: `Frontend/src/features/documents/api/service.ts`  
RULE: Dynamic path params are URL-encoded with `encodeURIComponent` in service calls — Evidence: `Frontend/src/features/documents/api/service.ts`  
RULE: API errors are normalized through shared helpers and rendered with `getErrorMessage` in UI — Evidence: `Frontend/src/lib/api/errors.ts`

## State Management Rules
RULE: Server/cache state uses React Query hooks with feature query keys — Evidence: `Frontend/src/features/student-courses/api/hooks.ts`  
RULE: Mutations invalidate relevant feature keys after successful writes — Evidence: `Frontend/src/features/folders/api/hooks.ts`  
RULE: Local UI state stays inside components via React hooks (`useState`, `useMemo`, etc.) — Evidence: `Frontend/src/pages/course/index.tsx`  
RULE: Resume editing flow uses a dedicated Zustand store for cross-component state — Evidence: `Frontend/src/features/resume/hooks/useResumeStore.ts`  
RULE: Auth/session state persists in localStorage and is cleared on 401 interceptor responses — Evidence: `Frontend/src/lib/api/auth.ts`

## Type and DTO Rules
RULE: DTO schemas and DTO types are colocated in `feature/api/dto.ts` — Evidence: `Frontend/src/features/auth/api/dto.ts`  
RULE: Naming pattern is `*DtoSchema` for schemas and `*Dto` (or request/response variants) for types — Evidence: `Frontend/src/features/resume/api/dto.ts`  
RULE: Form pipelines can separate input/output with `z.input` and `z.output` types — Evidence: `Frontend/src/features/onboarding/api/dto.ts`  
RULE: Mapper functions translate DTOs to app/session view models — Evidence: `Frontend/src/features/auth/api/mappers.ts`

## Naming Conventions
RULE: Feature folders use kebab-case names (e.g. `student-courses`, `smart-quiz`, `student-profile`) — Evidence: `Frontend/src/features/student-courses/api/service.ts`  
RULE: Page route entry files commonly use `index.tsx` in page folders — Evidence: `Frontend/src/pages/tracker/index.tsx`  
RULE: API layer file names are standardized as `dto.ts`, `service.ts`, `hooks.ts`, and optional `mappers.ts` — Evidence: `Frontend/src/features/onboarding/api/service.ts`  
RULE: Route helper APIs use `get...Path` naming — Evidence: `Frontend/src/features/smart-quiz/routes.ts`

## New Feature Checklist
RULE: Add routes in `App.tsx` and guard private pages with `ProtectedRoute` nesting — Evidence: `Frontend/src/App.tsx`  
RULE: Create feature API layer as `dto.ts` + `service.ts` + `hooks.ts`, with schema parsing in service — Evidence: `Frontend/src/features/auth/api/service.ts`  
RULE: Use feature query keys and invalidate caches on mutation success — Evidence: `Frontend/src/features/notes/api/hooks.ts`  
RULE: Add UI using `components/ui` primitives or feature/page-local components by scope — Evidence: `Frontend/src/components/ui/button.tsx`  
RULE: Handle loading/error/empty states explicitly in page screens — Evidence: `Frontend/src/pages/documents/DocumentDetailsPage.tsx`

## Things To Avoid
RULE: Do not call feature services directly from pages when a feature hook exists; pages consume hooks — Evidence: `Frontend/src/pages/course/index.tsx`  
RULE: Do not bypass schema validation for API payloads/responses in services — Evidence: `Frontend/src/features/onboarding/api/service.ts`  
RULE: Do not place protected screens outside the protected route branch — Evidence: `Frontend/src/App.tsx`  
RULE: Do not create auth logic outside shared auth/session utilities and interceptor flow — Evidence: `Frontend/src/lib/api/client.ts`


## UI Feeling Direction

RULE: When creating or refactoring UI, match the feeling of the provided reference: calm, clean, spacious, focused, modern SaaS, lightweight, and polished without being flashy — Evidence: `Frontend/src/index.css`, `Frontend/src/components/ui/button.tsx`

RULE: Keep the UI easy to understand with low text density, clear spacing, strong hierarchy, and one obvious primary action — Evidence: `Frontend/src/pages/auth/login/components/LoginForm.tsx`, `Frontend/src/pages/documents/DocumentDetailsPage.tsx`

RULE: Do not copy the exact reference layout or colors. Use it only for visual feeling, pacing, spacing, and clarity — Evidence: `Frontend/src/index.css`

RULE: Avoid crowded screens, excessive cards, long helper text, loud colors, heavy borders, decorative gradients, and generic AI-looking dashboards — Evidence: `Frontend/src/pages/landing/components/LandingPage.tsx`

## UI Color Principle

### Overall Principle

RULE: EducAIte frontend uses a dark-first, high-contrast visual system anchored by one brand accent: cyan `#00CEC8` — Evidence: `Frontend/src/App.tsx`, `Frontend/src/index.css`, `Frontend/src/components/StatusBanner.tsx`

RULE: Global shells and major surfaces should prefer dark backgrounds with white text for readability and focus — Evidence: `Frontend/src/App.tsx`, `Frontend/src/pages/landing/index.tsx`

RULE: Cyan is the primary action and emphasis color. Use it for active states, CTA highlights, focus states, highlighted words, and brand accents — Evidence: `Frontend/src/index.css`, `Frontend/src/components/Navbar.tsx`, `Frontend/src/pages/landing/components/LandingPage.tsx`

### Base and Surface

RULE: Use black or near-black backgrounds such as `bg-black`, `#050505`, `#0A0A0A`, and `#111111` when matching current page-level visual direction — Evidence: `Frontend/src/App.tsx`, `Frontend/src/pages/landing/index.tsx`, `Frontend/src/pages/analytics/index.tsx`

RULE: Create depth with opacity, blur, and soft borders instead of many competing colors — Evidence: `Frontend/src/pages/landing/index.tsx`, `Frontend/src/components/SuccessToast.tsx`

RULE: Prefer subtle surface treatments like `bg-white/5`, `border-white/10`, and muted shadows on dark backgrounds — Evidence: `Frontend/src/components/SuccessToast.tsx`, `Frontend/src/pages/analytics/index.tsx`

### Typography

RULE: Use white foreground text with opacity variants such as `text-white/60` and `text-white/70` for hierarchy on dark screens — Evidence: `Frontend/src/App.tsx`, `Frontend/src/pages/landing/components/LandingPage.tsx`, `Frontend/src/pages/not-found/index.tsx`

RULE: Keep copy short and scannable. Use spacing and hierarchy instead of long explanations — Evidence: `Frontend/src/pages/not-found/index.tsx`, `Frontend/src/pages/documents/DocumentDetailsPage.tsx`

### Semantic States

RULE: Use semantic colors for feedback: red/rose for errors, warning colors for warnings, info colors for informational states, and success variants for success states — Evidence: `Frontend/src/components/StatusBanner.tsx`, `Frontend/src/components/ui/badge.tsx`

RULE: Success can use cyan-tinted custom components or the existing success badge variant depending on context — Evidence: `Frontend/src/components/StatusBanner.tsx`, `Frontend/src/components/SuccessToast.tsx`, `Frontend/src/components/ui/badge.tsx`

RULE: Error states must remain visually clear and high contrast using rose/red text or backgrounds — Evidence: `Frontend/src/components/StatusBanner.tsx`, `Frontend/src/pages/analytics/index.tsx`

### Token Governance

RULE: Prefer existing CSS tokens from `src/index.css` for scalable color decisions before adding hardcoded colors — Evidence: `Frontend/src/index.css`

RULE: Avoid introducing new color palettes. The current direction is dark canvas, white typography, cyan accent, semantic feedback colors, and soft depth — Evidence: `Frontend/src/index.css`, `Frontend/src/pages/main/components/BentoCards.tsx`, `Frontend/src/pages/certificates/index.tsx`

RULE: If hardcoded colors already exist in nearby components, preserve the visual result but consider moving repeated values toward tokens when doing cleanup — Evidence: `Frontend/src/pages/main/components/BentoCards.tsx`, `Frontend/src/pages/certificates/index.tsx`, `Frontend/src/pages/landing/index.tsx`

## The Rules
RULE: Keep route pages in `src/pages`, shared UI in `src/components/ui`, and domain logic in `src/features/<feature>` — Evidence: `Frontend/src/pages/main/index.tsx`  
RULE: Use React Query feature hooks for all server state, with query keys and invalidation in hooks files — Evidence: `Frontend/src/features/folders/api/hooks.ts`  
RULE: Use centralized axios clients and validate API contracts with Zod in every service — Evidence: `Frontend/src/lib/api/client.ts`  
RULE: Enforce auth via `ProtectedRoute` + session helpers (`isAuthenticated`, persisted session) — Evidence: `Frontend/src/components/ProtectedRoute.tsx`  
RULE: Build UI with Tailwind utility classes, shared CSS tokens, and shadcn component patterns — Evidence: `Frontend/src/index.css`

RULE: Match the reference UI feeling: calm, clean, spacious, focused, modern SaaS, and low-noise. Keep EducAIte colors and components — Evidence: `Frontend/src/index.css`, `Frontend/src/components/ui/button.tsx`

RULE: Use dark-first surfaces, white typography, cyan brand accent, semantic feedback colors, and soft opacity-based depth — Evidence: `Frontend/src/App.tsx`, `Frontend/src/index.css`, `Frontend/src/components/StatusBanner.tsx`

RULE: Prefer existing CSS tokens before adding hardcoded colors, and do not introduce a new palette — Evidence: `Frontend/src/index.css`
