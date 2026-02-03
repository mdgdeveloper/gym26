export default function ConfigPill({ label, value, isWeight }: { label: string; value: string; isWeight?: boolean }) {
  const weightStyle = isWeight ? {
    background: "linear-gradient(135deg, rgba(91,163,255,0.15) 0%, rgba(91,163,255,0.08) 100%)",
    border: "1px solid rgba(91,163,255,0.25)",
    color: "var(--blue)",
  } : {};

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
        ...weightStyle,
      }}
    >
      {isWeight && "⚖️ "}{label}{" "}
      <span style={{ color: isWeight ? "var(--blue)" : "var(--text)", fontWeight: 600 }}>{value}</span>
    </div>
  );
}
