# Backend Integration Playbook (EducAIte Frontend)

## Objective
Integrate backend APIs into the frontend with high reliability, strong type safety, and maintainable architecture.

This playbook is tailored to the current EducAIte frontend stack:
- React + TypeScript + Vite
- Tailwind utility-first UI
- Feature-folder page structure
- Current state is mostly local/mock data (no centralized API layer yet)

## Recommended Tooling (Best Practice)

### Core
- HTTP client: Axios
- Server-state and caching: TanStack Query
- Runtime schema validation: Zod
- Form handling: React Hook Form
- Form validation bridge: @hookform/resolvers + Zod

### High-Value Supporting Tools
- API mocking for local development and tests: MSW
- API type generation from backend OpenAPI: openapi-typescript
- Error monitoring: Sentry
- Query debugging (dev-only): @tanstack/react-query-devtools

## Why This Stack
- Axios gives interceptors for auth, retries, and consistent error handling.
- TanStack Query solves loading/caching/invalidation patterns safely at scale.
- Zod protects frontend from backend payload drift with runtime checks.
- MSW keeps frontend productive when backend is delayed or unstable.
- OpenAPI generation reduces manual DTO mismatch risk.

## Architecture Standard
Use feature-oriented API boundaries and avoid HTTP calls inside components.

Suggested structure:

```text
src/
  lib/
    api/
      client.ts
      auth.ts
      errors.ts
      queryClient.ts
      env.ts
  features/
    auth/
      api/
        dto.ts
        mappers.ts
        service.ts
        hooks.ts
    courses/
      api/
        dto.ts
        mappers.ts
        service.ts
        hooks.ts
```

Rules:
1. UI components call hooks only.
2. Hooks call services only.
3. Services call API client only.
4. DTO validation happens at service boundary.
5. Mappers convert transport DTOs to UI/domain models.

## DTO Best Practice
Use two types per endpoint:
1. Transport DTO (exact backend response)
2. Domain model (frontend-safe shape)

Validate transport DTO with Zod before mapping.

Example strategy:
- DTO: backend naming and formats preserved
- Domain model: transformed fields (dates parsed, numbers normalized, labels derived)

Benefits:
- isolates backend shape changes
- prevents runtime crashes from malformed payloads
- keeps UI code cleaner and predictable

## Fetching Best Practice

### Query (Read)
- One query hook per read endpoint or query scenario
- Stable query keys, e.g. ["courses"], ["courses", filters]
- sensible staleTime and gcTime per feature
- retry transient failures only

### Mutation (Write)
- One mutation hook per command (create/update/delete)
- optimistic updates where safe
- rollback on error
- invalidate only affected keys

### Loading and Error UX
Every async surface should handle:
- loading
- success
- empty
- error

Avoid blank states and avoid showing raw backend error payloads in UI.

## Auth Integration Best Practice

### Token Strategy
Prefer:
- short-lived access token
- refresh token flow

Store sensitive tokens safely per backend policy. If cookies are used, ensure secure + httpOnly + proper CSRF approach.

### Interceptors
- Request interceptor attaches Authorization header when available.
- Response interceptor handles 401 flow.
- During refresh, queue pending requests and replay after successful refresh.
- If refresh fails, clear auth state and redirect to login.

## Error Normalization Standard
Normalize all backend errors into one frontend error shape:
- status
- code
- message
- fieldErrors (optional)

Do not leak raw stack traces or exception details to users.

## Environment and Config
Create strict environment contracts:
- VITE_API_URL
- VITE_REQUEST_TIMEOUT_MS
- VITE_SENTRY_DSN (optional)

Validate env values at startup and fail fast in development if missing.

## Security Checklist
- Always validate data on both frontend and backend.
- Use HTTPS in all deployed environments.
- Avoid unsafe HTML rendering.
- Sanitize user-generated content where needed.
- Protect refresh/session endpoints from CSRF where applicable.
- Implement role/permission-aware UI behavior.

## Performance Checklist
- use pagination/infinite queries for large datasets
- debounce search inputs
- prevent duplicate requests via query keys and dedupe
- cancel stale requests on navigation/unmount
- prefetch key data for next routes when useful

## Testing Strategy

### Unit
- dto schema parse tests
- mapper tests
- error normalizer tests

### Integration
- service + hook tests with mocked responses

### UI
- loading/empty/error/success rendering behavior

### Tooling
- use MSW for deterministic test and local API simulation

## Incremental Rollout Plan (Recommended)
1. Create shared API client and query client.
2. Add auth service and interceptor flow.
3. Migrate one feature from mock to backend (recommended: flashcards).
4. Add dto + mapper validation for that feature.
5. Expand feature-by-feature until all critical modules are migrated.
6. Add monitoring and production observability.

## Definition of Done
Backend integration is complete when:
- No UI component directly calls HTTP.
- All external payloads are runtime-validated.
- All server state is managed by query/mutation hooks.
- Auth refresh and 401 recovery are stable.
- Loading/empty/error UX states exist for all async surfaces.
- Tests cover DTO parsing, mapping, and hook behavior.

## Suggested Dependencies to Add

```bash
npm install axios zod @tanstack/react-query react-hook-form @hookform/resolvers
npm install -D msw openapi-typescript
```

Optional dev tool:

```bash
npm install @tanstack/react-query-devtools
```

## Quick Start Templates to Implement Next
Create these files first:
1. src/lib/api/client.ts
2. src/lib/api/queryClient.ts
3. src/lib/api/errors.ts
4. src/features/auth/api/service.ts
5. src/features/auth/api/hooks.ts
6. src/features/<first-feature>/api/dto.ts
7. src/features/<first-feature>/api/mappers.ts
8. src/features/<first-feature>/api/service.ts
9. src/features/<first-feature>/api/hooks.ts

Once these are in place, migrate one page fully and use that as the team standard.
