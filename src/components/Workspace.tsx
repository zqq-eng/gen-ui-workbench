"use client";

import { useMemo, useState } from "react";
import { componentMap } from "../lib/componentMap";
import ModuleCardShell from "./ModuleCardShell";
import { ModuleItem, WorkspaceConfig, ZoneId, layoutColumnsMap } from "../types/workspace";

interface Props {
  config: WorkspaceConfig;
  onRemoveModule: (id: string) => void;
  onMoveModule: (moduleId: string, targetZoneId: ZoneId, targetIndex: number) => void;
  onSelectModule: (id?: string) => void;
}

const zoneMeta: Record<ZoneId, { title: string; hint: string }> = {
  "col-1": { title: "第一列", hint: "适合地图、导航、总览卡片" },
  "col-2": { title: "第二列", hint: "适合图表、信息、分析模块" },
  "col-3": { title: "第三列", hint: "适合表格、列表、编辑模块" },
  "col-4": { title: "第四列", hint: "适合补充模块、辅助面板" },
};

export default function Workspace({ config, onRemoveModule, onMoveModule, onSelectModule }: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const zones = layoutColumnsMap[config.layout];
  const grouped = useMemo(() => {
    const record: Record<ZoneId, ModuleItem[]> = { "col-1": [], "col-2": [], "col-3": [], "col-4": [] };
    config.modules.forEach((module) => record[module.zoneId].push(module));
    return record;
  }, [config.modules]);

  const renderDropSlot = (zoneId: ZoneId, index: number) => (
    <div
      key={`${zoneId}-${index}`}
      onDragOver={(event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
      }}
      onDrop={(event) => {
        event.preventDefault();
        if (!draggingId) return;
        console.log(`[Drop] moduleId: ${draggingId}, zone: ${zoneId}, index: ${index}`);
        onMoveModule(draggingId, zoneId, index);
        setDraggingId(null);
      }}
      style={{
        height: draggingId ? 18 : 10,
        margin: draggingId ? "8px 0" : "4px 0",
        borderRadius: 999,
        border: draggingId ? "1px dashed rgba(59,130,246,0.45)" : "1px dashed transparent",
        background: draggingId ? "linear-gradient(90deg, rgba(59,130,246,0.18), rgba(168,85,247,0.18))" : "transparent",
        boxShadow: draggingId ? "0 0 0 2px rgba(59,130,246,0.06) inset" : "none",
        transition: "all 0.18s ease",
      }}
    />
  );

  return (
    <div style={{ minHeight: "100vh", padding: 24, background: "radial-gradient(circle at 0% 0%, rgba(59,130,246,0.12), transparent 22%), radial-gradient(circle at 100% 0%, rgba(139,92,246,0.14), transparent 26%), linear-gradient(180deg, #f3f7ff 0%, #eef2ff 42%, #f8fafc 100%)", boxSizing: "border-box" }}>
      <div style={{ borderRadius: 30, border: "1px solid rgba(148,163,184,0.16)", background: "rgba(255,255,255,0.72)", backdropFilter: "blur(18px)", boxShadow: "0 30px 80px rgba(15,23,42,0.12)", overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid rgba(148,163,184,0.12)", background: "linear-gradient(180deg, rgba(255,255,255,0.88), rgba(255,255,255,0.7))" }}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#0f172a" }}>Gen UI Workbench</div>
            <div style={{ marginTop: 6, fontSize: 13, color: "#64748b" }}>容器式页面编排器 · 当前布局：{zones.length} 列 · 模块数：{config.modules.length}</div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { label: "主画布", color: "#2563eb" },
              { label: "插槽拖拽", color: "#8b5cf6" },
              { label: "AI 指令", color: "#ec4899" },
            ].map((item) => (
              <div key={item.label} style={{ padding: "9px 14px", borderRadius: 999, fontSize: 12, fontWeight: 800, color: item.color, background: `${item.color}12` }}>{item.label}</div>
            ))}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${zones.length}, minmax(0, 1fr))`, gap: zones.length === 3 || zones.length === 4 ? 12 : 18, padding: 20, alignItems: "start" }}>
          {zones.map((zoneId) => {
            const modules = grouped[zoneId];
            return (
              <div key={zoneId} style={{ minHeight: 580, borderRadius: 24, border: "1px solid rgba(148,163,184,0.16)", background: "linear-gradient(180deg, rgba(255,255,255,0.85), rgba(248,250,252,0.72))", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.72)", padding: zones.length >= 3 ? 12 : 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: zones.length >= 3 ? 16 : 18, fontWeight: 900, color: "#111827" }}>{zoneMeta[zoneId].title}</div>
                    <div style={{ marginTop: 4, fontSize: 11, color: "#64748b" }}>{zoneMeta[zoneId].hint}</div>
                  </div>
                  <div style={{ width: 14, height: 14, borderRadius: 999, background: draggingId ? "#3b82f6" : "#cbd5e1", boxShadow: draggingId ? "0 0 0 6px rgba(59,130,246,0.16)" : "none" }} />
                </div>
                {modules.length === 0 && !draggingId ? (
                  <div onClick={() => onSelectModule(undefined)} style={{ minHeight: 220, borderRadius: 20, border: "2px dashed rgba(148,163,184,0.22)", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", color: "#94a3b8", fontWeight: 700, padding: zones.length >= 3 ? 16 : 20 }}>
                    这里还是空的。你可以从左侧新增模块，
                    <br />
                    也可以把其它模块拖到这里。
                  </div>
                ) : null}
                {renderDropSlot(zoneId, 0)}
                {modules.map((module, index) => {
                  const Card = componentMap[module.type];
                  return (
                    <div key={module.id}>
                      <ModuleCardShell
                        title={module.title}
                        badge={`${module.type} · ${zoneMeta[module.zoneId].title}`}
                        selected={config.selectedModuleId === module.id}
                        onSelect={() => onSelectModule(module.id)}
                        onRemove={() => onRemoveModule(module.id)}
                        draggable
                        onDragStart={() => setDraggingId(module.id)}
                        onDragEnd={() => setDraggingId(null)}
                      >
                        <Card {...module.props} />
                      </ModuleCardShell>
                      {renderDropSlot(zoneId, index + 1)}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
