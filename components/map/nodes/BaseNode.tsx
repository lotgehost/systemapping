'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { label: string; color: string; bg: string; bgSelected: string }> = {
  variable:  { label: '변수',     color: '#60a5fa', bg: 'rgba(37,99,235,0.12)',  bgSelected: 'rgba(37,99,235,0.22)' },
  exogenous: { label: '외생변수', color: '#a78bfa', bg: 'rgba(124,58,237,0.12)', bgSelected: 'rgba(124,58,237,0.22)' },
  lever:     { label: '정책 레버', color: '#34d399', bg: 'rgba(5,150,105,0.12)',  bgSelected: 'rgba(5,150,105,0.22)' },
};

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;
  const sources = Array.isArray(data.sources) ? data.sources : [];

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative"
      style={{ minWidth: 160, maxWidth: 210 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: style.color,
          border: '2px solid #1F2023',
          width: 8,
          height: 8,
          top: -4,
        }}
      />

      <div
        className="rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
        style={{
          background: selected ? style.bgSelected : style.bg,
          border: `1px solid ${selected ? style.color + '80' : 'rgba(255,255,255,0.1)'}`,
          boxShadow: selected
            ? `0 0 0 2px ${style.color}33, 0 4px 16px rgba(0,0,0,0.4)`
            : '0 2px 8px rgba(0,0,0,0.3)',
          transform: selected ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        {/* Type badge row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: style.color }}
            />
            <span
              className="text-[9px] font-semibold tracking-widest uppercase"
              style={{ color: style.color }}
            >
              {style.label}
            </span>
          </div>
          {sources.length > 0 && (
            <span
              className="text-[9px] tabular-nums rounded-full px-1.5 py-0.5"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.4)',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {sources.length}
            </span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: '#F3F4F6' }}
        >
          {String(data.label)}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: style.color,
          border: '2px solid #1F2023',
          width: 8,
          height: 8,
          bottom: -4,
        }}
      />
    </div>
  );
}
