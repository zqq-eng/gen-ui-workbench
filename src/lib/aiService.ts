export interface AIModuleConfig {
  type: string;
  title: string;
  zoneId: string;
  props: Record<string, any>;
}

export interface AIResponse {
  modules: AIModuleConfig[];
  layout?: string;
  explanation: string;
}

const API_KEY = "b628edbc-dddc-4c93-93c8-41bb3e211a18";
const API_URL = "https://api.deepseek.com/v1/chat/completions";

const SYSTEM_PROMPT = `你是一个专业的 UI 布局助手，擅长根据用户的自然语言描述生成合理的界面模块配置。

你的任务是：
1. 理解用户需求，生成合适的模块配置
2. 每个模块包含以下字段：
   - type: 模块类型（见下方列表）
   - title: 模块标题（简洁明了）
   - zoneId: 所在列（col-1/col-2/col-3/col-4）
   - props: 模块属性配置

可用的模块类型（包括传统和 AI 新增类型）：
基础模块：
- mapCard: 地图模块，适合监测点位分布、区域总览
- trendChart: 趋势图，适合时间序列分析、趋势对比
- statCard: 统计卡片，适合 KPI 指标、数据汇总
- alertList: 告警列表，适合异常提醒、风险预警
- tableCard: 数据表格，适合明细记录、列表展示

AI 新增模块：
- weather: 天气模块，适合天气预报、环境监测
- calendar: 日历模块，适合日程安排、时间规划
- progress: 进度条模块，适合任务进度、完成度展示
- text: 文本模块，适合说明文字、段落内容
- image: 图片模块，适合图像展示
- video: 视频模块，适合视频播放

请始终以 JSON 格式回复，格式如下：
{
  "modules": [
    {
      "type": "模块类型",
      "title": "模块标题",
      "zoneId": "所在列",
      "props": {}
    }
  ],
  "layout": "建议的布局（可选：single/twoColumn/threeColumn/fourColumn）",
  "explanation": "配置说明"
}`;

export async function generateModuleConfig(userInput: string): Promise<AIResponse> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userInput },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    const aiContent = data.choices[0]?.message?.content || "{}";
    
    // 解析 AI 返回的 JSON
    const parsed = JSON.parse(aiContent);
    
    return {
      modules: parsed.modules || [],
      layout: parsed.layout,
      explanation: parsed.explanation || "已为您生成模块配置",
    };
  } catch (error) {
    console.error("AI generation error:", error);
    throw error;
  }
}

// 将 AI 生成的配置转换为 workspace 可识别的操作
export function convertAIToActions(aiResponse: AIResponse) {
  const actions: any[] = [];
  
  // 如果有布局建议，添加布局操作
  if (aiResponse.layout) {
    actions.push({
      type: "layout" as const,
      layout: aiResponse.layout as any,
    });
  }
  
  // 为每个模块添加新增操作
  aiResponse.modules.forEach((moduleConfig) => {
    actions.push({
      type: "add" as const,
      module: {
        type: moduleConfig.type as any,
        title: moduleConfig.title,
        targetZoneId: moduleConfig.zoneId as ZoneId,
        props: moduleConfig.props,
      },
    });
  });
  
  return actions;
}

import { ZoneId } from "../types/workspace";
