import type { Routine } from "@/types";

// ─── IMPORTA AQUÍ CADA NUEVA RUTINA ───
// Cuando añadas un nuevo JSON a esta carpeta, importa y suma al array.
import martesTorsoFase1Semana1 from "./routines/martes-torso-fase1-semana1.json";
import juevesPiernaFase1Semana1 from "./routines/jueves-pierna-fase1-semana1.json";
import juevesTorsoFase1Semana2 from "./routines/jueves-torso-fase1-semana2.json";

// ─── ARRAY DE TODAS LAS RUTINAS ─── (orden: más reciente primero)
const allRoutines: Routine[] = [
  martesTorsoFase1Semana1 as unknown as Routine,
  juevesPiernaFase1Semana1 as unknown as Routine,
  juevesTorsoFase1Semana2 as unknown as Routine,
];

export function getAllRoutines(): Routine[] {
  return allRoutines.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getRoutineById(id: string): Routine | undefined {
  return allRoutines.find((r) => r.id === id);
}
