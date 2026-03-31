"use client";
import { useEffect, useMemo, useRef } from "react";
import * as echarts from "echarts";
import { trendData } from "../../lib/mockData";

interface Props {
  metrics?: string[];
  timeRange?: string;
}

export default function TrendChartCard({
  metrics = ["pH", "总磷"],
  timeRange = "7d",
}: Props) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  const safeMetrics = useMemo(() => {
    const valid = metrics.filter((m) => ["pH", "总磷", "氨氮"].includes(m));
    return valid.length ? valid : ["pH", "总磷"];
  }, [metrics]);

  const displayData = useMemo(() => {
    if (timeRange === "30d") {
      return [
        ...trendData,
        { date: "04-01", pH: 7.15, 总磷: 0.11, 氨氮: 0.25 },
        { date: "04-02", pH: 7.05, 总磷: 0.16, 氨氮: 0.34 },
        { date: "04-03", pH: 7.22, 总磷: 0.12, 氨氮: 0.27 },
        { date: "04-04", pH: 7.08, 总磷: 0.14, 氨氮: 0.29 },
      ];
    }
    return trendData;
  }, [timeRange]);

  useEffect(() => {
    if (!chartRef.current) return;

    const chart = echarts.init(chartRef.current);
    const colors = ["#2563eb", "#8b5cf6", "#ec4899"];

    const option = {
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15,23,42,0.92)",
        borderWidth: 0,
        textStyle: { color: "#fff" },
      },
      legend: {
        top: 0,
        right: 0,
        textStyle: {
          color: "#475569",
          fontSize: 12,
        },
      },
      grid: {
        left: 16,
        right: 16,
        top: 46,
        bottom: 18,
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: displayData.map((item) => item.date),
        boundaryGap: false,
        axisLine: { lineStyle: { color: "#cbd5e1" } },
        axisLabel: { color: "#64748b" },
      },
      yAxis: {
        type: "value",
        axisLine: { show: false },
        splitLine: {
          lineStyle: {
            color: "rgba(148,163,184,0.18)",
          },
        },
        axisLabel: { color: "#64748b" },
      },
      series: safeMetrics.map((metric, index) => ({
        name: metric,
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 8,
        lineStyle: {
          width: 4,
          color: colors[index % colors.length],
        },
        itemStyle: {
          color: colors[index % colors.length],
        },
        areaStyle: {
          opacity: 0.12,
          color: colors[index % colors.length],
        },
        data: displayData.map((item: any) => item[metric]),
      })),
      animationDuration: 900,
    };

    chart.setOption(option);

    const resizeHandler = () => chart.resize();
    window.addEventListener("resize", resizeHandler);

    return () => {
      window.removeEventListener("resize", resizeHandler);
      chart.dispose();
    };
  }, [safeMetrics, displayData]);

  return (
    <div
      style={{
        borderRadius: 28,
        padding: 20,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.88))",
        border: "1px solid rgba(255,255,255,0.7)",
        boxShadow: "0 20px 48px rgba(15,23,42,0.1)",
        backdropFilter: "blur(16px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>
            水质趋势分析
          </div>
          <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>
            时间范围：{timeRange === "30d" ? "最近30天" : "最近7天"} ｜ 指标：
            {safeMetrics.join("、")}
          </div>
        </div>

        <div
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
            color: "#1d4ed8",
            background: "rgba(37,99,235,0.08)",
          }}
        >
          Trend Insight
        </div>
      </div>

      <div
        ref={chartRef}
        style={{
          width: "100%",
          height: 340,
        }}
      />

      <div
        style={{
          marginTop: 12,
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 12,
        }}
      >
        {[
          {
            label: "pH稳定性",
            value: "92.4%",
            bg: "linear-gradient(135deg,#dbeafe,#eff6ff)",
          },
          {
            label: "总磷风险指数",
            value: "0.18",
            bg: "linear-gradient(135deg,#ede9fe,#f5f3ff)",
          },
          {
            label: "氨氮波动幅度",
            value: "中等",
            bg: "linear-gradient(135deg,#fce7f3,#fff1f2)",
          },
        ].map((item, index) => (
          <div
            key={index}
            style={{
              borderRadius: 18,
              padding: 14,
              background: item.bg,
              border: "1px solid rgba(255,255,255,0.8)",
            }}
          >
            <div style={{ fontSize: 12, color: "#64748b", marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: "#111827" }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}