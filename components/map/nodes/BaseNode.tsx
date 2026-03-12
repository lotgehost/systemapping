'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { label: string; color: string; bg: string; bgSelected: string; border: string; borderSelected: string }> = {
  variable:  { label: 'Variable', color: '#2563eb', bg: 'rgba(37,99,235,0.07)',   bgSelected: 'rgba(37,99,235,0.13)',  border: 'rgba(37,99,235,0.2)',   borderSelected: 'rgba(37,99,235,0.5)' },
  exogenous: { label: 'External', color: '#7c3aed', bg: 'rgba(124,58,237,0.07)',  bgSelected: 'rgba(124,58,237,0.13)', border: 'rgba(124,58,237,0.2)',  borderSelected: 'rgba(124,58,237,0.5)' },
  lever:     { label: 'Lever',    color: '#059669', bg: 'rgba(5,150,105,0.07)',   bgSelected: 'rgba(5,150,105,0.13)',  border: 'rgba(5,150,105,0.2)',   borderSelected: 'rgba(5,150,105,0.5)' },
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
          border: '2px solid #ffffff',
          width: 8,
          height: 8,
          top: -4,
        }}
      />

      <div
        className="rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
        style={{
          background: selected ? style.bgSelected : style.bg,
          border: `1px solid ${selected ? style.borderSelected : style.border}`,
          boxShadow: selected
            ? `0 0 0 2px ${style.color}22, 0 4px 16px rgba(0,0,0,0.1)`
            : '0 2px 8px rgba(0,0,0,0.06)',
          transform: selected ? 'translateY(-1px)' : 'translateY(0)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
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
                border: '1px solid rgba(0,0,0,0.08)',
              }}
            >
              {sources.length}
            </span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: '#111827' }}
        >
          {String(data.label)}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: style.color,
          border: '2px solid #ffffff',
          width: 8,
          height: 8,
          bottom: -4,
        }}
      />
    </div>
  );
}
