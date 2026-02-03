export default function PhaseDivider({ label }: { label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "24px 0 10px",
      }}
    >
      <div style={{ flex: 1, height: "1px", background: "var(--card-light)" }} />
      <span
        style={{
          fontSize: "10px",
          fontWeight: 600,
          letterSpacing: "2px",
          textTransform: "uppercase",
          color: "var(--text-dim)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <div style={{ flex: 1, height: "1px", background: "var(--card-light)" }} />
    </div>
  );
}
