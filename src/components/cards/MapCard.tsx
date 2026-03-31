import { mapPoints } from "../../lib/mockData";

export default function MapCard() {
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

      <div
        style={{
          position: "relative",
          height: 320,
          overflow: "hidden",
          borderRadius: 24,
          background:
            "linear-gradient(180deg,#dbeafe 0%, #eff6ff 34%, #f0fdf4 100%)",
          border: "1px solid #dbeafe",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-8%",
            top: "42%",
            width: "120%",
            height: 44,
            borderRadius: 999,
            background: "linear-gradient(90deg,#38bdf8,#2563eb,#60a5fa)",
            transform: "rotate(-7deg)",
            opacity: 0.72,
            boxShadow: "0 0 40px rgba(37,99,235,0.2)",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "6%",
            top: "10%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.25)",
            filter: "blur(6px)",
          }}
        />

        {mapPoints.map((point, index) => {
          const color =
            point.risk === "高"
              ? "#ef4444"
              : point.risk === "中"
              ? "#f59e0b"
              : "#22c55e";

          return (
            <div
              key={index}
              style={{
                position: "absolute",
                left: point.x,
                top: point.y,
                transform: "translate(-50%,-50%)",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 0 8px ${color}22, 0 0 24px ${color}66`,
                  margin: "0 auto 8px",
                }}
              />
              <div
                style={{
                  padding: "5px 10px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.85)",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#0f172a",
                  whiteSpace: "nowrap",
                  border: "1px solid rgba(255,255,255,0.8)",
                  boxShadow: "0 8px 18px rgba(15,23,42,0.08)",
                }}
              >
                {point.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}