/* ─── EJERCICIO ─── */
export interface ExerciseStep {
  text: string;
}

export interface Exercise {
  id: string;                  // ej: "press-banca"
  name: string;                // ej: "Press de Banca con Barra"
  order: number;               // posición en la rutina
  type: "principal" | "secundario" | "core"; // define estilo visual
  series: number;
  reps: string;                // "10-12" o "12" o "20s" (tiempo)
  rest: string;                // "90s", "2min"
  weight?: string;             // "ligero", "50kg", etc (peso recomendado)
  actualWeight?: string;       // peso real usado por el usuario
  steps: ExerciseStep[];       // pasos de ejecución
  tip?: string;                // consejo azul (opcional)
  alert?: string;              // alerta roja (opcional)
}

/* ─── BLOQUE ESPECIAL (calentamiento, estiramiento, cardio) ─── */
export interface BlockItem {
  text: string;
  bold?: string;               // parte en negrita (ej: nombre del estiramiento)
}

export interface SpecialBlock {
  type: "cardio" | "warmup" | "stretch";
  title: string;
  description?: string;        // descripción extra (ej: ritmo del trote)
  duration: string;            // "7 min", "5 min"
  items: BlockItem[];
}

/* ─── RUTINA COMPLETA (un día de entrenamiento) ─── */
export interface Routine {
  id: string;                  // ej: "martes-torso-fase1-semana1"
  title: string;               // ej: "MARTES · DÍA 1"
  date: string;                // ej: "2026-02-03" (ISO)
  focus: string;               // ej: "Torso completo · Empuje + Tirón"
  phase: string;               // ej: "Fase 1 - Adaptación"
  week: number;                // semana del plan
  summary: {                   // resumen temporal arriba
    cardio: string;            // "7 min"
    warmup: string;            // "5 min"
    training: string;          // "28 min"
    stretch: string;           // "5 min"
  };
  blocks: SpecialBlock[];      // cardio, calentamiento, estiramiento
  exercises: Exercise[];       // ejercicios principales
}

/* ─── SESIÓN COMPLETADA (se guarda en localStorage) ─── */
export interface CompletedExercise {
  exerciseId: string;
  completed: boolean;
}

export interface Session {
  id: string;                  // timestamp como id
  routineId: string;           // referencia a la rutina
  routineTitle: string;        // título para mostrar
  date: string;                // fecha ISO cuando se completó
  completedExercises: CompletedExercise[];
  totalExercises: number;
  completionRate: number;      // porcentaje 0-100
  notes?: string;              // notas personales opcionales
}
