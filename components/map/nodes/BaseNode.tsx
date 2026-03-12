'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { label: string; color: string; bg: string }> = {
  variable:  { label: '변수',     color: '#2563eb', bg: '#eff6ff' },
  exogenous: { label: '외생변수', color: '#7c3aed', bg: '#f5f3ff' },
  lever:     { label: '정책 레버', color: '#059669', bg: '#ecfdf5' },
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
          border: '2px solid #fff',
          width: 8,
          height: 8,
          top: -4,
        }}
      />

      <div
        className="rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
        style={{
          background: selected ? style.bg : '#ffffff',
          border: `1px solid ${selected ? style.color : 'rgba(0,0,0,0.08)'}`,
          boxShadow: selected
            ? `0 0 0 2px ${style.color}33, 0 4px 16px rgba(0,0,0,0.1)`
            : '0 2px 8px rgba(0,0,0,0.07)',
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
                background: 'rgba(0,0,0,0.05)',
                color: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(0,0,0,0.07)',
              }}
            >
              {sources.length}
            </span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: '#111111' }}
        >
          {String(data.label)}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: style.color,
          border: '2px solid #fff',
          width: 8,
          height: 8,
          bottom: -4,
        }}
      />
    </div>
  );
}
