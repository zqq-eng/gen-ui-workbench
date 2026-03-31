import { alertData } from "../../lib/mockData";

export default function AlertListCard() {
  return (
    <div
      style={{
        borderRadius: 28,
        padding: 20,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.88))",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 20px 48px rgba(15,23,42,0.1)",
      }}
    >

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {alertData.map((item) => {
          const bg =
            item.level === "高"
              ? "linear-gradient(135deg,#fff1f2,#ffffff)"
              : item.level === "中"
              ? "linear-gradient(135deg,#fff7ed,#ffffff)"
              : "linear-gradient(135deg,#f0fdf4,#ffffff)";

          const tagBg =
            item.level === "高"
              ? "#fee2e2"
              : item.level === "中"
              ? "#ffedd5"
              : "#dcfce7";

          const tagColor =
            item.level === "高"
              ? "#b91c1c"
              : item.level === "中"
              ? "#c2410c"
              : "#15803d";

          return (
            <div
              key={item.id}
              style={{
                borderRadius: 20,
                padding: 16,
                background: bg,
                border: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#111827",
                    marginBottom: 6,
                  }}
                >
                  {item.station}
                </div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.8 }}>
                  指标：{item.metric} ｜ 数值：{item.value} ｜ 状态：{item.status}
                  <br />
                  时间：{item.time}
                </div>
              </div>

              <div
                style={{
                  minWidth: 74,
                  textAlign: "center",
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: tagBg,
                  color: tagColor,
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                {item.level}风险
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}