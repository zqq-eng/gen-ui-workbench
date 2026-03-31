"use client";

import React from "react";

interface DynamicComponentProps {
  type: string;
  title: string;
  config?: Record<string, any>;
}

/**
 * 动态组件生成器
 * 支持 AI 生成的任意类型组件
 */
export default function DynamicComponent({ type, title, config = {} }: DynamicComponentProps) {
  // 根据类型渲染不同的内容
  const renderContent = () => {
    switch (type) {
      case 'weather':
        return <WeatherWidget config={config} />;
      
      case 'map':
        return <MapWidget config={config} />;
      
      case 'chart':
        return <ChartWidget config={config} />;
      
      case 'stat':
        return <StatWidget config={config} />;
      
      case 'table':
        return <TableWidget config={config} />;
      
      case 'alert':
        return <AlertWidget config={config} />;
      
      case 'text':
        return <TextWidget config={config} />;
      
      case 'image':
        return <ImageWidget config={config} />;
      
      case 'video':
        return <VideoWidget config={config} />;
      
      case 'calendar':
        return <CalendarWidget config={config} />;
      
      case 'progress':
        return <ProgressWidget config={config} />;
      
      default:
        return <DefaultWidget type={type} config={config} />;
    }
  };

  return (
    <div style={{ 
      padding: 16, 
      borderRadius: 12, 
      background: 'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(248,250,252,0.8))',
      border: '1px solid rgba(148,163,184,0.15)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ 
        fontSize: 14, 
        fontWeight: 700, 
        marginBottom: 12, 
        color: '#1e293b',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}>
        <span>{getIcon(type)}</span>
        {title}
      </div>
      {renderContent()}
    </div>
  );
}

// ===== 各种 Widget 实现 =====

function WeatherWidget({ config }: { config: any }) {
  const weather = config.weather || '晴';
  const temperature = config.temperature || 25;
  const city = config.city || '北京';
  
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 48, marginBottom: 8 }}>
        {weather.includes('晴') ? '☀️' : 
         weather.includes('雨') ? '🌧️' : 
         weather.includes('云') ? '☁️' : 
         weather.includes('雪') ? '❄️' : '🌤️'}
      </div>
      <div style={{ fontSize: 32, fontWeight: 900, color: '#3b82f6' }}>
        {temperature}°C
      </div>
      <div style={{ fontSize: 14, color: '#64748b', marginTop: 8 }}>
        {city} · {weather}
      </div>
      <div style={{ 
        marginTop: 16, 
        padding: 12, 
        background: 'rgba(59,130,246,0.08)', 
        borderRadius: 8,
        fontSize: 12,
        color: '#64748b',
      }}>
        💡 空气质量：优 | 湿度：45% | 风力：3 级
      </div>
    </div>
  );
}

function MapWidget({ config }: { config: any }) {
  return (
    <div style={{ 
      height: 300, 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 14,
    }}>
      🗺️ {config.title || '地图展示'}
      {config.points && (
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.8 }}>
          📍 {config.points.length} 个监测点
        </div>
      )}
    </div>
  );
}

function ChartWidget({ config }: { config: any }) {
  const data = config.data || [35, 42, 28, 55, 48, 62, 58];
  const labels = config.labels || ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
  
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 200 }}>
        {data.map((value: number, index: number) => (
          <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div 
              style={{ 
                width: '100%', 
                height: `${(value / Math.max(...data)) * 160}px`,
                background: `linear-gradient(180deg, rgba(59,130,246,${0.3 + (value / Math.max(...data)) * 0.7}), rgba(59,130,246,0.2))`,
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.3s ease',
              }}
            />
            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, transform: 'rotate(-45deg)' }}>
              {labels[index]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatWidget({ config }: { config: any }) {
  const value = config.value || 1234;
  const unit = config.unit || '';
  const trend = config.trend || '+12%';
  
  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: 42, fontWeight: 900, color: '#3b82f6' }}>
        {value.toLocaleString()}{unit}
      </div>
      <div style={{ 
        marginTop: 8, 
        fontSize: 12, 
        color: trend.startsWith('+') ? '#10b981' : '#ef4444',
        fontWeight: 700,
      }}>
        {trend.startsWith('+') ? '📈' : '📉'} {trend}
      </div>
    </div>
  );
}

function TableWidget({ config }: { config: any }) {
  const columns = config.columns || ['姓名', '部门', '状态'];
  const data = config.data || [
    { name: '张三', department: '技术部', status: '正常' },
    { name: '李四', department: '产品部', status: '出差' },
    { name: '王五', department: '设计部', status: '正常' },
  ];
  
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
        <thead>
          <tr style={{ background: 'rgba(59,130,246,0.08)', borderBottom: '2px solid rgba(59,130,246,0.2)' }}>
            {columns.map((col: string, i: number) => (
              <th key={i} style={{ padding: 10, textAlign: 'left', color: '#475569', fontWeight: 700 }}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row: any, i: number) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
              {Object.values(row).map((cell: any, j: number) => (
                <td key={j} style={{ padding: 10, color: '#64748b' }}>
                  {typeof cell === 'string' && cell.includes('正常') ? (
                    <span style={{ padding: '2px 8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: 999, fontSize: 11 }}>
                      {cell}
                    </span>
                  ) : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function AlertWidget({ config }: { config: any }) {
  const alerts = config.alerts || [
    { level: 'high', message: 'CPU 使用率超过 90%' },
    { level: 'medium', message: '内存使用量较高' },
    { level: 'low', message: '磁盘空间不足' },
  ];
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {alerts.map((alert: any, i: number) => (
        <div 
          key={i} 
          style={{ 
            padding: 10, 
            borderRadius: 8,
            background: alert.level === 'high' ? 'rgba(239,68,68,0.08)' : 
                       alert.level === 'medium' ? 'rgba(245,158,11,0.08)' : 
                       'rgba(59,130,246,0.08)',
            border: `1px solid ${
              alert.level === 'high' ? 'rgba(239,68,68,0.2)' : 
              alert.level === 'medium' ? 'rgba(245,158,11,0.2)' : 
              'rgba(59,130,246,0.2)'
            }`,
            color: alert.level === 'high' ? '#dc2626' : 
                   alert.level === 'medium' ? '#d97706' : '#2563eb',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          {alert.level === 'high' ? '🔴' : alert.level === 'medium' ? '🟡' : '🔵'} {alert.message}
        </div>
      ))}
    </div>
  );
}

function TextWidget({ config }: { config: any }) {
  return (
    <div style={{ 
      lineHeight: 1.8, 
      color: '#475569',
      fontSize: config.fontSize || 14,
    }}>
      {config.content || '这是一个文本模块'}
    </div>
  );
}

function ImageWidget({ config }: { config: any }) {
  return (
    <div style={{ 
      width: '100%', 
      height: config.height || 200,
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 14,
    }}>
      🖼️ {config.alt || '图片展示'}
    </div>
  );
}

function VideoWidget({ config }: { config: any }) {
  return (
    <div style={{ 
      width: '100%', 
      aspectRatio: '16/9',
      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      borderRadius: 8,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontSize: 14,
      cursor: 'pointer',
    }}>
      ▶️ {config.title || '视频播放器'}
    </div>
  );
}

function CalendarWidget({ config }: { config: any }) {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#1e293b' }}>
        {today.getFullYear()}年{today.getMonth() + 1}月
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {['日', '一', '二', '三', '四', '五', '六'].map(day => (
          <div key={day} style={{ textAlign: 'center', fontSize: 11, color: '#94a3b8', padding: 4 }}>
            {day}
          </div>
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => (
          <div 
            key={i} 
            style={{ 
              textAlign: 'center', 
              fontSize: 11, 
              padding: 6,
              borderRadius: 4,
              background: i + 1 === today.getDate() ? 'rgba(59,130,246,0.2)' : 'transparent',
              color: i + 1 === today.getDate() ? '#3b82f6' : '#64748b',
              fontWeight: i + 1 === today.getDate() ? 700 : 400,
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProgressWidget({ config }: { config: any }) {
  const progress = config.progress || 75;
  const label = config.label || '进度';
  
  return (
    <div style={{ padding: '10px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontSize: 12, color: '#64748b' }}>{label}</span>
        <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700 }}>{progress}%</span>
      </div>
      <div style={{ 
        width: '100%', 
        height: 8, 
        background: 'rgba(148,163,184,0.2)', 
        borderRadius: 999,
        overflow: 'hidden',
      }}>
        <div style={{ 
          width: `${progress}%`, 
          height: '100%', 
          background: `linear-gradient(90deg, #3b82f6, #8b5cf6)`,
          transition: 'width 0.3s ease',
        }} />
      </div>
    </div>
  );
}

function DefaultWidget({ type, config }: { type: string; config: any }) {
  return (
    <div style={{ 
      padding: 20, 
      textAlign: 'center',
      color: '#94a3b8',
      fontSize: 12,
    }}>
      🔧 未配置的组件类型：<strong>{type}</strong>
      <div style={{ marginTop: 8, opacity: 0.6 }}>
        可以通过扩展 DynamicComponent 来支持
      </div>
    </div>
  );
}

// ===== 辅助函数 =====

function getIcon(type: string): string {
  const icons: Record<string, string> = {
    weather: '🌤️',
    map: '🗺️',
    chart: '📊',
    stat: '📈',
    table: '📋',
    alert: '🔔',
    text: '📝',
    image: '🖼️',
    video: '▶️',
    calendar: '📅',
    progress: '📊',
  };
  return icons[type] || '🔧';
}
