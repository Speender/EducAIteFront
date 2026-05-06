# Resume Builder Frontend Flow

This document outlines the frontend architecture, state management, and user journey for the Resume Builder (`/resume`) feature.

## 1. Dashboard & Initialization (`/resume`)

**Component:** `ResumeDashboard.tsx`

The entry point for the resume feature allows users to either create a new resume or continue editing an existing one.

- **Create New:** 
  - User clicks to start fresh or selects a static template card (Harvard, Modern, Executive).
  - Calls `POST /api/Resume` with a default title to create the "shell" and get a `resumeSqid`.
  - If a template was selected, calls `PUT /api/Resume/{resumeSqid}/template`.
  - Redirects to `/resume/{resumeSqid}`.
- **Use Existing:** 
  - Fetches existing resumes via `GET /api/Resume`.
  - User clicks a resume card, redirecting to `/resume/{resumeSqid}`.

## 2. Workspace Initialization (`/resume/:resumeSqid`)

**Component:** `ResumeWorkspace.tsx`, `useResumeStore.ts`

When the workspace loads, it hydrates the frontend state from the backend.

- Fetches the full resume payload via `GET /api/Resume/{resumeSqid}/review`.
- Populates the Zustand global store (`useResumeStore`) via `setInitialData(review)`.
- **Template Check:** If the resume has no assigned template, the `TemplateSelectorModal` opens automatically.

## 3. The Editing Experience

The workspace is divided into a side-by-side view on Desktop (and Tabs on Mobile).

### Left Pane: Form Editor
**Component:** `FormEditor.tsx`

Uses an Accordion layout to manage different sections of the resume. Changes in these forms update the local Zustand store in real-time, instantly reflecting in the preview.

1. **Personal Details:** Updates name, contact info, location.
2. **Professional Summary:** Free-text summary.
3. **Work Experience:** Dynamic list of past roles and responsibilities.
4. **Education:** Dynamic list of degrees and schools.
5. **Certificates:** Selects which uploaded certificates to attach to the resume. 
   - Includes a button to fetch AI Suggestions (`CertificateSuggestionsSheet.tsx`) which compares the resume against a job description or profile to recommend which certificates to include.

### Right Pane: Live Preview
**Component:** `ResumePreview.tsx`, `PreviewPane`

Renders the selected template (e.g., `HarvardTemplate`, `ModernTemplate`) passing in the real-time data from the Zustand store.

- **Incomplete Status Alert:** If `review.completeness.isComplete` is false, a sticky alert banner warns the user about missing required fields (e.g., "Personal Details", "Summary").
- **Zoom Controls:** Users can scale the A4 preview manually or let it auto-scale to fit the container.

## 4. Saving the Resume

**Action:** Clicking "Save Version" in the top header.

Unlike auto-save systems, the user manually triggers a full sync to the backend to create a stable version.

The `handleSave` function sequentially updates all endpoints:
1. `PUT /api/Resume/{resumeSqid}/personal-details`
2. `PUT /api/Resume/{resumeSqid}/summary`
3. `POST / PUT /api/Resume/{resumeSqid}/education` (Loops through array)
4. `POST / PUT /api/Resume/{resumeSqid}/employment-history` (Loops through array)
5. `PUT /api/Resume/{resumeSqid}/certificates` (Replaces all attached certificates)
6. `POST /api/Resume/{resumeSqid}/save` (Records a snapshot version in history)

Finally, it refetches `GET /api/Resume/{resumeSqid}/review` to ensure the frontend is perfectly synced with the database.

## 5. AI Features

### Tailor with AI
**Component:** `AiTailorModal.tsx`
- User inputs a job title and description.
- Calls `POST /api/Resume/{resumeSqid}/ai/tailor`.
- The AI analyzes the resume against the job description, scores the alignment, and suggests rewritten summaries, skills, and bullet points.
- The user can review the AI suggestions and selectively "Apply" them to their local store before saving.

### History & Versions
**Component:** `ResumeHistory.tsx`
- Users can view past saved versions of their resume.
- Useful for reverting changes or viewing the resume state before an AI tailoring session.

## Mobile Adaptation

On smaller screens (`< lg` breakpoint), the side-by-side layout collapses into a Tabbed interface:
- **Editor Tab:** Shows the Accordion forms.
- **Preview Tab:** Shows the scaled A4 document and the missing fields warning.
- This ensures the UI remains uncluttered and functional regardless of the device.
