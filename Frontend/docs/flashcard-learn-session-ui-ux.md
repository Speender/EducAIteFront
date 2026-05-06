# Flashcard Learn Session UI/UX

## Goal
- Replace the current `active + start` split with a single `start-flow` entrypoint.
- Keep `EducAIteAPI` as the session owner.
- Support text and code-backed items without changing the overall page structure.

## Shadcn Composition
- Page shell: `Card`, `CardHeader`, `CardContent`, `CardFooter`
- Start decision panel: `Dialog` on desktop, `Drawer` on mobile
- Session progress: `Progress`, `Badge`, `Separator`
- Answer form: `FieldGroup`, `Field`, `Textarea` for text answers, `Tabs` to switch `Answer | Code | Feedback` for technical items
- Start-mode choice: `ToggleGroup` with `Continue` and `Restart`
- Feedback states: `Alert` for errors, `Empty` for completed sessions, `Skeleton` during start-flow loading
- Actions: `Button` with `Spinner` and `data-icon`

## Interaction Flow
1. User opens the learn page.
2. UI shows a single primary action: `Start review`.
3. Clicking `Start review` calls `POST /api/FlashcardSession/start-flow` with `startMode: "auto"`.
4. If response is `created`, enter the session immediately.
5. If response is `continueAvailable`, open a `Dialog`/`Drawer` with:
   - Session summary
   - `Continue` button
   - `Restart from beginning` button
6. `Continue` uses `activeSession` from the start-flow response directly or calls `resume` if fresh data is needed.
7. `Restart` calls `restart` on the active session.
8. Answer submission keeps using `/api/FlashcardSession/{sessionSqid}/ai/answers`.

## Screen States
- Idle:
  - `CardTitle`: document or course title
  - `CardDescription`: explain that the review batch is AI-evaluated
  - Primary button: `Start review`
- Continue available:
  - `Badge` for `In Progress`
  - summary rows for current position, total cards, last active time
  - `ToggleGroup` default focus on `Continue`
- Active session:
  - top progress row with `Progress`
  - question panel in `Card`
  - answer panel below
  - feedback panel appears after submit
- Completed:
  - `Empty`
  - actions: `Restart session`, `Back to cards`

## Item-Type UX
- `Flashcard`, `Conceptual`, `ShortAnswer`, `MultipleChoice`:
  - single `Textarea`
- `CodeReading`, `OutputPrediction`:
  - `Tabs` with `Question`, `Your answer`, `Feedback`
- `Algorithm`, `Debugging`:
  - `Tabs` with `Prompt`, `Code`, `Feedback`
  - code editor container can be a custom area, but surrounding chrome should stay shadcn
  - feedback should display:
    - compile/runtime status badges
    - visible and hidden pass counts
    - AI explanation

## Frontend Data Contract
- Source DTO file: `src/features/flashcards/api/dto.ts`
- Start-flow response:
  - `action`
  - `session`
  - `activeSession`
- Submit request must support:
  - `answer`
  - `studentCode`
  - `language`
  - `runtimeVersion`
  - `starterCode`
  - existing rubric/context metadata

## Notes
- Do not auto-create a session on initial page load.
- Hidden tests remain private; UI shows only aggregate counts.
- Keep styling token-based through existing `radix-nova` shadcn setup.
