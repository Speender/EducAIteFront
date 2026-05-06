# Frontend Specification: EducAIte Resume Builder

## 1. Vision & UI/UX Principles
The Resume Builder is a high-interactivity workspace. It must feel like a "Desktop App" within the browser, prioritizing speed, visual feedback, and the **EducAIte Black/Blue/Glass** aesthetic.

### Key UX Pillars:
*   **Split-Pane Workspace:** Left side for structured data entry (Forms); Right side for a live, high-fidelity A4 preview.
*   **Real-Time Sync:** Typing in the form instantly reflects in the preview (Reactive State).
*   **EducAIte Aesthetic:** 
    *   **Background:** `#000000` (Pure Black) or `#0A0A0A` (Deep Obsidian).
    *   **Accents:** `#00CEC8` (Vibrant Cyan/Blue) for active inputs, primary buttons, and highlights.
    *   **CTAs:** White background with Black text (`bg-white text-black`) or high-glow `#00CEC8` buttons for major actions.
    *   **Glassmorphism:** `backdrop-blur-md` and `border-white/10` or `border-[#00CEC8]/20` for cards and containers.

---

## 2. Technical Stack & Architecture
*   **Styling:** Tailwind CSS + **shadcn/ui**.
*   **State Management:** Zustand (preferred for performance in high-frequency updates) or React Context.
*   **Forms:** `react-hook-form` + `zod` for validation matching the Backend PRD.
*   **Ordering:** `dnd-kit` for reordering Education and Employment entries.
*   **Icons:** `lucide-react`.

---

## 3. Page & Component Breakdown

### 3.1 Resume Dashboard (`/resume`)
*   **Grid Layout:** Displays existing resumes as `Card` components.
*   **Metadata:** Shows "Title", "Last Modified", and "Status" (Draft/Saved).
*   **Empty State:** A "Create Your First Resume" white-bordered or `#00CEC8` themed CTA.

### 3.2 The Editor Workspace (`/resume/:id/edit`)
The core interface is a flex container: `flex-row h-[calc(100vh-nav-height)]`.

#### A. Left Pane: Form Editor (Scrollable, 40% width)
Using `shadcn/ui` Accordion or Tabs to organize sections:
1.  **Personal Details:** Standard input fields (FirstName, LastName, LinkedIn, etc.).
2.  **Summary:** Rich Textarea with a "✨ AI Rewrite" floating button.
3.  **Education:** Dynamic list with "Add New" and drag handles.
4.  **Work History:** Dynamic list with nested "Responsibilities" (tags or bullet list).
5.  **Certificates:** A `Command` or `Multi-Select` component pulling from the user's earned certifications.

#### B. Right Pane: Live Preview (Sticky, 60% width)
*   **A4 Container:** A white or light-themed div with fixed aspect ratio (`aspect-[1/1.414]`).
*   **Scaling:** Uses `transform: scale()` or a CSS-grid based zoom to ensure it fits the user's screen without losing the A4 layout.
*   **Template Injection:** Dynamically switches layout components based on `selectedTemplateSqid`.

---

## 4. Real-Time Logic & Data Sync
### Auto-Save Strategy
*   **Input Level:** Local state updates the Preview Pane instantly.
*   **Persistence Level:** Debounced (800ms) `PUT` requests to the corresponding backend section endpoints (e.g., `/personal-details`, `/summary`).
*   **Visual Indicator:** A small "Syncing..." or "All changes saved" indicator in the top toolbar using `#00CEC8` accents.

---

## 5. AI Rewrite Flow
1.  User clicks **"✨ Rewrite with AI"**.
2.  Opens a `shadcn/ui` **Dialog**.
3.  User selects **Tone** (Professional, Impact, Concise).
4.  User clicks "Generate".
5.  Show a "Diff" view (Old vs New).
6.  User clicks "Apply" -> Updates the Summary form and the Live Preview.

---

## 6. Template System
Templates are React components that receive the `resumeReview` data object as props.
*   **Template A (Modern):** Sidebar layout, bold headers, minimal icons.
*   **Template B (Executive):** Centered headers, serif fonts, traditional structure.
*   **Template C (Creative):** Two-column, cyan accents, skills-first.

---

## 7. Responsive Design (Adaptive)
*   **Desktop:** Side-by-side (Form | Preview).
*   **Tablet:** Vertical stack or "Toggle View" (Edit Mode vs Preview Mode).
*   **Mobile:** Dashboard access only; Editing is discouraged but available via a simplified "Section-by-Section" wizard.

---

## 8. Validation & Constraints
*   **Length Enforcement:** Progress bars below text areas (e.g., Summary: 80/2000 chars) using `#00CEC8`.
*   **Error States:** `shadcn/ui` Alert components for backend errors (e.g., 409 Conflict, 422 Invalid Selection).
*   **Completeness Checklist:** A floating sidebar that checks off required fields based on the `GET /review` metadata.
