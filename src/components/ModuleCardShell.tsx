import React from "react";

interface Props {
  title: string;
  badge: string;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  children: React.ReactNode;
}

export default function ModuleCardShell({ title, badge, selected, onSelect, onRemove, draggable, onDragStart, onDragEnd, children }: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={(e) => {
        console.log(`[DragStart] module: ${title}`);
        e.dataTransfer.effectAllowed = "move";
        onDragStart?.();
      }}
      onDragEnd={() => {
        console.log(`[DragEnd] module: ${title}`);
        onDragEnd?.();
      }}
      onClick={onSelect}
      style={{
        borderRadius: 28,
        padding: 14,
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))",
        border: selected ? "1px solid rgba(59,130,246,0.65)" : "1px solid rgba(148,163,184,0.18)",
        boxShadow: selected ? "0 0 0 3px rgba(59,130,246,0.16), 0 28px 60px rgba(15,23,42,0.16)" : "0 18px 44px rgba(15,23,42,0.12)",
        cursor: "grab",
        transition: "all 0.22s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: "4px 4px 12px" }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 900, color: "#0f172a" }}>{title}</div>
          <div style={{ marginTop: 4, fontSize: 12, color: "#64748b" }}>{badge}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ padding: "6px 10px", borderRadius: 999, fontSize: 11, fontWeight: 800, color: "#1d4ed8", background: "rgba(59,130,246,0.08)" }}>draggable</div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onRemove?.();
            }}
            style={{ width: 34, height: 34, borderRadius: 12, border: "1px solid rgba(148,163,184,0.2)", background: "#fff", cursor: "pointer", fontSize: 16, color: "#ef4444" }}
          >
            ×
          </button>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}
