export function AlertBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: "10px",
        background: "var(--red-dim)",
        border: "1px solid var(--red-border)",
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "12px",
        color: "#ff8a8a",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <span style={{ flexShrink: 0 }}>⚠️</span>
      <span>{children}</span>
    </div>
  );
}

export function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        marginTop: "10px",
        background: "var(--blue-dim)",
        border: "1px solid var(--blue-border)",
        borderRadius: "8px",
        padding: "10px 12px",
        fontSize: "12px",
        color: "#8fc5ff",
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
      }}
    >
      <span style={{ flexShrink: 0 }}>💡</span>
      <span>{children}</span>
    </div>
  );
}
