import { tableData } from "../../lib/mockData";

export default function TableCard() {
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
          overflowX: "auto",
          borderRadius: 20,
          border: "1px solid #e5e7eb",
          background: "#fff",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: 14,
          }}
        >
          <thead>
            <tr style={{ background: "linear-gradient(135deg,#eff6ff,#faf5ff)" }}>
              {["监测点", "时间", "pH", "总磷", "氨氮", "状态"].map((item) => (
                <th
                  key={item}
                  style={{
                    textAlign: "left",
                    padding: "14px 14px",
                    color: "#334155",
                    fontWeight: 800,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                style={{
                  background: index % 2 === 0 ? "#ffffff" : "#fbfdff",
                }}
              >
                <td style={td}>{row.station}</td>
                <td style={td}>{row.time}</td>
                <td style={td}>{row.pH}</td>
                <td style={td}>{row.总磷}</td>
                <td style={td}>{row.氨氮}</td>
                <td style={td}>
                  <span
                    style={{
                      padding: "6px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 800,
                      background: row.status === "告警" ? "#fee2e2" : "#dcfce7",
                      color: row.status === "告警" ? "#b91c1c" : "#15803d",
                    }}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const td: React.CSSProperties = {
  padding: "14px 14px",
  borderBottom: "1px solid #eef2f7",
  color: "#0f172a",
};