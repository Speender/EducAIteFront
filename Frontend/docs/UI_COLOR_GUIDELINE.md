# EducAIte UI Color System Guideline

This document defines the color palette and semantic token usage for the EducAIte frontend system. The design follows a **Dark-First, Cyan-Accent, Glassmorphism** aesthetic.

## 1. Core Identity
The primary identity is built on a deep black background contrasted with a vibrant cyan accent.

| Role | Color | Value | Usage |
|---|---|---|---|
| **Primary Accent** | Cyan | `#00CEC8` | Primary buttons, active states, progress indicators, brand emphasis. |
| **Primary Foreground** | Dark Teal | `#031F1E` | Text on primary cyan backgrounds (high contrast). |
| **System Background** | Near Black | `oklch(0.145 0 0)` | Default page background. |
| **Surface Background** | Surface Black | `oklch(0.205 0 0)` | Cards, Modals, Popovers. |

## 2. Functional Colors (Semantic)
Used to communicate status and provide feedback.

| State | Color Family | Token | Usage |
|---|---|---|---|
| **Success** | Emerald | `emerald-500` | Completed sessions, correct answers, positive confirmations. |
| **Warning** | Amber | `amber-500` | Partial correct, pending status, "Restart" warnings. |
| **Error / Destructive** | Rose / Red | `rose-500` | Incorrect answers, deletion actions, critical failures. |
| **Info** | Blue | `blue-500` | Neutral system info, secondary badges. |

## 3. Surface & Glassmorphism
The system uses layers of transparency to create depth (The "Glass" effect).

- **Border:** `oklch(1 0 0 / 10%)` — Subtle white border for cards and containers.
- **Glass Card:** `bg-white/[0.03]` with `backdrop-blur-md` and `border-white/10`.
- **Muted Surface:** `bg-secondary` (`oklch(0.269 0 0)`) — For secondary backgrounds or input fields.

## 4. Typography Colors
Strict hierarchy based on opacity to manage visual weight.

- **Primary Text:** `oklch(0.985 0 0)` — Pure white or near-white for headings and body.
- **Secondary Text:** `text-white/60` — For descriptions and sub-labels.
- **Muted / Disabled:** `text-white/35` — For metadata, timestamps, and placeholders.

## 5. Component Palettes

### Buttons
- **Primary:** `bg-primary` (`#00CEC8`) text `black`.
- **Secondary / Ghost:** `border-white/20` text `white` with `hover:bg-white/10`.
- **Destructive:** `bg-destructive/10` text `destructive` with `hover:bg-destructive/20`.

### Badges
- **Success Badge:** `bg-emerald-500/15` text `emerald-300`.
- **Warning Badge:** `bg-amber-500/15` text `amber-200`.
- **Failure Badge:** `bg-rose-500/15` text `rose-300`.

## 6. Usage Guidelines
1. **Prefer Tokens:** Always use CSS variables (`var(--primary)`) or Tailwind classes (`text-primary`) instead of raw hex codes.
2. **Contrast First:** When using the Cyan accent for text on dark backgrounds, ensure it remains readable. Use the Dark Teal foreground for text *on top* of Cyan surfaces.
3. **Subtle Elevation:** Use borders and slight background shifts (`bg-white/[0.03]`) rather than heavy shadows to define structure.
4. **Consistency:** Stick to the `rose`, `amber`, and `emerald` families for status. Avoid introducing new colors (like orange or purple) unless they represent a completely new domain of logic.
