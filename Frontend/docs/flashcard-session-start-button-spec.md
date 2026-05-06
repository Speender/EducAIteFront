# Flashcard Session Start Button Spec

## Route Target
- Route visited: `http://localhost:5173/flashcards/workspace/p6klVeMg/{id}/cards`
- React route file: `src/pages/flashcards/pages/CardsPage.tsx`
- Current page purpose: deck card listing page for `/flashcards/workspace/:majorDeckSqid/:deckSqid/cards`

## Placement Requirement
- Add the session entry button on the cards page header area.
- Place it beside the existing `Add card` action, inside the top actions row.
- Primary label: `Start review`
- Secondary options should not appear immediately on page load.
- Clicking `Start review` is the trigger for the session start-flow.

## Visual Direction
- Keep the existing page palette:
  - Background: black / near-black
  - Primary accent: cyan `#00CEC8`
  - Text: white and white with opacity
  - Error: rose/red tint
- Styling system must use the current shadcn setup:
  - Style: `radix-nova`
  - Base color: `neutral`
  - Icon set: `lucide`
  - Tailwind CSS variables from `src/index.css`

## Shadcn Component Map
- Start button: `Button`
- Session start panel: `Dialog` on desktop, `Drawer` on mobile
- Resume/restart selection: `ToggleGroup`
- Session summary block: `Card`
- Progress preview: `Progress`
- Status labels: `Badge`
- Errors and warnings: `Alert`
- Loading placeholders: `Skeleton`
- Blocking submit/loading state: `Spinner`
- Code item tabs: `Tabs`
- Language selector dropdown: `Select`
- Long feedback area: `ScrollArea`
- Empty terminal state: `Empty`

## Start Button Behavior
- User clicks `Start review`
- Frontend calls the start-flow endpoint with `startMode = auto`
- Possible outcomes:
  - `created`: go directly into the new session
  - `continueAvailable`: open decision UI with `Continue` and `Restart from beginning`
- Do not auto-create a session on route load
- Do not fetch active session separately just to decide the start action if start-flow is available

## Required Frontend DTOs

## API Route Inventory

### Frontend Routes
- Cards page: `/flashcards/workspace/:majorDeckSqid/:deckSqid/cards`
- Learn session page: `/flashcards/workspace/:studentCourseSqid/:documentSqid/cards/learn`
- Coding challenge page: `/flashcards/workspace/:studentCourseSqid/:documentSqid/cards/challenge`
- Performance page: `/flashcards/workspace/:studentCourseSqid/:documentSqid/cards/performance`

### Primary Session APIs in `EducAIteAPI`

#### 1. Start Flow
- Method: `POST`
- Route: `/api/FlashcardSession/start-flow`
- Purpose: first call from the `Start review` button
- Request body:
  - `scopeType`
  - `studentCourseSqid`
  - `documentSqid`
  - `take`
  - `startMode`
- Response:
  - `action`
  - `session`
  - `activeSession`

#### 2. Legacy Start
- Method: `POST`
- Route: `/api/FlashcardSession`
- Purpose: backward-compatible direct start/create endpoint
- Use: only if the frontend intentionally wants the old behavior

#### 3. Get Active Session
- Method: `GET`
- Route: `/api/FlashcardSession/active`
- Query params:
  - `scopeType`
  - `studentCourseSqid`
  - `documentSqid`
- Purpose: legacy active-session lookup; not the preferred first call when `start-flow` is available

#### 4. Resume Session
- Method: `POST`
- Route: `/api/FlashcardSession/{sessionSqid}/resume`
- Purpose: resume an existing in-progress session

#### 5. Restart Session
- Method: `POST`
- Route: `/api/FlashcardSession/{sessionSqid}/restart`
- Purpose: create a fresh run from the beginning using backend restart policy

#### 6. Abandon Session
- Method: `POST`
- Route: `/api/FlashcardSession/{sessionSqid}/abandon`
- Purpose: terminate the current in-progress session

#### 7. Submit AI-Reviewed Session Answer
- Method: `POST`
- Route: `/api/FlashcardSession/{sessionSqid}/ai/answers`
- Purpose: canonical answer submission route for the learn flow
- Request body: `Submit Session Answer Request DTO`
- Response:
  - `session`
  - `answer`
  - `frontendReview`

#### 8. Submit Evaluated Answer
- Method: `POST`
- Route: `/api/FlashcardSession/{sessionSqid}/evaluated-answers`
- Purpose: internal/advanced path when evaluation is already available

### Supporting Flashcard APIs in `EducAIteAPI`

#### 9. Analyze Standalone Flashcard Attempt
- Method: `POST`
- Route: `/api/Flashcard/{flashcardSqid}/ai/analyze-attempt`
- Purpose: AI review for a single flashcard outside the session flow

#### 10. Execute Code Directly
- Method: `POST`
- Route: `/api/Flashcard/code/execute`
- Purpose: direct code execution utility endpoint
- Response shape exposed to frontend:
  - `executionStatus`
  - `compileStatus`
  - `runtimeStatus`
  - `stdout`
  - `stderr`
  - `visibleTestsPassed`
  - `visibleTestsTotal`
  - `hiddenTestsPassed`
  - `hiddenTestsTotal`
  - `message`

#### 11. Evaluation Context
- Method: `GET`
- Route: `/api/FlashcardAnalytics/{flashcardSqid}/evaluation-context`
- Purpose: backend-only or tooling-oriented context source for AI evaluation

### Upstream AI Service APIs in `educAIteAI`

#### 12. Agent Task Endpoint
- Method: `POST`
- Route: `/api/agent/tasks`
- Purpose: server-to-server orchestration from `EducAIteAPI` to `educAIteAI`
- Relevant intents:
  - `evaluate_flashcard_answer`
  - `submit_and_analyze_flashcard_answer`
  - `generate_flashcards_from_note`
  - `generate_flashcards_preview`

#### 13. Smart Quiz Code Execution
- Method: `POST`
- Route: `/api/smart-quiz/code/execute`
- Purpose: Judge0-backed execution and code feedback in `educAIteAI`
- Used by:
  - `EducAIteAPI` direct code execution client
  - `educAIteAI` flashcard/code evaluation pipeline

### Recommended Frontend Call Sequence
1. User clicks `Start review`
2. Frontend calls `POST /api/FlashcardSession/start-flow` with `startMode: "auto"`
3. If `action = "created"`:
   - navigate to the learn route immediately
4. If `action = "continueAvailable"`:
   - open continue/restart decision UI
5. On answer submit:
   - call `POST /api/FlashcardSession/{sessionSqid}/ai/answers`
6. On restart:
   - call `POST /api/FlashcardSession/{sessionSqid}/restart`
7. On abandon:
   - call `POST /api/FlashcardSession/{sessionSqid}/abandon`

### 1. Start Flow Request DTO
Use this when the `Start review` button is pressed.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `scopeType` | `"Course" \| "Overall"` | Yes | For this route use `Course` |
| `studentCourseSqid` | string | Yes for course scope | Use the route parent context if available |
| `documentSqid` | string | Optional | Only send if this cards route is document-backed |
| `take` | number | Yes | Use the intended session size |
| `startMode` | `"auto" \| "new"` | Yes | Start button uses `auto`; restart path uses `new` or `restart` endpoint |

### 2. Start Flow Response DTO
This is the response that drives the next UI state.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `action` | `"continueAvailable" \| "created"` | Yes | Controls whether to enter session or show the decision panel |
| `session` | Flashcard session object or `null` | Yes | Present when `action = created` |
| `activeSession` | Flashcard session object or `null` | Yes | Present when `action = continueAvailable` |

### 3. Flashcard Session DTO
Used by the cards page preview and the learn-session page.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `sessionSqid` | string | Yes | Session identifier |
| `studentCourseSqid` | string or `null` | Yes | Scope context |
| `documentSqid` | string or `null` | Yes | Optional document context |
| `scopeType` | string | Yes | Backend returns the session scope |
| `status` | string | Yes | Example: `InProgress`, `Completed` |
| `currentItemIndex` | number | Yes | Zero-based active item index |
| `startedAt` | ISO datetime | Yes | Session start timestamp |
| `lastActiveAt` | ISO datetime | Yes | For resume summary |
| `items` | array of session items | Yes | Ordered item queue |

### 4. Flashcard Session Item DTO

| Field | Type | Required | Notes |
|---|---|---:|---|
| `sessionItemSqid` | string | Yes | Per-item session identifier |
| `flashcardSqid` | string | Yes | Source card identifier |
| `studentCourseSqid` | string | Yes | Course context |
| `question` | string | Yes | Prompt shown to learner |
| `originalOrder` | number | Yes | Initial position |
| `currentOrder` | number | Yes | May change if requeued |
| `status` | string | Yes | Item state in the session |

### 5. Submit Session Answer Request DTO
This supports both text items and code-backed items.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `sessionItemSqid` | string | Yes | Current item identifier |
| `answer` | string | Conditional | Required for text-based items if `studentCode` is absent |
| `responseTimeMs` | number | Yes | Client-side elapsed time |
| `itemType` | item type enum | Optional | Send when the frontend already knows the item type |
| `question` | string | Optional | Override only if client has richer context |
| `expectedAnswer` | string | Optional | Never show hidden expectations to learners |
| `conceptExplanation` | string | Optional | AI context only |
| `answeringGuidance` | string | Optional | AI context only |
| `acceptedAnswerAliases` | string array | Optional | AI context only |
| `cognitiveSkill` | enum | Optional | AI context only |
| `learningDomain` | enum | Optional | AI context only |
| `technicalLanguage` | string | Optional | Example: Python, Java |
| `rubricJson` | string | Optional | Stringified rubric metadata |
| `validationConfigJson` | string | Optional | Stringified execution/test config |
| `language` | runtime enum | Optional | Required for runnable code items |
| `runtimeVersion` | string | Optional | Runtime pin when needed |
| `starterCode` | string | Optional | Send visible starter template if shown to learner |
| `studentCode` | string | Conditional | Required for runnable code items if `answer` is absent |

## Supported Item Types for This Flow
- `Flashcard`
- `Conceptual`
- `CodeReading`
- `Debugging`
- `Algorithm`
- `OutputPrediction`
- `MultipleChoice`
- `ShortAnswer`

Do not surface these in this flow:
- `Sql`
- `FillInCode`
- `Flowchart`

## Start-Flow UI States

### Idle State
- Show `Start review` button
- Keep `Add card` as secondary
- No dialog open by default

### Loading State
- Disable `Start review`
- Replace button icon with `Spinner`
- Show a lightweight inline status under the action row:
  - `Checking for an active review session...`
- If the page body needs a placeholder, use `Skeleton` cards, not raw `div` shimmer blocks

### Continue Available State
- Open `Dialog` on desktop
- Open `Drawer` on mobile
- Show:
  - current progress count
  - last active timestamp
  - total cards in the session
  - status badge
- Primary action: `Continue`
- Secondary action: `Restart from beginning`
- Tertiary action: `Cancel`

### Created State
- Navigate directly to the learn-session screen
- Do not show an intermediate confirmation toast

### Error State
- Use `Alert`
- Error copy examples:
  - `Unable to start the review session.`
  - `The active review session could not be loaded.`
  - `This deck does not have enough supported cards for review yet.`

## Learn Session UX Guidance

### Text-Based Items
- Use a `Card` for the question
- Use `Textarea` for the answer
- Submission button stays fixed at the bottom of the answer card footer

### Multiple Choice
- Use `ToggleGroup` when choice count is small and fixed
- Keep the final answer submission explicit; do not auto-submit on selection

### Code-Backed Items
- Use `Tabs` with:
  - `Prompt`
  - `Code`
  - `Feedback`
- Inside the `Code` tab:
  - language dropdown via `Select`
  - starter code visible in editor region
  - student code editable area
- The code sandbox section should show:
  - compile status badge
  - runtime status badge
  - visible tests passed / total
  - hidden tests passed / total
  - concise AI summary
- Never reveal hidden test inputs or expected outputs

### Dropdown Guidance
- Language dropdown is only shown for `Algorithm` and runnable `Debugging`
- Use `SelectTrigger`, `SelectContent`, `SelectGroup`, `SelectItem`
- Options should come from the backend-supported runtime set only:
  - `cpp`
  - `csharp`
  - `java`
  - `python`
  - `javascript`

## Color and Tone Guidance
- Use semantic shadcn tokens wherever possible
- Accent usage:
  - primary action emphasis: cyan accent aligned with current page brand
  - success states: green semantic badge
  - warning / partial states: amber semantic badge
  - failure states: rose semantic badge
- Avoid introducing purple gradients or a separate visual language
- Keep the current black/cyan workspace identity consistent from cards page to learn flow

## Suggested Copy
- Start button: `Start review`
- Continue CTA: `Continue session`
- Restart CTA: `Restart from beginning`
- Dialog title: `Resume your review?`
- Dialog description: `We found an in-progress review session for this deck. Continue where you left off or start again from the beginning.`

## Implementation Notes for Gemini
- The start button belongs on `CardsPage`, not only on the learn page
- The first button call should hit start-flow, not the legacy active-session lookup
- Keep DTO naming explicit around `StartFlow`, `Session`, and `SubmitAnswer`
- Use shadcn composition rules, not custom modal or raw utility-only layouts
