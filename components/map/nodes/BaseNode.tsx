'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { color: string; selectedColor: string; label: string }> = {
  variable:  { color: '#1d3461', selectedColor: '#2563eb', label: '' },
  exogenous: { color: '#7c3aed', selectedColor: '#9333ea', label: 'EXT' },
  lever:     { color: '#065f46', selectedColor: '#059669', label: 'LEV' },
};

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;
  const isSelected = selected;

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative cursor-pointer"
      style={{ minWidth: 80, maxWidth: 160 }}
    >
      {/* Invisible handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: 'transparent', border: 'none', width: 6, height: 6, top: -3 }}
      />

      <div
        className="flex flex-col items-center text-center px-1 py-0.5 select-none"
        style={{
          background: 'transparent',
        }}
      >
        {/* Type label for non-variable nodes */}
        {style.label && (
          <span
            className="text-[8px] font-bold tracking-widest uppercase mb-0.5"
            style={{ color: style.color, opacity: 0.7 }}
          >
            {style.label}
          </span>
        )}

        {/* Main label */}
        <span
          className="text-[13px] font-semibold leading-snug whitespace-pre-wrap"
          style={{
            color: isSelected ? style.selectedColor : style.color,
            textShadow: '0 1px 2px rgba(255,255,255,0.9)',
            borderBottom: isSelected ? `1.5px solid ${style.selectedColor}` : '1.5px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          {String(data.label)}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: 'transparent', border: 'none', width: 6, height: 6, bottom: -3 }}
      />
    </div>
  );
}
