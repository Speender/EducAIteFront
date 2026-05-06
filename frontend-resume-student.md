# Frontend Resume Student Mode Integration

## Summary

The canonical frontend implementation lives in `Frontend/src/features/resume`. Student Mode should extend that module and should not depend on the older `Frontend/src/pages/resume/components/*Builder.tsx` files.

The current Student Mode flow is:

1. `GET /api/Student/me/resume-context`
2. `POST /api/Resume/student-mode`
3. `PUT /api/Resume/{resumeSqid}/student-context`
4. `POST /api/Resume/{resumeSqid}/job-target-suggestions`
5. `PUT /api/Resume/{resumeSqid}/target-role`
6. Continue in `ResumeWorkspace`
7. `POST /api/Resume/{resumeSqid}/ai/career-hint`
8. `POST /api/Resume/{resumeSqid}/ai/tailor`
9. `POST /api/Resume/{resumeSqid}/ai/company-recommendations/search`
10. `POST /api/Resume/{resumeSqid}/company-recommendations`
11. `GET /api/Resume/{resumeSqid}/company-recommendations`
12. `PUT /api/Resume/{resumeSqid}/company-recommendations/{recommendationSqid}/status`

## UI Surfaces

### Resume Dashboard

- File: `Frontend/src/features/resume/components/ResumeDashboard.tsx`
- Responsibility:
  - show Student Mode entry card
  - show backend-driven template cards
  - list existing resumes
- Loading states:
  - `Skeleton` for student context and template cards
  - `Spinner` inside create actions
- Empty states:
  - `Empty` for missing template catalog
  - existing resumes panel keeps its own empty state

### Academic Context Review

- File: `Frontend/src/features/resume/components/AcademicContextReview.tsx`
- Responsibility:
  - edit degree, year level, academic term, school name
  - manage subject tags
  - manage selected experience types
- Input rules:
  - `degreeProgram` required
  - `source` must be `study_load`, `manual`, or `mixed`
  - subjects max 30
  - experience types max 20
- Loading states:
  - full-card loading message while student context is fetched
  - submit button spinner while saving

### Job Target Recommendations

- File: `Frontend/src/features/resume/components/JobTargetRecommendations.tsx`
- Responsibility:
  - request AI suggestions
  - allow one selected target role
  - allow manual role entry
- Important behavior:
  - frontend supports one `targetRole` only
  - backend remains source of truth
- Loading states:
  - skeleton cards while suggestions are loading
  - button spinner while saving target role

### Resume Workspace

- File: `Frontend/src/features/resume/components/ResumeWorkspace.tsx`
- Responsibility:
  - host the student wizard when opened with `?mode=student`
  - fall through into the standard editor and preview
  - expose AI Tailor, template switcher, and job recommendations
- Responsive behavior:
  - mobile uses `Tabs` for editor/preview
  - desktop keeps split editor/preview panes

### Career Hints

- File: `Frontend/src/features/resume/components/FormEditor.tsx`
- Responsibility:
  - request contextual career hints when sections change
  - show dismissible `Alert`
- Loading states:
  - inline loading alert with spinner

### Company Recommendations

- File: `Frontend/src/features/resume/components/CompanyRecommendationsModal.tsx`
- Responsibility:
  - search, display, save, and track opportunities
- Responsive behavior:
  - mobile uses collapsible filters
  - desktop uses a persistent filter rail
- Components:
  - `Checkbox` for `workSetup` and `employmentType`
  - `Select` for saved recommendation status
  - `Alert` for backend readiness/search failures
  - `Empty` for no search results and no saved roles
- Current defaults:
  - `workSetup`: `Remote`, `Hybrid`
  - `employmentType`: `Internship`, `Entry-level`

## Data and Runtime Notes

- Resume DTOs must include `targetRole`.
- Template selection is backend-driven through `GET /api/resume-templates`.
- Preview rendering now depends on:
  - `template.templateCode`
  - optional `template.renderConfigJson`
- The frontend preview runtime parses `renderConfigJson` defensively and falls back to default template behavior if missing or invalid.

## Dynamic Template Runtime

- File: `Frontend/src/features/resume/lib/templateRuntime.ts`
- Current runtime model:
  - template registry keyed by `templateCode`
  - optional parsed config for:
    - `layout`
    - `density`
    - `accent`
    - `sectionOrder`
    - `hiddenSections`
    - `sectionTitles`
- File: `Frontend/src/features/resume/components/ResumePreview.tsx`
- Current behavior:
  - builds a normalized preview model
  - resolves template definition + safe config override
  - renders a themed document shell instead of a hardcoded switch-only preview

## Backend Confirmation Still Needed

- `schoolName` is not returned by `GET /api/Student/me/resume-context`.
- Student Mode currently persists only one `targetRole`.
- AI Tailor still lacks a dedicated backend apply endpoint for fully safe field-by-field application.
