"use client";

import Link from "next/link";
import type { Routine } from "@/types";

export default function RoutineCard({ routine }: { routine: Routine }) {
  const dateObj = new Date(routine.date + "T00:00:00");
  const dayNames = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const monthNames = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
  const dayName = dayNames[dateObj.getDay()];
  const day = dateObj.getDate();
  const month = monthNames[dateObj.getMonth()];

  return (
    <Link
      href={`/rutina/${routine.id}`}
      style={{ textDecoration: "none" }}
    >
      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-default)",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          gap: "14px",
          alignItems: "stretch",
          transition: "border-color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--accent-border)")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-default)")}
      >
        {/* Fecha lateral */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--accent-dim)",
            border: "1px solid var(--accent-border)",
            borderRadius: "10px",
            padding: "10px 10px",
            minWidth: "50px",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: "10px", color: "var(--accent)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "1px" }}>
            {dayName}
          </span>
          <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "24px", color: "var(--accent)", lineHeight: 1.1 }}>
            {day}
          </span>
          <span style={{ fontSize: "10px", color: "var(--text-dim)", textTransform: "uppercase" }}>
            {month}
          </span>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: "6px" }}>
          <div style={{ fontWeight: 600, fontSize: "15px", color: "var(--text)" }}>
            {routine.title}
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-dim)", fontWeight: 300 }}>
            {routine.focus}
          </div>
          <div style={{ display: "flex", gap: "8px", marginTop: "2px" }}>
            <span
              style={{
                fontSize: "11px",
                background: "var(--orange-dim)",
                border: "1px solid var(--orange-border)",
                color: "var(--orange)",
                padding: "2px 8px",
                borderRadius: "12px",
                fontWeight: 500,
              }}
            >
              {routine.phase}
            </span>
            <span
              style={{
                fontSize: "11px",
                background: "var(--card-light)",
                color: "var(--text-dim)",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              Sem {routine.week}
            </span>
            <span
              style={{
                fontSize: "11px",
                background: "var(--card-light)",
                color: "var(--text-dim)",
                padding: "2px 8px",
                borderRadius: "12px",
              }}
            >
              {routine.exercises.length} ejercicios
            </span>
          </div>
        </div>

        {/* Flecha */}
        <div style={{ display: "flex", alignItems: "center", color: "var(--text-dim)", fontSize: "18px" }}>
          ›
        </div>
      </div>
    </Link>
  );
}
