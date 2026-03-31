import {
  LayoutMode,
  ModuleItem,
  ModuleType,
  ParsedResult,
  WorkspaceConfig,
  ZoneId,
  layoutColumnsMap,
} from "../types/workspace";

const moduleTitleMap: Record<ModuleType, string> = {
  trendChart: "水质趋势图",
  statCard: "统计指标",
  alertList: "告警列表",
  mapCard: "地图模块",
  tableCard: "数据表格",
};

function createModule(type: ModuleType, zoneId: ZoneId, props: Record<string, any> = {}, title?: string): ModuleItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    title: title || moduleTitleMap[type],
    zoneId,
    props,
  };
}

function lastZone(layout: LayoutMode): ZoneId {
  const zones = layoutColumnsMap[layout];
  return zones[zones.length - 1];
}

export function getDefaultZoneForType(type: ModuleType, layout: LayoutMode): ZoneId {
  const zones = layoutColumnsMap[layout];
  if (zones.length === 1) return "col-1";
  if (type === "mapCard") return zones[0];
  if (type === "trendChart" && zones.length >= 2) return zones[1];
  if (type === "alertList") return lastZone(layout);
  if (type === "tableCard" && zones.length >= 3) return zones[2];
  return zones[Math.min(1, zones.length - 1)];
}

export function ensureModulesInValidZones(config: WorkspaceConfig): WorkspaceConfig {
  const validZones = new Set(layoutColumnsMap[config.layout]);
  return {
    ...config,
    modules: config.modules.map((module) => ({
      ...module,
      zoneId: validZones.has(module.zoneId) ? module.zoneId : lastZone(config.layout),
    })),
  };
}

export function addModuleToWorkspace(
  config: WorkspaceConfig,
  type: ModuleType,
  zoneId?: ZoneId,
  props: Record<string, any> = {},
  title?: string
): WorkspaceConfig {
  const nextZone = zoneId || getDefaultZoneForType(type, config.layout);
  const next = {
    ...config,
    modules: [...config.modules, createModule(type, nextZone, props, title)],
  };
  return ensureModulesInValidZones(next);
}

export function moveModuleInWorkspace(
  config: WorkspaceConfig,
  moduleId: string,
  targetZoneId: ZoneId,
  targetIndex: number
): WorkspaceConfig {
  const moving = config.modules.find((item) => item.id === moduleId);
  if (!moving) {
    console.warn(`[moveModuleInWorkspace] Module not found: ${moduleId}`);
    return config;
  }

  console.log(`[moveModuleInWorkspace] Moving module: ${moduleId} to zone: ${targetZoneId}, index: ${targetIndex}`);
  console.log(`[moveModuleInWorkspace] Current modules in target zone:`, 
    config.modules.filter(m => m.zoneId === targetZoneId).map(m => m.title));

  const remaining = config.modules.filter((item) => item.id !== moduleId);
  const nonTarget = remaining.filter((item) => item.zoneId !== targetZoneId);
  const targetZoneModules = remaining.filter((item) => item.zoneId === targetZoneId);
  const safeIndex = Math.max(0, Math.min(targetIndex, targetZoneModules.length));
  const nextTargetZoneModules = [...targetZoneModules];
  nextTargetZoneModules.splice(safeIndex, 0, { ...moving, zoneId: targetZoneId });

  const orderedModules: ModuleItem[] = [];
  layoutColumnsMap[config.layout].forEach((zone) => {
    const source = zone === targetZoneId ? nextTargetZoneModules : nonTarget.filter((item) => item.zoneId === zone);
    orderedModules.push(...source);
  });

  console.log(`[moveModuleInWorkspace] New order:`, orderedModules.map(m => `${m.title}(${m.zoneId})`));

  return {
    ...config,
    modules: orderedModules,
    selectedModuleId: moduleId,
  };
}

export function selectModule(config: WorkspaceConfig, moduleId?: string): WorkspaceConfig {
  return {
    ...config,
    selectedModuleId: moduleId,
  };
}

export function updateSelectedModule(
  config: WorkspaceConfig,
  moduleId: string,
  patch: Partial<Pick<ModuleItem, "title" | "props">>
): WorkspaceConfig {
  return {
    ...config,
    modules: config.modules.map((item) =>
      item.id === moduleId
        ? {
            ...item,
            title: patch.title ?? item.title,
            props: patch.props ? { ...item.props, ...patch.props } : item.props,
          }
        : item
    ),
  };
}

export function updateWorkspace(config: WorkspaceConfig, parsed: ParsedResult): WorkspaceConfig {
  let next: WorkspaceConfig = { ...config, modules: [...config.modules] };

  for (const action of parsed.actions) {
    if (action.type === "reset") {
      next = { layout: "single", modules: [], selectedModuleId: undefined };
      continue;
    }

    if (action.type === "layout") {
      next = ensureModulesInValidZones({ ...next, layout: action.layout });
      continue;
    }

    if (action.type === "add") {
      next = addModuleToWorkspace(next, action.module.type, action.module.targetZoneId, action.module.props, action.module.title);
      next.selectedModuleId = next.modules[next.modules.length - 1]?.id;
      continue;
    }

    if (action.type === "remove") {
      const toRemoveId = action.moduleId || next.modules.find((item) => item.type === action.targetType)?.id || next.modules[next.modules.length - 1]?.id;
      next = {
        ...next,
        modules: next.modules.filter((item) => item.id !== toRemoveId),
        selectedModuleId: next.selectedModuleId === toRemoveId ? undefined : next.selectedModuleId,
      };
      continue;
    }

    if (action.type === "move") {
      const candidate = next.modules.find((item) => item.type === action.targetType);
      if (candidate) {
        const targetIndex = next.modules.filter((item) => item.zoneId === action.targetZoneId).length;
        next = moveModuleInWorkspace(next, candidate.id, action.targetZoneId, targetIndex);
      }
      continue;
    }

    if (action.type === "update") {
      const candidate = next.modules.find((item) => item.type === action.targetType);
      if (candidate) {
        next = updateSelectedModule(next, candidate.id, {
          title: action.title,
          props: action.props,
        });
      }
      continue;
    }

    if (action.type === "select") {
      next.selectedModuleId = next.modules.find((item) => item.type === action.targetType)?.id;
    }
  }

  return ensureModulesInValidZones(next);
}
