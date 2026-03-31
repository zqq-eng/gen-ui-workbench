export const trendData = [
  { date: "03-25", pH: 7.1, 总磷: 0.12, 氨氮: 0.32 },
  { date: "03-26", pH: 7.0, 总磷: 0.15, 氨氮: 0.35 },
  { date: "03-27", pH: 7.3, 总磷: 0.11, 氨氮: 0.28 },
  { date: "03-28", pH: 7.2, 总磷: 0.14, 氨氮: 0.3 },
  { date: "03-29", pH: 6.9, 总磷: 0.18, 氨氮: 0.41 },
  { date: "03-30", pH: 7.1, 总磷: 0.13, 氨氮: 0.29 },
  { date: "03-31", pH: 7.2, 总磷: 0.1, 氨氮: 0.26 },
];

export const statData = [
  { label: "监测点数量", value: "12", change: "+2.3%" },
  { label: "今日告警数", value: "5", change: "-8.1%" },
  { label: "平均 pH", value: "7.11", change: "+0.4%" },
  { label: "总磷均值", value: "0.13", change: "-3.2%" },
];

export const alertData = [
  {
    id: "A-001",
    level: "高",
    station: "一号监测点",
    metric: "总磷",
    value: "0.18",
    time: "2026-03-31 09:30",
    status: "超标预警",
  },
  {
    id: "A-002",
    level: "中",
    station: "二号监测点",
    metric: "氨氮",
    value: "0.41",
    time: "2026-03-31 10:20",
    status: "异常波动",
  },
  {
    id: "A-003",
    level: "低",
    station: "三号监测点",
    metric: "pH",
    value: "6.90",
    time: "2026-03-31 11:05",
    status: "接近阈值",
  },
];

export const tableData = [
  {
    station: "一号监测点",
    time: "2026-03-31 09:30",
    pH: 7.1,
    总磷: 0.18,
    氨氮: 0.32,
    status: "告警",
  },
  {
    station: "二号监测点",
    time: "2026-03-31 10:20",
    pH: 7.0,
    总磷: 0.15,
    氨氮: 0.41,
    status: "告警",
  },
  {
    station: "三号监测点",
    time: "2026-03-31 11:05",
    pH: 6.9,
    总磷: 0.12,
    氨氮: 0.28,
    status: "正常",
  },
  {
    station: "四号监测点",
    time: "2026-03-31 11:40",
    pH: 7.2,
    总磷: 0.1,
    氨氮: 0.26,
    status: "正常",
  },
  {
    station: "五号监测点",
    time: "2026-03-31 12:10",
    pH: 7.3,
    总磷: 0.11,
    氨氮: 0.25,
    status: "正常",
  },
];

export const mapPoints = [
  { name: "一号监测点", x: "16%", y: "28%", risk: "高" },
  { name: "二号监测点", x: "38%", y: "48%", risk: "中" },
  { name: "三号监测点", x: "60%", y: "24%", risk: "低" },
  { name: "四号监测点", x: "78%", y: "64%", risk: "低" },
];