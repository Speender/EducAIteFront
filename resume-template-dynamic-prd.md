# PRD: Dynamic Resume Template Runtime for Frontend

## Goal

Replace the fixed resume preview/template behavior with a dynamic frontend runtime where the displayed resume is driven by the selected backend-managed template.

The frontend should stay component-owned. The backend should decide which template is active and may optionally provide presentation metadata through `renderConfigJson`, but the frontend remains responsible for safe rendering.

## Product Outcome

When a student or user selects a resume template:

- the preview updates immediately
- the same resume content is re-arranged according to template rules
- section visibility and ordering change based on template configuration
- the UI remains readable and responsive on mobile, tablet, and desktop
- invalid or missing template config never breaks the editor or preview

## Source of Truth

- Selected template comes from `resume.template`
- Primary key fields:
  - `templateSqid`
  - `templateCode`
  - `name`
  - `renderConfigJson`
- Resume content still comes from the normal review payload:
  - `personalDetails`
  - `summary`
  - `education`
  - `employmentHistory`
  - `certificates`
  - `targetRole`

## Frontend Runtime Model

The frontend should use a registry-based runtime:

- A template registry maps `templateCode` to a frontend-supported template definition.
- `renderConfigJson` acts as an override layer, not as arbitrary UI code.
- The frontend first normalizes resume data into a stable preview model.
- Template renderers consume that normalized model.

### Supported dynamic configuration in v1

- `layout`
  - `classic`
  - `sidebar`
  - `executive`
- `density`
  - `compact`
  - `comfortable`
- `accent`
  - constrained frontend-safe theme options
- `sectionOrder`
  - controls section sequencing
- `hiddenSections`
  - removes sections from preview
- `sectionTitles`
  - allows template-specific section heading labels

### Explicit non-goals for v1

- server-defined arbitrary component trees
- raw HTML or CSS injection from backend config
- fully different editor forms per template
- drag-and-drop template authoring in frontend

## Expected Frontend Behavior

### Template selection

- Template cards come from backend template listing.
- Selecting a template updates backend state first.
- After mutation success, preview refreshes using the selected template.
- If template selection fails, the current preview stays unchanged and an error toast is shown.

### Preview rendering

- Preview must always show a valid document, even if:
  - `renderConfigJson` is `null`
  - `renderConfigJson` cannot be parsed
  - template code is unknown
- Fallback order:
  1. selected template config
  2. registry default for known `templateCode`
  3. frontend default template

### Editor-to-preview sync

- All editor changes should reflect in preview immediately from local store state.
- Template changes should not reset in-progress resume data.
- Template changes only affect presentation, ordering, and visibility.
- Content values remain owned by resume data, not by the template.

### Student Mode behavior

- Student Mode uses the same dynamic template runtime.
- If a student template emphasizes education or certificates first, the preview should reflect that through config.
- Student Mode does not require a separate preview implementation.

## Shadcn UX Expectations

### Template catalog

- Use `Card` for template cards.
- Use `Badge` for highlights like active template or recommended template.
- Use `Dialog` for template selection when opened from the workspace.
- Use `Skeleton` while template list is loading.
- Use `Empty` if the backend returns no templates.

### Preview workspace

- Use `Tabs` for mobile editor/preview switching.
- Use `ScrollArea` for long preview surfaces.
- Use `Button` + `Spinner` for save and AI actions.
- Use `Alert` for config parsing fallback warnings only if needed for debugging; user-facing default should be silent fallback.

### Dynamic section behavior

- Hidden sections should disappear cleanly without leaving visual gaps.
- Reordered sections should animate minimally or switch cleanly without layout corruption.
- Section headings should adopt template labels from config where available.

## Responsive Behavior

### Mobile

- Editor and preview should be separated with tabs.
- Preview should scale to fit width without horizontal clipping.
- Template cards should stack in a single column.
- Modal-based template selection should fill most of the viewport height.

### Tablet

- Template cards can use two columns.
- Preview controls should remain visible without covering the document excessively.
- Student Mode entry should stack content before it becomes cramped.

### Desktop

- Workspace should support split editor/preview layout.
- Template selector can use a three-column catalog.
- Preview should remain centered with stable zoom behavior.

## Failure and Fallback Behavior

- Unknown `templateCode`:
  - fallback to default frontend template
- Invalid `renderConfigJson`:
  - ignore config and use template defaults
- Empty `sectionOrder`:
  - use template default order
- Hidden section with no content:
  - no warning needed
- Hidden section with content:
  - preview hides it; editor data remains untouched

## Acceptance Criteria

- Selecting a different backend template updates preview appearance without losing content.
- `sectionOrder` changes preview order.
- `hiddenSections` removes sections from preview.
- `sectionTitles` renames visible headings.
- Missing or invalid config does not crash the preview.
- Mobile, tablet, and desktop layouts remain usable.
- Student Mode resumes use the same runtime as standard resumes.
- Preview behavior remains deterministic after page refresh.
