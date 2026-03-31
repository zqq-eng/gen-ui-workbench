"use client";

import React, { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import Workspace from "../components/Workspace";
import { parseInput } from "../lib/parser";
import { generateModuleConfig, convertAIToActions } from "../lib/aiService";
import { addModuleToWorkspace, moveModuleInWorkspace, selectModule, updateSelectedModule, updateWorkspace } from "../lib/workspaceReducer";
import { ChatMessage, ModuleType, WorkspaceConfig, ZoneId } from "../types/workspace";

const palette: { type: ModuleType; title: string; intro: string }[] = [
  { type: "mapCard", title: "地图模块", intro: "适合监测点位、分布总览" },
  { type: "trendChart", title: "趋势图", intro: "适合趋势分析、时间序列" },
  { type: "statCard", title: "统计卡片", intro: "适合 KPI、汇总指标" },
  { type: "alertList", title: "告警列表", intro: "适合异常、风险提示" },
  { type: "tableCard", title: "数据表格", intro: "适合明细记录、列表展示" },
];

function buildAssistantReply(input: string, nextConfig: WorkspaceConfig) {
  const lines: string[] = [];
  lines.push(`已执行指令：${input}`);
  lines.push(`当前布局：${nextConfig.layout}`);
  lines.push(`当前模块数：${nextConfig.modules.length}`);
  if (nextConfig.selectedModuleId) {
    const current = nextConfig.modules.find((item) => item.id === nextConfig.selectedModuleId);
    if (current) lines.push(`当前焦点模块：${current.title}（${current.zoneId}）`);
  }
  lines.push(`现在你可以继续说：切换三列、把地图放第一列、把趋势图放第二列、新增表格到第三列。
拖拽也已经支持跨列插入。`);
  return lines.join("\n");
}

function LayoutSelectorModal({ 
  isOpen, 
  onClose, 
  currentLayout, 
  onLayoutChange 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  currentLayout: WorkspaceConfig["layout"]; 
  onLayoutChange: (layout: WorkspaceConfig["layout"]) => void;
}) {
  if (!isOpen) return null;

  const layouts = [
    { key: "single", label: "单列", description: "适合简单页面、单栏内容" },
    { key: "twoColumn", label: "双列", description: "适合对比、左右布局" },
    { key: "threeColumn", label: "三列", description: "适合复杂信息展示" },
    { key: "fourColumn", label: "四列", description: "适合多维度数据分析" },
  ];

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div style={{ width: 520, borderRadius: 24, background: "linear-gradient(180deg, #1e293b, #0f172a)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 40px 80px rgba(0,0,0,0.4)", padding: 24 }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 24, fontWeight: 900, color: "#fff", marginBottom: 8 }}>选择布局模式</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.68)", marginBottom: 20 }}>选择适合当前任务的布局方式</div>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
          {layouts.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onLayoutChange(item.key as WorkspaceConfig["layout"]);
                onClose();
              }}
              style={{
                textAlign: "left",
                padding: 18,
                borderRadius: 16,
                border: currentLayout === item.key ? "2px solid rgba(96,165,250,0.8)" : "1px solid rgba(255,255,255,0.08)",
                background: currentLayout === item.key ? "rgba(59,130,246,0.2)" : "rgba(255,255,255,0.04)",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 6 }}>{item.label}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.64)", lineHeight: 1.6 }}>{item.description}</div>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: 20,
            width: "100%",
            height: 44,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontWeight: 800,
            cursor: "pointer",
          }}
        >
          取消
        </button>
      </div>
    </div>
  );
}

function LeftPanel({ 
  onAdd, 
  onOpenLayoutSelector, 
  currentLayout,
  messages = [],
  onSend,
  isGenerating,
}: { 
  onAdd: (type: ModuleType) => void; 
  onOpenLayoutSelector: () => void; 
  currentLayout: WorkspaceConfig["layout"];
  messages?: ChatMessage[];
  onSend: (input: string) => void;
  isGenerating?: boolean;
}) {
  const [input, setInput] = useState("");

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", padding: 16, boxSizing: "border-box", background: "linear-gradient(180deg, #0b1220 0%, #101827 46%, #0f172a 100%)", color: "#fff", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* 顶部标题区 */}
      <div style={{ borderRadius: 20, padding: 12, background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))", border: "1px solid rgba(255,255,255,0.08)", marginBottom: 10 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>AI 对话输入区</div>
        <div style={{ marginTop: 4, lineHeight: 1.5, fontSize: 11, color: "rgba(255,255,255,0.72)" }}>通过自然语言描述你的需求，AI 将自动编排界面布局。</div>
        {isGenerating && (
          <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6, padding: 6, borderRadius: 8, background: "rgba(59,130,246,0.15)", border: "1px solid rgba(59,130,246,0.3)" }}>
            <div style={{ width: 12, height: 12, border: "2px solid rgba(59,130,246,0.3)", borderTopColor: "#3b82f6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: "#60a5fa" }}>AI 正在生成中...</span>
          </div>
        )}
      </div>

      {/* 布局设置按钮 */}
      <button
        onClick={onOpenLayoutSelector}
        style={{
          width: "100%",
          padding: 10,
          borderRadius: 14,
          border: "1px solid rgba(96,165,250,0.4)",
          background: "rgba(59,130,246,0.15)",
          color: "#fff",
          cursor: "pointer",
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 2 }}>布局设置</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.68)" }}>当前：{currentLayout === "single" ? "单列" : currentLayout === "twoColumn" ? "双列" : currentLayout === "threeColumn" ? "三列" : "四列"}</div>
        </div>
        <div style={{ fontSize: 16 }}>⚙️</div>
      </button>

      {/* 模块库 - 小气泡展示 */}
      <div style={{ borderRadius: 14, padding: 10, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 10, flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 800, marginBottom: 6, opacity: 0.7 }}>模块库</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {palette.map((item) => (
            <button 
              key={item.type} 
              onClick={() => onAdd(item.type)} 
              title={item.intro}
              style={{ 
                padding: "6px 12px", 
                borderRadius: 999, 
                border: "1px solid rgba(255,255,255,0.08)", 
                background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))", 
                color: "#fff", 
                cursor: "pointer",
                fontSize: 11,
                fontWeight: 700,
                transition: "all 0.2s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(59,130,246,0.2)";
                e.currentTarget.style.borderColor = "rgba(59,130,246,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* 对话消息区 - 增加比例 */}
      <div style={{ flex: 4, minHeight: 0, display: "flex", flexDirection: "column", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 800, marginBottom: 8, opacity: 0.7 }}>对话记录</div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, borderRadius: 16, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: 8 }}>
          {(messages || []).map((msg) => (
            <div key={msg.id} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
              <div style={{ maxWidth: "85%", borderRadius: msg.role === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "8px 12px", whiteSpace: "pre-wrap", lineHeight: 1.5, fontSize: 11, background: msg.role === "user" ? "linear-gradient(135deg, #2563eb, #7c3aed)" : "rgba(255,255,255,0.05)", border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.06)" }}>{msg.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 输入框 - 增加高度 */}
      <div style={{ flexShrink: 0 }}>
        <textarea 
          value={input} 
          onChange={(event) => setInput(event.target.value)} 
          placeholder="请输入需求，支持二次追问..." 
          style={{ 
            width: "100%", 
            minHeight: 90, 
            resize: "none", 
            borderRadius: 16, 
            border: "1px solid rgba(255,255,255,0.1)", 
            background: "rgba(255,255,255,0.04)", 
            color: "#fff", 
            padding: 10, 
            boxSizing: "border-box", 
            outline: "none", 
            lineHeight: 1.5,
            fontSize: 12,
          }} 
        />
        <button 
          onClick={() => { if (!input.trim()) return; onSend(input); setInput(""); }} 
          style={{ 
            marginTop: 6, 
            width: "100%", 
            height: 36, 
            border: "none", 
            borderRadius: 14, 
            cursor: "pointer", 
            fontWeight: 900, 
            color: "#fff", 
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)", 
            boxShadow: "0 12px 24px rgba(99,102,241,0.3)",
            fontSize: 13,
          }}
        >
          发送指令
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [config, setConfig] = React.useState<WorkspaceConfig>({ layout: "twoColumn", modules: [] });
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    { id: "init-assistant", role: "assistant", content: `你好！我已经重构了界面布局。左侧是对话输入区，右侧是动态生成的工作台。

现在支持 AI 智能生成模块配置！您可以直接描述需求，例如：
- "我需要一个水质监测仪表盘，包含地图、趋势图和统计指标"
- "帮我创建一个环保监控页面，要有告警列表和数据表格"
- "生成一个三列布局的仪表盘，第一列放地图，第二列放趋势图" 

点击左侧的「布局设置」按钮也可以手动选择单列、双列、三列或四列布局。` },
  ]);
  const [isLayoutModalOpen, setIsLayoutModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedModule = config.modules.find((item) => item.id === config.selectedModuleId);
  const pushAssistant = (content: string) => setMessages((prev) => [...prev, { id: `assistant-${Date.now()}`, role: "assistant", content }]);

  // 辅助函数：获取模块类型的中文名称
  const getModuleName = (type: string) => {
    const nameMap: Record<string, string> = {
      trendChart: "趋势图",
      statCard: "统计卡片",
      alertList: "告警列表",
      mapCard: "地图模块",
      tableCard: "数据表格",
      // AI Engine 新类型
      weather: "天气模块",
      chart: "图表",
      map: "地图",
      stat: "统计卡片",
      table: "数据表格",
      alert: "告警列表",
      text: "文本",
      image: "图片",
      video: "视频",
      calendar: "日历",
      progress: "进度条",
    };
    return nameMap[type] || type;
  };

  const handleSend = async (input: string) => {
    // 添加用户消息
    setMessages((prev) => [...prev, { id: `user-${Date.now()}`, role: "user", content: input }]);
    
    try {
      setIsGenerating(true);
      
      // 🚀 使用 AI 生成（基于现有 aiService）
      pushAssistant('🚀 AI 正在生成页面...');
      const aiResponse = await generateModuleConfig(input);
      
      if (aiResponse.modules && aiResponse.modules.length > 0) {
        // 转换 AI 响应为操作
        const actions = convertAIToActions(aiResponse);
        
        // 执行所有操作
        let nextConfig = config;
        actions.forEach((action) => {
          nextConfig = updateWorkspace(nextConfig, { rawInput: input, actions: [action] });
        });
        
        setConfig(nextConfig);
        
        // 显示成功消息
        pushAssistant(`✨ 已生成 ${aiResponse.modules.length} 个模块：\n${aiResponse.modules.map(m => `- ${m.title}（${getModuleName(m.type.replace('Card', ''))}）`).join('\n')}\n\n当前布局：${nextConfig.layout}，模块总数：${nextConfig.modules.length}`);
      } else {
        // 如果 AI 没有生成模块，回退到传统解析
        const parsed = parseInput(input);
        const nextConfig = updateWorkspace(config, parsed);
        setConfig(nextConfig);
        pushAssistant(buildAssistantReply(input, nextConfig));
      }
      
    } catch (error) {
      console.error("AI 失败，回退到基础解析:", error);
      
      // 回退到规则解析
      const parsed = parseInput(input);
      const nextConfig = updateWorkspace(config, parsed);
      setConfig(nextConfig);
      setMessages((prev) => [...prev, { id: `assistant-${Date.now() + 1}`, role: "assistant", content: buildAssistantReply(input, nextConfig) }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdd = (type: ModuleType) => {
    setConfig((prev) => {
      const next = addModuleToWorkspace(prev, type);
      next.selectedModuleId = next.modules[next.modules.length - 1]?.id;
      return next;
    });
    pushAssistant(`已新增一个${palette.find((item) => item.type === type)?.title}，你现在可以继续拖拽到指定列。`);
  };

  const handleLayoutChange = (layout: WorkspaceConfig["layout"]) => {
    const next = updateWorkspace(config, { rawInput: layout, actions: [{ type: "layout", layout }] });
    setConfig(next);
    pushAssistant(`布局已切换为${layout}。你现在可以把任意模块拖到任意列中。`);
  };

  const handleRemoveModule = (id: string) => {
    setConfig((prev) => ({ ...prev, modules: prev.modules.filter((item) => item.id !== id), selectedModuleId: prev.selectedModuleId === id ? undefined : prev.selectedModuleId }));
    pushAssistant("已删除一个模块。画布会立即刷新。");
  };

  const handleMoveModule = (moduleId: string, targetZoneId: ZoneId, targetIndex: number) => setConfig((prev) => moveModuleInWorkspace(prev, moduleId, targetZoneId, targetIndex));
  const handleSelectModule = (id?: string) => setConfig((prev) => selectModule(prev, id));
  const handleUpdateSelectedTitle = (value: string) => selectedModule && setConfig((prev) => updateSelectedModule(prev, selectedModule.id, { title: value }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", minHeight: "100vh" }}>
      <LeftPanel onAdd={handleAdd} onOpenLayoutSelector={() => setIsLayoutModalOpen(true)} currentLayout={config.layout} messages={messages} onSend={handleSend} isGenerating={isGenerating} />
      <Workspace config={config} onRemoveModule={handleRemoveModule} onMoveModule={handleMoveModule} onSelectModule={handleSelectModule} />
      <LayoutSelectorModal 
        isOpen={isLayoutModalOpen} 
        onClose={() => setIsLayoutModalOpen(false)} 
        currentLayout={config.layout} 
        onLayoutChange={handleLayoutChange} 
      />
      {/* 添加 CSS 动画 */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
