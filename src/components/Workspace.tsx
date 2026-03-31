"use client";

import { useMemo, useState } from "react";
import { componentMap } from "../lib/componentMap";
import ModuleCardShell from "./ModuleCardShell";

interface Props {
  config: any;
  onRemoveModule: (id: string) => void;
  onMoveModule: (
    moduleId: string,
    targetPosition: "left" | "right" | undefined,
    targetIndex: number
  ) => void;
}

export default function Workspace({
  config,
  onRemoveModule,
  onMoveModule,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const leftModules = useMemo(
    () => config.modules.filter((m: any) => m.position === "left"),
    [config.modules]
  );

  const rightModules = useMemo(
    () =>
      config.layout === "twoColumn"
        ? config.modules.filter((m: any) => m.position !== "left")
        : config.modules,
    [config.modules, config.layout]
  );

  const renderDropZone = (
    targetPosition: "left" | "right" | undefined,
    targetIndex: number
  ) => (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        if (!draggingId) return;
        onMoveModule(draggingId, targetPosition, targetIndex);
        setDraggingId(null);
      }}
      style={{
        height: 16,
        margin: "4px 0",
        borderRadius: 10,
        background: draggingId
          ? "linear-gradient(90deg, rgba(59,130,246,0.16), rgba(168,85,247,0.16))"
          : "transparent",
        border: draggingId
          ? "1px dashed rgba(99,102,241,0.35)"
          : "1px dashed transparent",
      }}
    />
  );

  const renderOneCard = (m: any) => {
    const C = componentMap[m.type];
    return (
      <ModuleCardShell
        key={m.id}
        title={m.title}
        badge={m.type}
        onRemove={() => onRemoveModule(m.id)}
        draggable
        onDragStart={() => setDraggingId(m.id)}
        onDragEnd={() => setDraggingId(null)}
      >
        <C {...m.props} />
      </ModuleCardShell>
    );
  };

  const pageBg: React.CSSProperties = {
    minHeight: "100vh",
    padding: 22,
    background:
      "radial-gradient(circle at top left, rgba(59,130,246,0.12), transparent 28%), radial-gradient(circle at top right, rgba(168,85,247,0.1), transparent 24%), linear-gradient(180deg,#eef4ff 0%, #f7f9fc 100%)",
    boxSizing: "border-box",
  };

  if (config.modules.length === 0) {
    return (
      <div style={pageBg}>
        <div
          style={{
            height: "calc(100vh - 44px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 28,
            border: "2px dashed rgba(99,102,241,0.25)",
            background: "rgba(255,255,255,0.7)",
            color: "#64748b",
            fontSize: 20,
            fontWeight: 700,
          }}
        >
          输入一条需求，让工作台自动生成模块
        </div>
      </div>
    );
  }

  if (config.layout === "twoColumn") {
    return (
      <div style={pageBg}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          <div style={{ minHeight: 300 }}>
            {renderDropZone("left", 0)}
            {leftModules.map((m: any, i: number) => (
              <div key={m.id}>
                {renderOneCard(m)}
                {renderDropZone("left", i + 1)}
              </div>
            ))}
          </div>

          <div style={{ minHeight: 300 }}>
            {renderDropZone("right", 0)}
            {rightModules.map((m: any, i: number) => (
              <div key={m.id}>
                {renderOneCard(m)}
                {renderDropZone("right", i + 1)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={pageBg}>
      {renderDropZone(undefined, 0)}
      {config.modules.map((m: any, i: number) => (
        <div key={m.id}>
          {renderOneCard(m)}
          {renderDropZone(undefined, i + 1)}
        </div>
      ))}
    </div>
  );
}