import BottomNav from "@/components/BottomNav";

export default function DashboardPage() {
  return (
    <div style={{ padding: "24px 16px 100px" }}>
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
          DASHBOARD
        </h1>
        <div style={{ width: "50px", height: "3px", background: "var(--accent)", borderRadius: "2px", margin: "12px auto 0" }} />
      </div>

      <div
        style={{
          background: "var(--card)",
          border: "1px solid var(--border-default)",
          borderRadius: "14px",
          padding: "40px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
        <p style={{ color: "var(--text-dim)", fontSize: "14px" }}>
          Completa algunas sesiones para ver tu progreso aquí.
        </p>
      </div>

      <BottomNav />
    </div>
  );
}
