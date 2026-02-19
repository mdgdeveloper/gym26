# gym26

Personal fitness tracker web app for managing workout routines with a focus on progressive overload tracking.

## Features

- **Static Routine Management** — Workout routines defined as JSON files, no backend required
- **Exercise Tracking** — Check off completed exercises and track weights used
- **Weight History** — View historical weight progression for each exercise
- **Mobile-First Design** — Optimized for mobile devices (max 480px)
- **Dark Theme** — Eye-friendly dark mode interface
- **Spanish UI** — Complete Spanish language interface
- **Exercise Structure** — Support for cardio, warmup, main exercises, and stretching blocks
- **Local Persistence** — All progress saved in browser localStorage

## Tech Stack

- **Next.js 16** — React framework with App Router
- **React 19** — Latest React features
- **TypeScript** — Type-safe development
- **Tailwind CSS 4** — Utility-first CSS framework
- **LocalStorage** — Client-side data persistence

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd gym26

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm run start    # Serve production build
npm run lint     # Run ESLint
```

## Project Structure

```
gym26/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page (routine list)
│   ├── rutina/[id]/       # Individual routine pages
│   ├── dashboard/         # Stats dashboard (placeholder)
│   └── historial/         # Session history (placeholder)
├── components/            # React components
│   ├── RoutinePage.tsx   # Main routine view with exercise tracking
│   ├── RoutineCard.tsx   # Routine list item
│   ├── BottomNav.tsx     # Bottom navigation bar
│   ├── WeightInput.tsx   # Inline weight editor
│   └── ...               # Other UI components
├── data/                  # Static routine data
│   ├── routines/         # JSON routine files
│   └── index.ts          # Routine registry
├── types/                 # TypeScript type definitions
│   └── index.ts          # Core types (Routine, Exercise, etc.)
└── styles/               # Global styles and CSS variables
    └── globals.css
```

## Adding New Routines

To add a new workout routine:

1. **Create a JSON file** in `data/routines/` following the naming convention:
   ```
   {day}-{focus}-{phase}-{week}.json
   ```
   Example: `martes-torso-fase1-semana1.json`

2. **Define the routine** using the `Routine` type structure:
   ```json
   {
     "id": "unique-id",
     "title": "Routine Title",
     "date": "2026-02-18",
     "phase": "1",
     "week": "1",
     "day": "Martes",
     "focus": "Torso",
     "blocks": { /* cardio, warmup, stretch */ },
     "exercises": [ /* exercise array */ ]
   }
   ```

3. **Register the routine** in `data/index.ts`:
   ```typescript
   import newRoutine from './routines/your-new-routine.json';

   export const allRoutines: Routine[] = [
     // ... existing routines
     newRoutine as Routine,
   ];
   ```

4. The routine will automatically appear on the home page sorted by date.

## Data Persistence

All user data is stored in browser `localStorage`:

- **`fitness_checks_{routineId}`** — Exercise completion checkmarks
- **`fitness_weights_{routineId}`** — Current weights used per exercise
- **`fitness_weight_history`** — Historical weight entries by exercise
- **`fitness_sessions`** — Completed workout session records

## Architecture

### Routing

- `/` — Home page listing all routines
- `/rutina/[id]` — Individual routine detail and tracking
- `/dashboard` — Statistics dashboard (placeholder)
- `/historial` — Session history (placeholder)

### Key Components

- **RoutinePage** — Main routine component managing exercise state
- **ExerciseCard** — Individual exercise display with completion tracking
- **WeightInput** — Inline editable weight input with save/cancel
- **ConfigPill** — Exercise configuration display (series/reps/rest)

### Styling

Dark theme using CSS custom properties defined in `globals.css`:
- `--accent` — Yellow-green accent color
- `--blue`, `--orange`, `--purple`, `--red`, `--green` — Exercise type colors
- Display font: Bebas Neue
- Body font: Inter

## Development

This project uses:
- **ESLint** with flat config (`eslint.config.mjs`)
- **TypeScript** strict mode
- **Path aliases** — `@/*` maps to project root

No test framework is currently configured.

## License

Private personal project.
