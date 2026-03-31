export type ModuleType =
  | "trendChart"
  | "statCard"
  | "alertList"
  | "mapCard"
  | "tableCard";

export type LayoutType = "single" | "twoColumn";

export interface ModuleItem {
  id: string;
  type: ModuleType;
  title: string;
  position?: "left" | "right";
  props?: Record<string, any>;
}

export interface WorkspaceConfig {
  layout: LayoutType;
  modules: ModuleItem[];
}

export interface ParsedAction {
  type: "add" | "remove" | "update" | "layout" | "reset";
  module?: Partial<ModuleItem>;
  targetType?: ModuleType;
  targetPosition?: "left" | "right";
  removeMode?: "last" | "byType";
  layout?: LayoutType;
  props?: Record<string, any>;
}

export interface ParsedResult {
  rawInput: string;
  actions: ParsedAction[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}