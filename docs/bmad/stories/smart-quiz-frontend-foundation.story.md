# Story: Smart Quiz Frontend Foundation

## Status

Ready for Review

## Story

As a student, I want a Smart Quiz frontend workspace connected to EducAIteAPI so that I can generate quiz previews, review generated items, start an adaptive quiz session, answer items, and see clear scoring feedback.

## Acceptance Criteria

- AC1: Frontend has a `features/smart-quiz` module with Zod DTOs that parse current EducAIteAPI quiz payloads and normalize enum values for UI rendering.
- AC2: Frontend has API service functions and React Query hooks for quiz item generation, quiz item listing, quiz sessions, next item retrieval, answer submission, restart, and abandon.
- AC3: Frontend exposes `/smart-quiz/*` behind the existing protected route shell.
- AC4: Smart Quiz page follows current EducAIte UI patterns and shadcn/radix-nova conventions.
- AC5: Smart Quiz page supports generation preview cards with item type, difficulty, skill, domain, question, guidance, tags, warnings, loading, empty, and error states.
- AC6: Smart Quiz page supports adaptive session controls and a first-pass answer runner with feedback, score dimensions, low-confidence alert, and retry/continue affordance.
- AC7: Build succeeds with `npm run build`.

## Tasks

- [x] Create frontend DTO contracts and normalization helpers.
- [x] Create EducAIteAPI service functions.
- [x] Create React Query hooks and cache keys.
- [x] Create Smart Quiz route constants.
- [x] Create Smart Quiz page components for generation, session, answer, and feedback.
- [x] Wire `/smart-quiz/*` into `App.tsx`.
- [x] Run build verification and update Dev Agent Record.

## Implementation Notes

- Browser calls EducAIteAPI only. Do not call EducAIteAI directly from the frontend.
- Use existing shadcn components under `Frontend/src/components/ui`.
- Do not introduce new UI libraries for this slice.
- The current API returns enum values as numeric values; frontend DTOs must normalize them to display labels.
- Flowchart is included in the PRD but not yet present in the current EducAIteAPI `QuizItemType` enum, so frontend should be forward-compatible without requiring the backend to return it today.

## Dev Agent Record

### Files Changed

- `smart-quiz-frontend-prd.md`
- `docs/bmad/stories/smart-quiz-frontend-foundation.story.md`
- `Frontend/src/App.tsx`
- `Frontend/src/features/smart-quiz/api/dto.ts`
- `Frontend/src/features/smart-quiz/api/service.ts`
- `Frontend/src/features/smart-quiz/api/hooks.ts`
- `Frontend/src/features/smart-quiz/routes.ts`
- `Frontend/src/features/smart-quiz/index.ts`
- `Frontend/src/pages/smart-quiz/index.tsx`

### Verification

- `npm run build` passed in `C:\Users\Ginand\Documents\EducAIteFront\Frontend`.
- Vite reported an existing bundle-size warning for large chunks after successful build.

### Notes

- Browser integration is EducAIteAPI-only. No frontend calls to EducAIteAI were added.
- DTOs accept current numeric EducAIteAPI enum values and normalize them to UI labels.
- Flowchart is supported as a forward-compatible UI/DTO item type, but current EducAIteAPI enum does not yet return it.
