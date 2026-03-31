import { LayoutMode, ModuleType, ParsedAction, ParsedResult, ZoneId } from "../types/workspace";

function detectMetrics(input: string): string[] | undefined {
  const metrics: string[] = [];
  if (/(pH|PH|ph)/.test(input)) metrics.push("pH");
  if (input.includes("总磷")) metrics.push("总磷");
  if (input.includes("氨氮")) metrics.push("氨氮");
  return metrics.length ? metrics : undefined;
}

function detectTimeRange(input: string): string | undefined {
  if (input.includes("最近30天") || input.includes("30天")) return "30d";
  if (input.includes("最近7天") || input.includes("7天")) return "7d";
  return undefined;
}

function getTitle(type: ModuleType): string {
  return {
    trendChart: "水质趋势图",
    statCard: "统计指标",
    alertList: "告警列表",
    mapCard: "地图模块",
    tableCard: "数据表格",
  }[type];
}

function inferZoneId(text: string): ZoneId | undefined {
  if (text.includes("左边") || text.includes("左侧") || text.includes("第一列")) return "col-1";
  if (text.includes("右边") || text.includes("右侧")) return "col-2";
  if (text.includes("第二列")) return "col-2";
  if (text.includes("第三列")) return "col-3";
  if (text.includes("第四列")) return "col-4";
  return undefined;
}

function inferLayout(text: string): LayoutMode | undefined {
  if (text.includes("四列") || text.includes("4列")) return "fourColumn";
  if (text.includes("三列") || text.includes("3列")) return "threeColumn";
  if (text.includes("双列") || text.includes("两列") || text.includes("左右布局")) return "twoColumn";
  if (text.includes("单列") || text.includes("一列")) return "single";
  return undefined;
}

function buildAddAction(type: ModuleType, input: string): ParsedAction {
  const metrics = detectMetrics(input);
  const timeRange = detectTimeRange(input);
  return {
    type: "add",
    module: {
      type,
      title: getTitle(type),
      targetZoneId: inferZoneId(input),
      props: {
        ...(metrics ? { metrics } : {}),
        ...(timeRange ? { timeRange } : {}),
      },
    },
  };
}

function moduleMentions(text: string): ModuleType[] {
  const matches: ModuleType[] = [];
  if (text.includes("趋势")) matches.push("trendChart");
  if (text.includes("统计")) matches.push("statCard");
  if (text.includes("告警")) matches.push("alertList");
  if (text.includes("地图")) matches.push("mapCard");
  if (text.includes("表格") || text.includes("列表")) matches.push("tableCard");
  return Array.from(new Set(matches));
}

export function parseInput(input: string): ParsedResult {
  const text = input.trim();
  const actions: ParsedAction[] = [];
  if (!text) return { rawInput: text, actions };

  if (text.includes("清空") || text.includes("重置") || text.includes("重新开始")) {
    return { rawInput: text, actions: [{ type: "reset" }] };
  }

  const layout = inferLayout(text);
  if (layout) actions.push({ type: "layout", layout });

  const mentionedModules = moduleMentions(text);
  const removeMode = text.includes("删除") || text.includes("去掉") || text.includes("不要");
  const moveMode = (text.includes("放") || text.includes("移到")) && !!inferZoneId(text);

  if (removeMode) {
    if (mentionedModules.length) {
      mentionedModules.forEach((type) => actions.push({ type: "remove", targetType: type }));
    } else {
      actions.push({ type: "remove" });
    }
    return { rawInput: text, actions };
  }

  if (moveMode && mentionedModules.length) {
    const targetZoneId = inferZoneId(text)!;
    mentionedModules.forEach((type) => actions.push({ type: "move", targetType: type, targetZoneId }));
  }

  const addMode = /(加|新增|添加|放一个|来个|加入)/.test(text);
  if (addMode) {
    mentionedModules.forEach((type) => actions.push(buildAddAction(type, text)));
  }

  const metrics = detectMetrics(text);
  const timeRange = detectTimeRange(text);
  if ((metrics || timeRange) && text.includes("趋势")) {
    actions.push({
      type: "update",
      targetType: "trendChart",
      props: {
        ...(metrics ? { metrics } : {}),
        ...(timeRange ? { timeRange } : {}),
      },
    });
  }

  if (!actions.length && mentionedModules.length) {
    mentionedModules.forEach((type) => actions.push(buildAddAction(type, text)));
  }

  return { rawInput: text, actions };
}
