# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal fitness tracker web app ("gym26") built with Next.js 16 (App Router), React 19, TypeScript, and Tailwind CSS 4. Mobile-first design (max 480px), dark theme, Spanish language UI. Routines are defined as static JSON files — no backend or database.

## Commands

- `npm run dev` — Start dev server (Next.js)
- `npm run build` — Production build
- `npm run start` — Serve production build
- `npm run lint` — Run ESLint (flat config, `eslint.config.mjs`)

No test framework is configured.

## Architecture

### Routing (App Router)

- `/` — Home page listing all routines sorted by date (`app/page.tsx`)
- `/rutina/[id]` — Individual routine detail page (`app/rutina/[id]/page.tsx`)
- `/dashboard` — Stats dashboard (placeholder) (`app/dashboard/page.tsx`)
- `/historial` — Session history (placeholder) (`app/historial/page.tsx`)

### Data Layer

Routines are static JSON files in `data/routines/`, each conforming to the `Routine` type. They are imported and registered manually in `data/index.ts`. To add a new routine: create a JSON file in `data/routines/`, import it in `data/index.ts`, and append it to the `allRoutines` array.

The naming convention for routine files is `{day}-{focus}-{phase}-{week}.json` (e.g., `martes-torso-fase1-semana1.json`).

### Types (`types/index.ts`)

Core types: `Routine`, `Exercise`, `SpecialBlock`, `BlockItem`, `ExerciseStep`, `Session`, `CompletedExercise`. A `Routine` contains `blocks` (cardio/warmup/stretch) and `exercises` (principal/secundario/core).

### Components (`components/`)

- `RoutinePage` — Main routine view (client component). Manages exercise completion checkboxes and weight tracking via `localStorage`. This is the most complex component containing sub-components: `ExerciseCard`, `CardioBlock`, `WarmupBlock`, `StretchBlock`.
- `RoutineCard` — Routine list item card with date badge, links to `/rutina/[id]`
- `BottomNav` — Fixed bottom navigation bar (Rutinas / Historial / Dashboard)
- `ConfigPill` — Small pill displaying exercise config (series, reps, rest, weight)
- `WeightInput` — Inline editable weight input with save/cancel
- `InfoBoxes` — `AlertBox` and `TipBox` for exercise tips/warnings
- `PhaseDivider` — Horizontal section divider with label

### State & Persistence

All user state is in `localStorage` (no server state):
- `fitness_checks_{routineId}` — Exercise completion checkmarks
- `fitness_weights_{routineId}` — Actual weights used per exercise
- `fitness_weight_history` — Historical weight entries keyed by `{routineId}_{exerciseId}`
- `fitness_sessions` — Completed session records

### Styling

Dark theme with CSS custom properties defined in `styles/globals.css`. Components use inline styles extensively (not Tailwind utility classes). Key color tokens: `--accent` (yellow-green), `--blue`, `--orange`, `--purple`, `--red`, `--green`. Display font is Bebas Neue; body font is Inter.

### Path Aliases

`@/*` maps to the project root (configured in `tsconfig.json`).
