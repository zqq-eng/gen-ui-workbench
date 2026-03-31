import { ModuleType, ParsedAction, ParsedResult } from "../types/workspace";

function detectMetrics(input: string): string[] | undefined {
  const metrics: string[] = [];
  if (input.includes("pH") || input.includes("ph") || input.includes("PH")) metrics.push("pH");
  if (input.includes("总磷")) metrics.push("总磷");
  if (input.includes("氨氮")) metrics.push("氨氮");
  return metrics.length ? metrics : undefined;
}

function detectTimeRange(input: string): string | undefined {
  if (input.includes("最近7天") || input.includes("7天")) return "7d";
  if (input.includes("最近30天") || input.includes("30天")) return "30d";
  return undefined;
}

function getTitle(type: ModuleType) {
  const map: Record<ModuleType, string> = {
    trendChart: "水质趋势图",
    statCard: "统计指标",
    alertList: "告警列表",
    mapCard: "地图模块",
    tableCard: "数据表格",
  };
  return map[type];
}

function buildAddAction(type: ModuleType, input: string): ParsedAction {
  const metrics = detectMetrics(input);
  const timeRange = detectTimeRange(input);

  return {
    type: "add",
    module: {
      type,
      title: getTitle(type),
      props: {
        ...(metrics ? { metrics } : {}),
        ...(timeRange ? { timeRange } : {}),
      },
    },
  };
}

export function parseInput(input: string): ParsedResult {
  const text = input.trim();
  const actions: ParsedAction[] = [];

  if (!text) return { rawInput: "", actions: [] };

  if (text.includes("清空") || text.includes("重置") || text.includes("重新开始")) {
    actions.push({ type: "reset" });
    return { rawInput: text, actions };
  }

  if (text.includes("单列") || text.includes("一列")) {
    actions.push({ type: "layout", layout: "single" });
  }

  if (
    text.includes("左右布局") ||
    text.includes("双列") ||
    text.includes("两列") ||
    (text.includes("左边") && text.includes("右边"))
  ) {
    actions.push({ type: "layout", layout: "twoColumn" });
  }

  const isRemove = text.includes("删除") || text.includes("去掉") || text.includes("不要");

  if (isRemove) {
    if (text.includes("趋势")) {
      actions.push({ type: "remove", targetType: "trendChart", removeMode: "byType" });
    } else if (text.includes("统计")) {
      actions.push({ type: "remove", targetType: "statCard", removeMode: "byType" });
    } else if (text.includes("告警")) {
      actions.push({ type: "remove", targetType: "alertList", removeMode: "byType" });
    } else if (text.includes("地图")) {
      actions.push({ type: "remove", targetType: "mapCard", removeMode: "byType" });
    } else if (text.includes("表格")) {
      actions.push({ type: "remove", targetType: "tableCard", removeMode: "byType" });
    } else {
      actions.push({ type: "remove", removeMode: "last" });
    }
  } else {
    if (text.includes("趋势")) actions.push(buildAddAction("trendChart", text));
    if (text.includes("统计")) actions.push(buildAddAction("statCard", text));
    if (text.includes("告警")) actions.push(buildAddAction("alertList", text));
    if (text.includes("地图")) actions.push(buildAddAction("mapCard", text));
    if (text.includes("表格")) actions.push(buildAddAction("tableCard", text));
  }

  const metrics = detectMetrics(text);
  const timeRange = detectTimeRange(text);

  if (text.includes("只看") || text.includes("只想看") || (metrics && !text.includes("加")) || (timeRange && !text.includes("加"))) {
    actions.push({
      type: "update",
      targetType: "trendChart",
      props: {
        ...(metrics ? { metrics } : {}),
        ...(timeRange ? { timeRange } : {}),
      },
    });
  }

  if (text.includes("地图放左边")) {
    actions.push({ type: "update", targetType: "mapCard", targetPosition: "left" });
  }
  if (text.includes("地图放右边")) {
    actions.push({ type: "update", targetType: "mapCard", targetPosition: "right" });
  }
  if (text.includes("趋势图放左边") || text.includes("趋势放左边")) {
    actions.push({ type: "update", targetType: "trendChart", targetPosition: "left" });
  }
  if (text.includes("趋势图放右边") || text.includes("趋势放右边")) {
    actions.push({ type: "update", targetType: "trendChart", targetPosition: "right" });
  }

  return { rawInput: text, actions };
}