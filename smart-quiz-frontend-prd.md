# PRD: Smart Quiz Workspace Frontend

## Goal

Create a frontend Smart Quiz experience that is embedded into the flashcards workspace and aligned with both:

- `EducAIteAPI/docs/smart-quiz-integration.prd.md`
- `EducAIteAI/src/features/smart-quiz/*`

The browser talks only to `EducAIteAPI`. `EducAIteAI` remains internal product and prompt context behind the API.

## Product Model

The frontend must reflect the current workspace hierarchy:

- `Major Deck` is the top-level workspace container shown in `/flashcards/workspace`
- `SubDeck` lives inside a major deck
- `Quiz Items` live inside a subdeck

Two major deck types exist:

- `Course-backed`: created automatically when a student enrolls in a course
- `Manual`: created directly by the student from the workspace

## Core User Experience

When a student visits `/flashcards/workspace`, the page should feel like a study command center.

The student should be able to:

- view all major decks
- create a manual major deck
- open a major deck and manage its subdecks
- create a subdeck inside a major deck
- open Smart Quiz from a subdeck
- generate preview quiz items from notes, documents, or pasted study material
- save generated quiz items into the selected subdeck
- start, resume, restart, and abandon adaptive quiz sessions
- answer conceptual, short-answer, coding, SQL, debugging, output-prediction, and Mermaid flowchart questions
- receive structured scoring feedback, including provisional low-confidence states

## API and AI Alignment

### Browser boundary

- `EducAIteFront` calls `EducAIteAPI` only
- `EducAIteAPI` owns workspace state, decks, subdecks, quiz items, quiz sessions, and persistence
- `EducAIteAI` owns internal AI orchestration for:
  - context classification
  - quiz item generation
  - semantic scoring
  - code feedback
  - Mermaid flowchart evaluation
  - retry variant generation

### Frontend-relevant API contracts

Workspace:

```text
GET    /api/FlashcardWorkspace/workspace/latest
POST   /api/FlashcardWorkspace/major-decks
PUT    /api/FlashcardWorkspace/major-decks/{majorDeckSqid}
DELETE /api/FlashcardWorkspace/major-decks/{majorDeckSqid}
GET    /api/FlashcardWorkspace/major-decks/{majorDeckSqid}/subdecks
POST   /api/FlashcardWorkspace/major-decks/{majorDeckSqid}/subdecks
```

Quiz items:

```text
GET    /api/QuizItem/deck/{deckSqid}
POST   /api/decks/{deckSqid}/quiz-items/generate-preview
POST   /api/decks/{deckSqid}/quiz-items/generate
POST   /api/decks/{deckSqid}/quiz-items/generated
```

Quiz sessions:

```text
POST /api/quiz-sessions
GET  /api/quiz-sessions/active
POST /api/quiz-sessions/{sessionSqid}/resume
GET  /api/quiz-sessions/{sessionSqid}/next
POST /api/quiz-sessions/{sessionSqid}/answers
POST /api/quiz-sessions/{sessionSqid}/restart
POST /api/quiz-sessions/{sessionSqid}/abandon
```

### AI-informed UX behavior

The frontend should visibly support the AI outputs described in `EducAIteAI` even if some backend endpoints are still incremental:

- inferred learning domain
- inferred technical language
- generated warnings
- rubric-aware draft preview
- provisional scoring with confidence explanation
- code-sandbox unavailable states
- Mermaid syntax guidance and invalid-state messaging

The browser must never call AI endpoints directly.

## UX Principles

- Keep the current EducAIte visual language: dark workspace, restrained surfaces, cyan-forward action accents, dense but readable study panels.
- Use installed `shadcn/ui` components first.
- Favor responsive overlays:
  - `Dialog` for desktop
  - `Drawer` for mobile
- Make quiz actions feel focused and sequential rather than noisy.
- Keep the student oriented at every step: major deck -> subdeck -> generate or quiz.
- AI should feel assistive and transparent, never magical or vague.

## Required shadcn Usage

Project context:

- Framework: `Vite + React + TypeScript`
- Style: `radix-nova`
- Base: `radix`
- Tailwind: `v4`
- UI alias: `@/components/ui`
- Icons: `lucide-react`

Use these installed components:

- `Button`
- `Card`
- `Badge`
- `Dialog`
- `Drawer`
- `Tabs`
- `Alert`
- `Empty`
- `Skeleton`
- `Spinner`
- `Progress`
- `ScrollArea`
- `Textarea`
- `Input`
- `Select`
- `ToggleGroup`
- `Table`
- `Separator`
- `Tooltip`

Implementation rules:

- Use full card composition
- Use semantic tokens and existing variants
- Use `gap-*`, not `space-*`
- Use `Badge` for item type, source type, score state, and AI confidence state
- Use `Alert` for low-confidence, sandbox-unavailable, flowchart-invalid, and failed-request states
- Use `Tabs` inside the subdeck workspace for `Generate`, `Session`, and `Items`
- Use `Spinner` inside action buttons
- All dialogs and drawers must include titles

## Main Flows

### 1. Workspace flow

1. Student opens `/flashcards/workspace`
2. Student sees major deck cards
3. Student can create a manual major deck
4. Student opens a major deck
5. Student sees subdecks and can create a new subdeck
6. Student selects a subdeck to work in

### 2. Generation flow

1. Student opens a subdeck
2. Student enters or pastes study material
3. Student chooses count and optional item-type preferences
4. Frontend requests preview generation
5. Frontend shows draft quiz items, warnings, and inferred context when available
6. Student saves generated items into the subdeck

### 3. Adaptive quiz flow

1. Student starts or resumes a deck-scoped quiz session
2. Frontend loads the next adaptive item
3. Student answers using the correct response mode
4. Frontend submits answer and shows structured feedback
5. Student continues through the session, restarts, or abandons

## Answer Modes

### Conceptual and short answer

- `Textarea`
- progress and feedback visible in the same workspace

### Code, SQL, debugging, output prediction, fill-in-code

- monospace answer area
- validation panel for execution context and sandbox state
- if no backend execution route is available, show a clear unavailable message instead of pretending code ran

### Mermaid flowchart

- `Textarea` with Mermaid starter hint
- guidance that the answer should begin with `flowchart` or `graph`
- clear invalid-state alert when parseable Mermaid is required

## Responsive Behavior

### Mobile

- Use `Drawer` for major deck workspace and create flows
- Stack subdeck list and active subdeck workspace vertically
- Keep generation and submit actions visible without horizontal scrolling

### Desktop

- Use `Dialog` for major deck workspace and create flows
- Show subdeck list beside the active subdeck workspace when space allows
- Keep generation preview and current quiz state scannable at a glance

## Acceptance Criteria

- Frontend PRD matches the major deck/subdeck model now used by the API
- `/flashcards/workspace` renders major decks and nested subdeck actions
- Student can create a manual major deck
- Student can create a subdeck inside a major deck
- Student can open Smart Quiz from a subdeck without navigating to a standalone `/smart-quiz` page
- Student can generate preview quiz items and save them
- Student can start and continue a deck-scoped adaptive session
- Student can answer conceptual, coding, SQL, and Mermaid-style items with clear affordances
- Low-confidence and sandbox-unavailable states are explicit
- UI uses `shadcn/ui` and stays visually consistent with the current app
