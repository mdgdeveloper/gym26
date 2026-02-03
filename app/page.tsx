import { getAllRoutines } from "@/data";
import RoutineCard from "@/components/RoutineCard";
import BottomNav from "@/components/BottomNav";

export default function HomePage() {
  const routines = getAllRoutines();

  return (
    <div style={{ padding: "24px 16px 100px" }}>
      {/* ─── HEADER ─── */}
      <div style={{ textAlign: "center", marginBottom: "28px", position: "relative" }}>
        <h1
          style={{
            fontFamily: "Bebas Neue, Arial Narrow, sans-serif",
            fontSize: "36px",
            letterSpacing: "3px",
            color: "var(--accent)",
            lineHeight: 1,
          }}
        >
          FITNESS TRACKER
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-dim)", marginTop: "6px", fontWeight: 300 }}>
          Fase 1 · Adaptación
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

      {/* ─── STATS RÁPIDAS ─── */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "24px",
          background: "var(--card)",
          border: "1px solid var(--border-default)",
          borderRadius: "14px",
          padding: "16px",
          marginBottom: "28px",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "26px", color: "var(--accent)", lineHeight: 1 }}>
            {routines.length}
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>
            Rutinas
          </div>
        </div>
        <div style={{ width: "1px", background: "var(--card-light)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "26px", color: "var(--accent)", lineHeight: 1 }}>
            1
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>
            Semana
          </div>
        </div>
        <div style={{ width: "1px", background: "var(--card-light)" }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "26px", color: "var(--accent)", lineHeight: 1 }}>
            3
          </div>
          <div style={{ fontSize: "10px", color: "var(--text-dim)", letterSpacing: "1px", textTransform: "uppercase", marginTop: "3px" }}>
            Días/sem
          </div>
        </div>
      </div>

      {/* ─── LISTA DE RUTINAS ─── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {routines.map((routine) => (
          <RoutineCard key={routine.id} routine={routine} />
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
