export type ModuleType = "trendChart" | "statCard" | "alertList" | "mapCard" | "tableCard";

export type LayoutMode = "single" | "twoColumn" | "threeColumn" | "fourColumn";

export type ZoneId = "col-1" | "col-2" | "col-3" | "col-4";

export interface ModuleItem {
  id: string;
  type: ModuleType;
  title: string;
  zoneId: ZoneId;
  props: Record<string, any>;
}

export interface WorkspaceConfig {
  layout: LayoutMode;
  modules: ModuleItem[];
  selectedModuleId?: string;
}

export interface ParsedAddModule {
  type: ModuleType;
  title?: string;
  props?: Record<string, any>;
  targetZoneId?: ZoneId;
}

export type ParsedAction =
  | { type: "add"; module: ParsedAddModule }
  | { type: "remove"; moduleId?: string; targetType?: ModuleType }
  | { type: "layout"; layout: LayoutMode }
  | { type: "move"; targetType: ModuleType; targetZoneId: ZoneId }
  | { type: "update"; targetType: ModuleType; title?: string; props?: Record<string, any> }
  | { type: "select"; targetType: ModuleType }
  | { type: "reset" };

export interface ParsedResult {
  rawInput: string;
  actions: ParsedAction[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export const layoutColumnsMap: Record<LayoutMode, ZoneId[]> = {
  single: ["col-1"],
  twoColumn: ["col-1", "col-2"],
  threeColumn: ["col-1", "col-2", "col-3"],
  fourColumn: ["col-1", "col-2", "col-3", "col-4"],
};
