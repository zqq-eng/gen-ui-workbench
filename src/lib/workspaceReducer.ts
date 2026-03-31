import {
  ModuleItem,
  ModuleType,
  ParsedResult,
  WorkspaceConfig,
} from "../types/workspace";

function createModule(module: Partial<ModuleItem>): ModuleItem {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type: module.type as ModuleType,
    title: module.title || "",
    position: module.position,
    props: module.props || {},
  };
}

function hasModule(config: WorkspaceConfig, type: ModuleType) {
  return config.modules.some((m) => m.type === type);
}

export function updateWorkspace(
  config: WorkspaceConfig,
  parsed: ParsedResult
): WorkspaceConfig {
  const next: WorkspaceConfig = {
    layout: config.layout,
    modules: [...config.modules],
  };

  for (const action of parsed.actions) {
    if (action.type === "reset") {
      next.layout = "single";
      next.modules = [];
      continue;
    }

    if (action.type === "layout" && action.layout) {
      next.layout = action.layout;
      if (action.layout === "single") {
        next.modules = next.modules.map((m) => ({ ...m, position: undefined }));
      } else {
        next.modules = next.modules.map((m) => ({
          ...m,
          position: m.position || (m.type === "mapCard" ? "left" : "right"),
        }));
      }
      continue;
    }

    if (action.type === "add" && action.module?.type) {
      const t = action.module.type as ModuleType;
      if (!hasModule(next, t)) {
        next.modules.push(
          createModule({
            ...action.module,
            position:
              next.layout === "twoColumn"
                ? t === "mapCard"
                  ? "left"
                  : "right"
                : undefined,
          })
        );
      }
      continue;
    }

    if (action.type === "remove") {
      if (action.removeMode === "last") {
        next.modules.pop();
      } else if (action.removeMode === "byType" && action.targetType) {
        next.modules = next.modules.filter((m) => m.type !== action.targetType);
      }
      continue;
    }

    if (action.type === "update" && action.targetType) {
      next.modules = next.modules.map((m) => {
        if (m.type !== action.targetType) return m;
        return {
          ...m,
          position: action.targetPosition || m.position,
          props: {
            ...m.props,
            ...(action.props || {}),
          },
        };
      });
    }
  }

  return next;
}