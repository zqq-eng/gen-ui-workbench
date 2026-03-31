"use client";

import { statData } from "../../lib/mockData";

export default function StatCard() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2,1fr)",
        gap: 14,
      }}
    >
      {statData.map((item, index) => (
        <div
          key={index}
          style={{
            borderRadius: 22,
            padding: 18,
            background:
              index % 2 === 0
                ? "linear-gradient(135deg,#eff6ff,#ffffff)"
                : "linear-gradient(135deg,#faf5ff,#ffffff)",
            border: "1px solid #e5e7eb",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.65)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              marginBottom: 10,
            }}
          >
            {item.label}
          </div>

          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: "#0f172a",
            }}
          >
            {item.value}
          </div>

          <div
            style={{
              marginTop: 10,
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 700,
              color: item.change.startsWith("+")
                ? "#166534"
                : "#b45309",
              background: item.change.startsWith("+")
                ? "#dcfce7"
                : "#fef3c7",
            }}
          >
            {item.change}
          </div>
        </div>
      ))}
    </div>
  );
}