"use client";
import { useMemo, useState } from "react";
import { ChatMessage } from "../types/workspace";

interface ChatPanelProps {
  messages: ChatMessage[];
  onSend: (input: string) => void;
}

export default function ChatPanel({ messages, onSend }: ChatPanelProps) {
  const [input, setInput] = useState("");

  const quickActions = useMemo(
    () => [
      "帮我看最近7天水质趋势，再加一个告警列表",
      "再加一个统计卡片",
      "我只想看 pH 和总磷",
      "换成左右布局",
      "把地图放左边，趋势图放右边",
      "删除告警",
      "清空",
    ],
    []
  );

  return (
    <div
      style={{
        height: "100vh",
        padding: 20,
        boxSizing: "border-box",
        borderRight: "1px solid rgba(255,255,255,0.12)",
        background:
          "linear-gradient(180deg, rgba(11,17,32,0.98) 0%, rgba(18,25,46,0.98) 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(18px)",
      }}
    >
      <div
        style={{
          borderRadius: 22,
          padding: 18,
          marginBottom: 16,
          background:
            "linear-gradient(135deg, rgba(59,130,246,0.22), rgba(168,85,247,0.2))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>
          对话驱动工作台
        </div>
        <div
          style={{
            fontSize: 13,
            lineHeight: 1.8,
            color: "rgba(255,255,255,0.78)",
          }}
        >
          自然语言输入后，系统会识别意图、生成模块配置 JSON，并驱动右侧工作台实时变化。
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {quickActions.map((item, index) => (
          <button
            key={index}
            onClick={() => setInput(item)}
            style={{
              cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.07)",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 999,
              fontSize: 12,
              transition: "all .25s ease",
            }}
          >
            {item}
          </button>
        ))}
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 14,
          borderRadius: 24,
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "86%",
                borderRadius: 18,
                padding: "12px 14px",
                whiteSpace: "pre-wrap",
                lineHeight: 1.8,
                fontSize: 14,
                background:
                  msg.role === "user"
                    ? "linear-gradient(135deg,#2563eb,#7c3aed)"
                    : "rgba(255,255,255,0.08)",
                color: "#fff",
                border:
                  msg.role === "user"
                    ? "none"
                    : "1px solid rgba(255,255,255,0.1)",
                boxShadow:
                  msg.role === "user"
                    ? "0 12px 28px rgba(37,99,235,0.32)"
                    : "0 10px 24px rgba(0,0,0,0.18)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.75,
                  marginBottom: 6,
                  letterSpacing: 0.5,
                }}
              >
                {msg.role === "user" ? "USER" : "ASSISTANT"}
              </div>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          borderRadius: 22,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入自然语言需求，例如：把地图放左边，趋势图放右边，再加一个统计卡片"
          style={{
            width: "100%",
            minHeight: 100,
            resize: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "#fff",
            borderRadius: 16,
            padding: 14,
            boxSizing: "border-box",
            outline: "none",
            fontSize: 14,
            lineHeight: 1.8,
          }}
        />
        <button
          onClick={() => {
            if (!input.trim()) return;
            onSend(input);
            setInput("");
          }}
          style={{
            marginTop: 12,
            width: "100%",
            height: 46,
            border: "none",
            borderRadius: 14,
            cursor: "pointer",
            fontWeight: 800,
            fontSize: 15,
            color: "#fff",
            background: "linear-gradient(135deg,#3b82f6,#8b5cf6,#ec4899)",
            boxShadow: "0 14px 28px rgba(99,102,241,0.3)",
          }}
        >
          发送指令
        </button>
      </div>
    </div>
  );
}