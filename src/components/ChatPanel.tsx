"use client";

import { useMemo, useState } from "react";
import { ModuleItem, WorkspaceConfig } from "../types/workspace";

interface Props {
  messages: { id: string; role: "user" | "assistant"; content: string }[];
  selectedModule?: ModuleItem;
  config: WorkspaceConfig;
  onSend: (input: string) => void;
  onUpdateSelectedTitle: (value: string) => void;
}

const quickPrompts = [
  "切换成双列布局",
  "切换成三列布局",
  "新增地图模块到第一列",
  "新增趋势图到第二列",
  "新增表格到第三列",
  "把地图放到左边",
  "把趋势图放到第二列",
];

export default function ChatPanel({ messages, selectedModule, config, onSend, onUpdateSelectedTitle }: Props) {
  const [input, setInput] = useState("");
  const layoutLabel = useMemo(() => ({ single: "单列", twoColumn: "双列", threeColumn: "三列", fourColumn: "四列" }[config.layout]), [config.layout]);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", padding: 20, boxSizing: "border-box", background: "linear-gradient(180deg, #0f172a 0%, #111827 46%, #1e1b4b 100%)", color: "#fff" }}>
      <div style={{ padding: 18, borderRadius: 24, background: "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 18px 40px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize: 26, fontWeight: 900 }}>AI Layout Agent</div>
        <div style={{ marginTop: 8, fontSize: 13, lineHeight: 1.7, color: "rgba(255,255,255,0.78)" }}>当前布局：{layoutLabel}。你可以直接说“新增模块”“移动到第几列”“切换双列、三列、四列”。</div>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 14, marginBottom: 14 }}>
        {quickPrompts.map((prompt) => (
          <button key={prompt} onClick={() => onSend(prompt)} style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, fontWeight: 700, padding: "10px 12px", cursor: "pointer" }}>{prompt}</button>
        ))}
      </div>
      <div style={{ borderRadius: 24, padding: 16, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 10 }}>当前选中模块</div>
        {selectedModule ? (
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.68)", marginBottom: 6 }}>模块标题</div>
            <input value={selectedModule.title} onChange={(event) => onUpdateSelectedTitle(event.target.value)} style={{ width: "100%", height: 42, borderRadius: 14, border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.08)", color: "#fff", padding: "0 12px", boxSizing: "border-box", outline: "none" }} />
            <div style={{ marginTop: 10, fontSize: 12, color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>类型：{selectedModule.type}<br />所在列：{selectedModule.zoneId}</div>
          </div>
        ) : (
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.66)", lineHeight: 1.8 }}>先在中间画布里点一个模块，右侧就会显示它的属性。</div>
        )}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 16, borderRadius: 24, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 12 }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "92%", borderRadius: 18, padding: "12px 14px", whiteSpace: "pre-wrap", lineHeight: 1.8, fontSize: 13, background: msg.role === "user" ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "rgba(255,255,255,0.08)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.1)" }}>{msg.content}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: 14, borderRadius: 22, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <textarea value={input} onChange={(event) => setInput(event.target.value)} placeholder="请输入自然语言，例如：切换成三列布局，把地图放第一列，再新增一个统计卡片到第二列" style={{ width: "100%", minHeight: 92, resize: "none", borderRadius: 16, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)", color: "#fff", padding: 14, boxSizing: "border-box", outline: "none", lineHeight: 1.8 }} />
        <button onClick={() => { if (!input.trim()) return; onSend(input); setInput(""); }} style={{ marginTop: 12, width: "100%", height: 46, border: "none", borderRadius: 14, cursor: "pointer", fontWeight: 900, color: "#fff", background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)", boxShadow: "0 14px 28px rgba(99,102,241,0.3)" }}>发送指令</button>
      </div>
    </div>
  );
}
