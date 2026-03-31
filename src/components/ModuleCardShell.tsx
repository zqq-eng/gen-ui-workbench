"use client";

import React from "react";

interface Props {
  title: string;
  badge?: string;
  children: React.ReactNode;
  onRemove?: () => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: React.DragEvent<HTMLDivElement>) => void;
}

export default function ModuleCardShell({
  title,
  badge,
  children,
  onRemove,
  draggable,
  onDragStart,
  onDragEnd,
}: Props) {
  return (
    <div
      draggable={draggable}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      style={{
        borderRadius: 24,
        padding: 18,
        background: "linear-gradient(180deg,#ffffff,#f8fbff)",
        border: "1px solid #e5e7eb",
        boxShadow: "0 12px 28px rgba(15,23,42,0.08)",
        cursor: draggable ? "grab" : "default",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>
            {title}
          </div>
          {badge ? (
            <div
              style={{
                marginTop: 6,
                display: "inline-block",
                fontSize: 12,
                color: "#2563eb",
                background: "#eff6ff",
                borderRadius: 999,
                padding: "4px 10px",
                fontWeight: 700,
              }}
            >
              {badge}
            </div>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ color: "#94a3b8", fontSize: 18 }}>⋮⋮</span>
          {onRemove ? (
            <button
              onClick={onRemove}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "none",
                cursor: "pointer",
                background: "#fee2e2",
                color: "#b91c1c",
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              ×
            </button>
          ) : null}
        </div>
      </div>

      {children}
    </div>
  );
}