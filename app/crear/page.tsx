"use client";

import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import type { Routine, Exercise, SpecialBlock, BlockItem, ExerciseStep } from "@/types";

/* ─── HELPERS ─── */

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateId(focus: string, phase: string, week: number, date: string): string {
  const d = new Date(date + "T12:00:00");
  const days = ["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"];
  const day = days[d.getDay()] || "dia";
  const focusSlug = slugify(focus).split("-").slice(0, 1).join("-");
  const phaseMatch = phase.match(/(\d+)/);
  const phaseSlug = phaseMatch ? `fase${phaseMatch[1]}` : slugify(phase);
  return `${day}-${focusSlug}-${phaseSlug}-semana${week}`;
}

function downloadJSON(routine: Routine) {
  const json = JSON.stringify(routine, null, 2);
  const blob = new Blob([json + "\n"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${routine.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ─── SHARED STYLES ─── */

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  background: "var(--card-light)",
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  color: "var(--text)",
  fontSize: "14px",
  fontFamily: "inherit",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  color: "var(--text-dim)",
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const,
  marginBottom: "6px",
  fontWeight: 500,
};

const sectionStyle: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border-default)",
  borderRadius: "14px",
  padding: "20px 16px",
  marginBottom: "16px",
};

const sectionTitleStyle: React.CSSProperties = {
  fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
  fontSize: "20px",
  letterSpacing: "1.5px",
  color: "var(--accent)",
  marginBottom: "16px",
};

const btnSmall: React.CSSProperties = {
  padding: "6px 14px",
  fontSize: "12px",
  fontWeight: 600,
  border: "1px solid var(--border-default)",
  borderRadius: "8px",
  background: "var(--card-light)",
  color: "var(--text)",
  cursor: "pointer",
};

const btnDanger: React.CSSProperties = {
  ...btnSmall,
  color: "var(--red)",
  borderColor: "var(--red-border)",
  background: "var(--red-dim)",
};

/* ─── INITIAL STATES ─── */

interface BlockFormData {
  type: "cardio" | "warmup" | "stretch";
  title: string;
  description: string;
  duration: string;
  items: BlockItem[];
}

interface ExerciseFormData {
  id: string;
  name: string;
  type: "principal" | "secundario" | "core";
  series: number;
  reps: string;
  rest: string;
  weight: string;
  steps: ExerciseStep[];
  tip: string;
  alert: string;
}

function emptyBlock(type: "cardio" | "warmup" | "stretch"): BlockFormData {
  const titles: Record<string, string> = {
    cardio: "Trote al gimnasio",
    warmup: "Preparación muscular",
    stretch: "Recuperación",
  };
  return { type, title: titles[type], description: "", duration: "5 min", items: [] };
}

function emptyExercise(): ExerciseFormData {
  return {
    id: "",
    name: "",
    type: "principal",
    series: 3,
    reps: "10-12",
    rest: "90s",
    weight: "",
    steps: [{ text: "" }],
    tip: "",
    alert: "",
  };
}

/* ─── COMPONENT ─── */

export default function CrearPage() {
  // Routine info
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [focus, setFocus] = useState("");
  const [phase, setPhase] = useState("");
  const [week, setWeek] = useState(1);

  // Summary
  const [cardioTime, setCardioTime] = useState("7 min");
  const [warmupTime, setWarmupTime] = useState("5 min");
  const [trainingTime, setTrainingTime] = useState("28 min");
  const [stretchTime, setStretchTime] = useState("5 min");

  // Blocks
  const [blocks, setBlocks] = useState<BlockFormData[]>([
    emptyBlock("cardio"),
    emptyBlock("warmup"),
    emptyBlock("stretch"),
  ]);

  // Exercises
  const [exercises, setExercises] = useState<ExerciseFormData[]>([emptyExercise()]);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);

  /* ─── BLOCK HANDLERS ─── */

  function updateBlock(idx: number, field: keyof BlockFormData, value: string) {
    setBlocks((prev) => prev.map((b, i) => (i === idx ? { ...b, [field]: value } : b)));
  }

  function addBlockItem(blockIdx: number) {
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === blockIdx ? { ...b, items: [...b.items, { text: "", bold: "" }] } : b
      )
    );
  }

  function removeBlockItem(blockIdx: number, itemIdx: number) {
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === blockIdx ? { ...b, items: b.items.filter((_, j) => j !== itemIdx) } : b
      )
    );
  }

  function updateBlockItem(blockIdx: number, itemIdx: number, field: "text" | "bold", value: string) {
    setBlocks((prev) =>
      prev.map((b, i) =>
        i === blockIdx
          ? { ...b, items: b.items.map((item, j) => (j === itemIdx ? { ...item, [field]: value } : item)) }
          : b
      )
    );
  }

  /* ─── EXERCISE HANDLERS ─── */

  function updateExercise(idx: number, field: keyof ExerciseFormData, value: string | number) {
    setExercises((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  }

  function addExercise() {
    setExercises((prev) => [...prev, emptyExercise()]);
  }

  function removeExercise(idx: number) {
    setExercises((prev) => prev.filter((_, i) => i !== idx));
  }

  function addStep(exIdx: number) {
    setExercises((prev) =>
      prev.map((e, i) => (i === exIdx ? { ...e, steps: [...e.steps, { text: "" }] } : e))
    );
  }

  function removeStep(exIdx: number, stepIdx: number) {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exIdx ? { ...e, steps: e.steps.filter((_, j) => j !== stepIdx) } : e
      )
    );
  }

  function updateStep(exIdx: number, stepIdx: number, value: string) {
    setExercises((prev) =>
      prev.map((e, i) =>
        i === exIdx
          ? { ...e, steps: e.steps.map((s, j) => (j === stepIdx ? { text: value } : s)) }
          : e
      )
    );
  }

  /* ─── SUBMIT ─── */

  function handleSubmit() {
    const errs: string[] = [];
    if (!title.trim()) errs.push("Título es requerido");
    if (!date) errs.push("Fecha es requerida");
    if (!focus.trim()) errs.push("Enfoque es requerido");
    if (!phase.trim()) errs.push("Fase es requerida");
    if (exercises.length === 0) errs.push("Agrega al menos un ejercicio");
    exercises.forEach((ex, i) => {
      if (!ex.name.trim()) errs.push(`Ejercicio ${i + 1}: nombre es requerido`);
      if (!ex.id.trim()) errs.push(`Ejercicio ${i + 1}: ID es requerido`);
    });

    if (errs.length > 0) {
      setErrors(errs);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setErrors([]);

    const routineId = generateId(focus, phase, week, date);

    const routineBlocks: SpecialBlock[] = blocks.map((b) => {
      const block: SpecialBlock = {
        type: b.type,
        title: b.title,
        duration: b.duration,
        items: b.items
          .filter((item) => item.text.trim())
          .map((item) => {
            const bi: BlockItem = { text: item.text };
            if (item.bold?.trim()) bi.bold = item.bold;
            return bi;
          }),
      };
      if (b.description.trim()) block.description = b.description;
      return block;
    });

    const routineExercises: Exercise[] = exercises.map((ex, i) => {
      const exercise: Exercise = {
        id: ex.id,
        name: ex.name,
        order: i + 1,
        type: ex.type,
        series: ex.series,
        reps: ex.reps,
        rest: ex.rest,
        steps: ex.steps.filter((s) => s.text.trim()),
      };
      if (ex.weight.trim()) exercise.weight = ex.weight;
      if (ex.tip.trim()) exercise.tip = ex.tip;
      if (ex.alert.trim()) exercise.alert = ex.alert;
      return exercise;
    });

    const routine: Routine = {
      id: routineId,
      title,
      date,
      focus,
      phase,
      week,
      summary: {
        cardio: cardioTime,
        warmup: warmupTime,
        training: trainingTime,
        stretch: stretchTime,
      },
      blocks: routineBlocks,
      exercises: routineExercises,
    };

    downloadJSON(routine);
  }

  /* ─── RENDER ─── */

  return (
    <div style={{ padding: "24px 16px 100px", maxWidth: "480px", margin: "0 auto" }}>
      {/* ─── HEADER ─── */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h1
          style={{
            fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
            fontSize: "36px",
            letterSpacing: "3px",
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          CREAR RUTINA
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "6px", fontWeight: 300 }}>
          Genera un archivo JSON para tu nueva rutina
        </p>
        <div
          style={{
            width: "50px",
            height: "3px",
            background: "var(--accent)",
            borderRadius: "2px",
            margin: "12px auto 0",
          }}
        />
      </div>

      {/* ─── ERRORS ─── */}
      {errors.length > 0 && (
        <div
          style={{
            background: "var(--red-dim)",
            border: "1px solid var(--red-border)",
            borderRadius: "10px",
            padding: "14px 16px",
            marginBottom: "16px",
          }}
        >
          <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--red)", marginBottom: "6px" }}>
            Corrige los siguientes errores:
          </p>
          {errors.map((err, i) => (
            <p key={i} style={{ fontSize: "12px", color: "var(--red)", marginTop: "4px" }}>
              • {err}
            </p>
          ))}
        </div>
      )}

      {/* ─── SECCIÓN 1: INFO ─── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>INFORMACIÓN</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={labelStyle}>Título</label>
            <input
              style={inputStyle}
              placeholder="MARTES · DÍA 1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Fecha</label>
            <input
              type="date"
              style={{ ...inputStyle, colorScheme: "dark" }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label style={labelStyle}>Enfoque</label>
            <input
              style={inputStyle}
              placeholder="Torso completo · Empuje + Tirón"
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Fase</label>
              <input
                style={inputStyle}
                placeholder="Fase 1 - Adaptación"
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
              />
            </div>
            <div style={{ width: "80px" }}>
              <label style={labelStyle}>Semana</label>
              <input
                type="number"
                min={1}
                style={{ ...inputStyle, textAlign: "center" }}
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ─── SECCIÓN 2: TIEMPOS ─── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>TIEMPOS</h2>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          {[
            { label: "Cardio", value: cardioTime, set: setCardioTime },
            { label: "Calentamiento", value: warmupTime, set: setWarmupTime },
            { label: "Entrenamiento", value: trainingTime, set: setTrainingTime },
            { label: "Estiramiento", value: stretchTime, set: setStretchTime },
          ].map((t) => (
            <div key={t.label}>
              <label style={labelStyle}>{t.label}</label>
              <input
                style={inputStyle}
                placeholder="5 min"
                value={t.value}
                onChange={(e) => t.set(e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ─── SECCIÓN 3: BLOQUES ─── */}
      {blocks.map((block, bIdx) => {
        const colorMap: Record<string, string> = { cardio: "var(--orange)", warmup: "var(--blue)", stretch: "var(--purple)" };
        const nameMap: Record<string, string> = { cardio: "CARDIO", warmup: "CALENTAMIENTO", stretch: "ESTIRAMIENTO" };
        const color = colorMap[block.type];
        return (
          <div key={block.type} style={sectionStyle}>
            <h2 style={{ ...sectionTitleStyle, color }}>{nameMap[block.type]}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div>
                <label style={labelStyle}>Título</label>
                <input
                  style={inputStyle}
                  value={block.title}
                  onChange={(e) => updateBlock(bIdx, "title", e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Descripción (opcional)</label>
                <textarea
                  style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }}
                  value={block.description}
                  onChange={(e) => updateBlock(bIdx, "description", e.target.value)}
                />
              </div>
              <div>
                <label style={labelStyle}>Duración</label>
                <input
                  style={inputStyle}
                  placeholder="5 min"
                  value={block.duration}
                  onChange={(e) => updateBlock(bIdx, "duration", e.target.value)}
                />
              </div>

              {/* Items */}
              <div>
                <label style={labelStyle}>Items</label>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {block.items.map((item, iIdx) => (
                    <div key={iIdx} style={{ display: "flex", flexDirection: "column", gap: "6px", background: "var(--card-light)", borderRadius: "8px", padding: "10px" }}>
                      {block.type === "stretch" && (
                        <input
                          style={{ ...inputStyle, background: "var(--card)" }}
                          placeholder="Parte en negrita (ej: Pectoral:)"
                          value={item.bold || ""}
                          onChange={(e) => updateBlockItem(bIdx, iIdx, "bold", e.target.value)}
                        />
                      )}
                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <textarea
                          style={{ ...inputStyle, background: "var(--card)", flex: 1, minHeight: "40px", resize: "vertical" }}
                          placeholder="Descripción del item"
                          value={item.text}
                          onChange={(e) => updateBlockItem(bIdx, iIdx, "text", e.target.value)}
                        />
                        <button
                          type="button"
                          style={btnDanger}
                          onClick={() => removeBlockItem(bIdx, iIdx)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  style={{ ...btnSmall, marginTop: "8px", color }}
                  onClick={() => addBlockItem(bIdx)}
                >
                  + Agregar item
                </button>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── SECCIÓN 4: EJERCICIOS ─── */}
      <div style={sectionStyle}>
        <h2 style={sectionTitleStyle}>EJERCICIOS</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {exercises.map((ex, eIdx) => {
            const typeColorMap: Record<string, string> = {
              principal: "var(--accent)",
              secundario: "var(--blue)",
              core: "var(--orange)",
            };
            return (
              <div
                key={eIdx}
                style={{
                  background: "var(--card-light)",
                  border: "1px solid var(--border-default)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                  <span
                    style={{
                      fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
                      fontSize: "18px",
                      color: typeColorMap[ex.type],
                      letterSpacing: "1px",
                    }}
                  >
                    EJERCICIO {eIdx + 1}
                  </span>
                  {exercises.length > 1 && (
                    <button type="button" style={btnDanger} onClick={() => removeExercise(eIdx)}>
                      Eliminar
                    </button>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>ID</label>
                      <input
                        style={inputStyle}
                        placeholder="press-banca"
                        value={ex.id}
                        onChange={(e) => updateExercise(eIdx, "id", e.target.value)}
                      />
                    </div>
                    <div style={{ width: "130px" }}>
                      <label style={labelStyle}>Tipo</label>
                      <select
                        style={{ ...inputStyle, cursor: "pointer" }}
                        value={ex.type}
                        onChange={(e) => updateExercise(eIdx, "type", e.target.value)}
                      >
                        <option value="principal">Principal</option>
                        <option value="secundario">Secundario</option>
                        <option value="core">Core</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>Nombre</label>
                    <input
                      style={inputStyle}
                      placeholder="Press de Banca con Barra"
                      value={ex.name}
                      onChange={(e) => updateExercise(eIdx, "name", e.target.value)}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "8px" }}>
                    <div>
                      <label style={labelStyle}>Series</label>
                      <input
                        type="number"
                        min={1}
                        style={{ ...inputStyle, textAlign: "center" }}
                        value={ex.series}
                        onChange={(e) => updateExercise(eIdx, "series", Number(e.target.value))}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Reps</label>
                      <input
                        style={inputStyle}
                        placeholder="10-12"
                        value={ex.reps}
                        onChange={(e) => updateExercise(eIdx, "reps", e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Descanso</label>
                      <input
                        style={inputStyle}
                        placeholder="90s"
                        value={ex.rest}
                        onChange={(e) => updateExercise(eIdx, "rest", e.target.value)}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Peso</label>
                      <input
                        style={inputStyle}
                        placeholder="ligero"
                        value={ex.weight}
                        onChange={(e) => updateExercise(eIdx, "weight", e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Steps */}
                  <div>
                    <label style={labelStyle}>Pasos de ejecución</label>
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                      {ex.steps.map((step, sIdx) => (
                        <div key={sIdx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <span style={{ fontSize: "12px", color: "var(--text-dim)", minWidth: "20px" }}>{sIdx + 1}.</span>
                          <textarea
                            style={{ ...inputStyle, flex: 1, minHeight: "40px", resize: "vertical" }}
                            placeholder="Describe este paso..."
                            value={step.text}
                            onChange={(e) => updateStep(eIdx, sIdx, e.target.value)}
                          />
                          {ex.steps.length > 1 && (
                            <button type="button" style={btnDanger} onClick={() => removeStep(eIdx, sIdx)}>
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      style={{ ...btnSmall, marginTop: "8px" }}
                      onClick={() => addStep(eIdx)}
                    >
                      + Agregar paso
                    </button>
                  </div>

                  {/* Tip & Alert */}
                  <div>
                    <label style={labelStyle}>Consejo (opcional)</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "50px", resize: "vertical" }}
                      placeholder="Consejo que aparece en azul..."
                      value={ex.tip}
                      onChange={(e) => updateExercise(eIdx, "tip", e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Alerta (opcional)</label>
                    <textarea
                      style={{ ...inputStyle, minHeight: "50px", resize: "vertical" }}
                      placeholder="Alerta que aparece en rojo..."
                      value={ex.alert}
                      onChange={(e) => updateExercise(eIdx, "alert", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          style={{
            ...btnSmall,
            marginTop: "16px",
            width: "100%",
            padding: "12px",
            fontSize: "14px",
            color: "var(--accent)",
            borderColor: "var(--accent-border)",
            background: "var(--accent-dim)",
          }}
          onClick={addExercise}
        >
          + Agregar ejercicio
        </button>
      </div>

      {/* ─── SECCIÓN 5: GENERAR ─── */}
      <button
        type="button"
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "16px",
          fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
          fontSize: "22px",
          letterSpacing: "2px",
          color: "var(--bg)",
          background: "var(--accent)",
          border: "none",
          borderRadius: "14px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
      >
        DESCARGAR JSON
      </button>

      <BottomNav />
    </div>
  );
}
