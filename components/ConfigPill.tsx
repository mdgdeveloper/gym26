export default function ConfigPill({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--card-light)",
        borderRadius: "6px",
        padding: "4px 9px",
        fontSize: "12px",
        fontWeight: 500,
        color: "var(--text-dim)",
        whiteSpace: "nowrap",
      }}
    >
      {label}{" "}
      <span style={{ color: "var(--text)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
