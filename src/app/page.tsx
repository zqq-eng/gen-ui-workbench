"use client";

import { useState } from "react";
import ChatPanel from "../components/ChatPanel";
import Workspace from "../components/Workspace";
import { parseInput } from "../lib/parser";
import { updateWorkspace } from "../lib/workspaceReducer";
import { ChatMessage, WorkspaceConfig } from "../types/workspace";

function buildAssistantReply(input: string, parsed: any, nextConfig: WorkspaceConfig) {
  if (!parsed.actions.length) {
    return "未识别到有效操作。你可以试试：加趋势图、加告警、删除告警、清空、换成左右布局。";
  }

  const lines: string[] = [];
  lines.push(`已识别输入：${input}`);
  lines.push(`共识别 ${parsed.actions.length} 个操作：`);

  parsed.actions.forEach((action: any, index: number) => {
    if (action.type === "add") {
      lines.push(`${index + 1}. 新增模块：${action.module?.type}`);
    } else if (action.type === "remove") {
      lines.push(`${index + 1}. 删除模块：${action.targetType || "最后一个模块"}`);
    } else if (action.type === "update") {
      lines.push(`${index + 1}. 更新模块：${action.targetType}`);
    } else if (action.type === "layout") {
      lines.push(`${index + 1}. 调整布局：${action.layout}`);
    } else if (action.type === "reset") {
      lines.push(`${index + 1}. 清空工作台`);
    }
  });

  lines.push(`当前布局：${nextConfig.layout}`);
  lines.push(`当前模块数：${nextConfig.modules.length}`);
  return lines.join("\n");
}

export default function Home() {
  const [config, setConfig] = useState<WorkspaceConfig>({
    layout: "single",
    modules: [],
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init-assistant",
      role: "assistant",
      content:
        "你好，我是生成式 UI 工作台助手。你可以让我新增模块、删除模块、切换布局，也可以通过拖动直接调整界面布局。",
    },
  ]);

  const handleSend = (input: string) => {
    const parsed = parseInput(input);
    const newConfig = updateWorkspace(config, parsed);

    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", content: input },
      {
        id: `a-${Date.now() + 1}`,
        role: "assistant",
        content: buildAssistantReply(input, parsed, newConfig),
      },
    ]);

    setConfig(newConfig);
  };

  const handleRemoveModule = (id: string) => {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.filter((m) => m.id !== id),
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: `remove-${Date.now()}`,
        role: "assistant",
        content: "已从界面中删除一个模块。",
      },
    ]);
  };

  const handleMoveModule = (
    moduleId: string,
    targetPosition: "left" | "right" | undefined,
    targetIndex: number
  ) => {
    setConfig((prev) => {
      const moving = prev.modules.find((m) => m.id === moduleId);
      if (!moving) return prev;

      const rest = prev.modules.filter((m) => m.id !== moduleId);

      if (prev.layout === "single") {
        const nextModules = [...rest];
        nextModules.splice(targetIndex, 0, { ...moving, position: undefined });
        return {
          ...prev,
          modules: nextModules,
        };
      }

      const left = rest.filter((m) => m.position === "left");
      const right = rest.filter((m) => m.position !== "left");

      const moved = {
        ...moving,
        position: (targetPosition === "left" ? "left" : "right") as "left" | "right",
      };

      if (targetPosition === "left") {
        const nextLeft = [...left];
        nextLeft.splice(targetIndex, 0, moved);
        return {
          ...prev,
          modules: [...nextLeft, ...right],
        };
      }

      const nextRight = [...right];
      nextRight.splice(targetIndex, 0, moved);
      return {
        ...prev,
        modules: [...left, ...nextRight],
      };
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <div style={{ width: "34%", minWidth: 380 }}>
        <ChatPanel messages={messages} onSend={handleSend} />
      </div>
      <div style={{ width: "66%" }}>
        <Workspace
          config={config}
          onRemoveModule={handleRemoveModule}
          onMoveModule={handleMoveModule}
        />
      </div>
    </div>
  );
}