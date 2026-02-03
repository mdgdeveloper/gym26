"use client";

import { useState, useEffect } from "react";
import type { Routine, Exercise, SpecialBlock, Session, CompletedExercise } from "@/types";
import PhaseDivider from "@/components/PhaseDivider";
import ConfigPill from "@/components/ConfigPill";
import WeightInput from "@/components/WeightInput";
import { AlertBox, TipBox } from "@/components/InfoBoxes";

/* ─── HELPERS ─── */
function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  return `${d.getDate()} de ${months[d.getMonth()]}`;
}

function saveSession(routine: Routine, completed: Record<string, boolean>) {
  try {
    const sessions: Session[] = JSON.parse(localStorage.getItem("fitness_sessions") || "[]");
    const completedExercises: CompletedExercise[] = routine.exercises.map((ex) => ({
      exerciseId: ex.id,
      completed: !!completed[ex.id],
    }));
    const totalDone = completedExercises.filter((e) => e.completed).length;
    const session: Session = {
      id: Date.now().toString(),
      routineId: routine.id,
      routineTitle: routine.title,
      date: new Date().toISOString().split("T")[0],
      completedExercises,
      totalExercises: routine.exercises.length,
      completionRate: Math.round((totalDone / routine.exercises.length) * 100),
    };
    // Reemplaza si existe sesión del mismo día para esta rutina
    const idx = sessions.findIndex(
      (s) => s.routineId === routine.id && s.date === session.date
    );
    if (idx >= 0) sessions[idx] = session;
    else sessions.push(session);
    localStorage.setItem("fitness_sessions", JSON.stringify(sessions));
  } catch { }
}

function saveWeightHistory(routineId: string, exerciseId: string, weight: string) {
  try {
    const history: Record<string, Array<{ date: string, weight: string }>> =
      JSON.parse(localStorage.getItem("fitness_weight_history") || "{}");

    const key = `${routineId}_${exerciseId}`;
    const today = new Date().toISOString().split("T")[0];

    if (!history[key]) history[key] = [];

    // Remove today's entry if it exists, then add new one
    history[key] = history[key].filter(entry => entry.date !== today);
    history[key].push({ date: today, weight });

    // Keep only last 10 entries
    history[key] = history[key].slice(-10);

    localStorage.setItem("fitness_weight_history", JSON.stringify(history));
  } catch { }
}

/* ─── EXPORT DEFAULT ─── */
export default function RoutinePage({ routine }: { routine: Routine }) {
  const [openCard, setOpenCard] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(`fitness_checks_${routine.id}`);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });
  const [actualWeights, setActualWeights] = useState<Record<string, string>>(() => {
    try {
      const storedWeights = localStorage.getItem(`fitness_weights_${routine.id}`);
      return storedWeights ? JSON.parse(storedWeights) : {};
    } catch {
      return {};
    }
  });
  const [mounted, setMounted] = useState(true);

  // Guardar checks cada vez que cambian
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`fitness_checks_${routine.id}`, JSON.stringify(checked));
    saveSession(routine, checked);
  }, [checked, mounted, routine]);

  // Guardar pesos cada vez que cambian
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem(`fitness_weights_${routine.id}`, JSON.stringify(actualWeights));
  }, [actualWeights, mounted, routine.id]);

  const toggleCheck = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCard = (id: string) => {
    setOpenCard((prev) => (prev === id ? null : id));
  };

  const updateActualWeight = (exerciseId: string, weight: string) => {
    setActualWeights((prev) => ({ ...prev, [exerciseId]: weight }));
    if (weight.trim()) {
      saveWeightHistory(routine.id, exerciseId, weight);
    }
  };

  // Bloques especiales por tipo
  const cardioBlock = routine.blocks.find((b) => b.type === "cardio");
  const warmupBlock = routine.blocks.find((b) => b.type === "warmup");
  const stretchBlock = routine.blocks.find((b) => b.type === "stretch");

  return (
    <div style={{ padding: "24px 16px 0" }}>
      {/* ─── HEADER ─── */}
      <div style={{ textAlign: "center", marginBottom: "20px", position: "relative" }}>
        <div
          style={{
            fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
            fontSize: "38px",
            letterSpacing: "3px",
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          {routine.title}
        </div>
        <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "4px", fontWeight: 300 }}>
          {formatDate(routine.date)} · {routine.phase}
        </div>
        <div
          style={{
            display: "inline-block",
            marginTop: "10px",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            color: "var(--accent)",
            padding: "4px 14px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
          }}
        >
          {routine.focus}
        </div>
        <div
          style={{
            width: "50px",
            height: "3px",
            background: "var(--accent)",
            borderRadius: "2px",
            margin: "14px auto 0",
          }}
        />
      </div>

      {/* ─── RESUMEN TEMPORAL ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          background: "var(--card)",
          border: "1px solid var(--border-default)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "8px",
        }}
      >
        {[
          { val: routine.summary.cardio, lbl: "Cardio (trote)" },
          { val: routine.summary.warmup, lbl: "Calent." },
          { val: routine.summary.training, lbl: "Entreno" },
          { val: routine.summary.stretch, lbl: "Estir." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "24px", color: "var(--accent)", lineHeight: 1 }}>
                {item.val}
              </div>
              <div style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>
                {item.lbl}
              </div>
            </div>
            {i < 3 && <div style={{ width: "1px", height: "32px", background: "var(--card-light)" }} />}
          </div>
        ))}
      </div>

      {/* ─── CARDIO ─── */}
      {cardioBlock && (
        <>
          <PhaseDivider label="Antes de llegar" />
          <CardioBlock block={cardioBlock} />
        </>
      )}

      {/* ─── CALENTAMIENTO ─── */}
      {warmupBlock && (
        <>
          <PhaseDivider label={`Calentamiento · ${warmupBlock.duration}`} />
          <WarmupBlock block={warmupBlock} />
        </>
      )}

      {/* ─── EJERCICIOS PRINCIPALES ─── */}
      <PhaseDivider label={`Entrenamiento principal · ${routine.summary.training}`} />
      {routine.exercises
        .filter((ex) => ex.type !== "core")
        .sort((a, b) => a.order - b.order)
        .map((exercise) => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            isOpen={openCard === exercise.id}
            isChecked={!!checked[exercise.id]}
            onToggle={() => toggleCard(exercise.id)}
            onCheck={() => toggleCheck(exercise.id)}
            actualWeight={actualWeights[exercise.id] || ""}
            onWeightChange={(weight) => updateActualWeight(exercise.id, weight)}
          />
        ))}

      {/* ─── CORE ─── */}
      {routine.exercises.some((ex) => ex.type === "core") && (
        <>
          <PhaseDivider label="Core" />
          {routine.exercises
            .filter((ex) => ex.type === "core")
            .sort((a, b) => a.order - b.order)
            .map((exercise) => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                isOpen={openCard === exercise.id}
                isChecked={!!checked[exercise.id]}
                onToggle={() => toggleCard(exercise.id)}
                onCheck={() => toggleCheck(exercise.id)}
                actualWeight={actualWeights[exercise.id] || ""}
                onWeightChange={(weight) => updateActualWeight(exercise.id, weight)}
              />
            ))}
        </>
      )}

      {/* ─── ESTIRAMIENTO ─── */}
      {stretchBlock && (
        <>
          <PhaseDivider label={`Estiramiento final · ${stretchBlock.duration}`} />
          <StretchBlock block={stretchBlock} />
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SUB-COMPONENTES
   ═══════════════════════════════════════════ */

/* ─── CARDIO ─── */
function CardioBlock({ block }: { block: SpecialBlock }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a2a1a 0%, #1a1d27 100%)",
        border: "1px solid rgba(91,163,255,0.2)",
        borderRadius: "14px",
        padding: "18px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "rgba(91,163,255,0.12)",
          border: "1px solid rgba(91,163,255,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          flexShrink: 0,
        }}
      >
        🏃
      </div>
      <div>
        <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--blue)" }}>
          {block.title} · {block.duration}
        </div>
        {block.description && (
          <div style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "2px", fontWeight: 300 }}>
            {block.description}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── CALENTAMIENTO ─── */
function WarmupBlock({ block }: { block: SpecialBlock }) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--orange-border)",
        borderRadius: "14px",
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--orange)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🔥 {block.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-dim)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--orange)", flexShrink: 0, marginTop: "6px" }} />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── ESTIRAMIENTO ─── */
function StretchBlock({ block }: { block: SpecialBlock }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #1a1d2a 0%, #1a1d27 100%)",
        border: "1px solid var(--orange-border)",
        borderRadius: "14px",
        padding: "16px 18px",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          fontWeight: 600,
          color: "var(--orange)",
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        🧘 {block.title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {block.items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "var(--text-dim)" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--orange)", flexShrink: 0, marginTop: "6px" }} />
            <span>
              {item.bold && <strong style={{ color: "var(--text)" }}>{item.bold} </strong>}
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── EJERCICIO CARD ─── */
function ExerciseCard({
  exercise,
  isOpen,
  isChecked,
  onToggle,
  onCheck,
  actualWeight,
  onWeightChange,
}: {
  exercise: Exercise;
  isOpen: boolean;
  isChecked: boolean;
  onToggle: () => void;
  onCheck: () => void;
  actualWeight: string;
  onWeightChange: (weight: string) => void;
}) {
  const isCore = exercise.type === "core";
  const isPrincipal = exercise.type === "principal";

  // Colores según tipo
  const numBg = isCore ? "var(--purple-dim)" : isPrincipal ? "rgba(232,255,65,0.18)" : "var(--accent-dim)";
  const numBorder = isCore ? "var(--purple-border)" : isPrincipal ? "rgba(232,255,65,0.4)" : "var(--accent-border)";
  const numColor = isCore ? "var(--purple)" : "var(--accent)";
  const numLabel = isCore ? String.fromCharCode(64 + exercise.order - routine_core_offset(exercise)) : String(exercise.order);

  return (
    <div
      style={{
        background: isCore ? "linear-gradient(135deg, #1d1a2a 0%, #1a1d27 100%)" : "var(--card)",
        border: `1px solid ${isOpen ? (isCore ? "var(--purple-border)" : "var(--accent-border)") : (isCore ? "var(--purple-border)" : "var(--border-default)")}`,
        borderRadius: "14px",
        overflow: "hidden",
        marginBottom: "10px",
        transition: "border-color 0.2s",
      }}
    >
      {/* Header clickeable */}
      <div
        onClick={onToggle}
        style={{ display: "flex", alignItems: "center", padding: "14px 16px", gap: "12px", cursor: "pointer" }}
      >
        {/* Checkbox */}
        <div
          onClick={(e) => { e.stopPropagation(); onCheck(); }}
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "6px",
            border: `2px solid ${isChecked ? "var(--accent)" : "rgba(255,255,255,0.2)"}`,
            background: isChecked ? "var(--accent)" : "transparent",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {isChecked && <span style={{ color: "#000", fontWeight: 700, fontSize: "13px" }}>✓</span>}
        </div>

        {/* Número */}
        <div
          style={{
            width: "34px",
            height: "34px",
            borderRadius: "10px",
            background: numBg,
            border: `1px solid ${numBorder}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Bebas Neue, sans-serif",
            fontSize: "18px",
            color: numColor,
            flexShrink: 0,
          }}
        >
          {isCore ? ["A", "B", "C", "D"][exercise.order - 8] || exercise.order : exercise.order}
        </div>

        {/* Nombre */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 600,
              fontSize: "15px",
              color: isChecked ? "var(--text-dim)" : "var(--text)",
              textDecoration: isChecked ? "line-through" : "none",
              transition: "color 0.2s",
            }}
          >
            {exercise.name}
          </div>
        </div>

        {/* Arrow */}
        <span
          style={{
            fontSize: "14px",
            color: "var(--text-dim)",
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            flexShrink: 0,
          }}
        >
          ▼
        </span>
      </div>

      {/* Pills: series, reps, descanso */}
      <div style={{ padding: "0 16px 12px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
        {exercise.weight && <ConfigPill label="Peso recomendado" value={exercise.weight} isWeight={true} />}
        <WeightInput
          exerciseId={exercise.id}
          actualWeight={actualWeight}
          onWeightChange={onWeightChange}
        />
        <ConfigPill label="Series" value={String(exercise.series)} />
        <ConfigPill label="Reps" value={exercise.reps} />
        <ConfigPill label="Descanso" value={exercise.rest} />
      </div>

      {/* Panel expandible */}
      {isOpen && (
        <div style={{ padding: "0 16px 16px", borderTop: "1px solid var(--border-default)" }}>
          {/* Pasos */}
          <div style={{ marginTop: "14px" }}>
            <div style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "1.5px", textTransform: "uppercase", color: "var(--text-dim)", marginBottom: "8px" }}>
              Cómo hacerlo paso a paso
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {exercise.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "10px", fontSize: "13px", lineHeight: 1.5, color: "var(--text)", fontWeight: 300 }}>
                  <div
                    style={{
                      background: "var(--card-light)",
                      color: "var(--accent)",
                      width: "22px",
                      height: "22px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "11px",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span>{step.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tip */}
          {exercise.tip && <TipBox>{exercise.tip}</TipBox>}

          {/* Alert */}
          {exercise.alert && <AlertBox>{exercise.alert}</AlertBox>}
        </div>
      )}
    </div>
  );
}

// Helper para core (no se usa realmente, los números se manejan directamente)
function routine_core_offset(_ex: Exercise): number { return 0; }
