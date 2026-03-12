'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { color: string; selectedColor: string; label: string }> = {
  variable:  { color: '#1d3461', selectedColor: '#2563eb', label: '' },
  exogenous: { color: '#7c3aed', selectedColor: '#9333ea', label: 'EXT' },
  lever:     { color: '#065f46', selectedColor: '#059669', label: 'LEV' },
};

const handleStyle = {
  background: 'transparent',
  border: 'none',
  width: 8,
  height: 8,
};

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative cursor-pointer"
      style={{ minWidth: 80, maxWidth: 160 }}
    >
      {/* 4-directional handles so straight edges always find the closest port */}
      <Handle type="target" position={Position.Top}    style={{ ...handleStyle, top: -4, left: '50%' }} />
      <Handle type="target" position={Position.Bottom} style={{ ...handleStyle, bottom: -4, left: '50%' }} />
      <Handle type="target" position={Position.Left}   style={{ ...handleStyle, left: -4, top: '50%' }} />
      <Handle type="target" position={Position.Right}  style={{ ...handleStyle, right: -4, top: '50%' }} />
      <Handle type="source" position={Position.Top}    style={{ ...handleStyle, top: -4, left: '50%' }} />
      <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: -4, left: '50%' }} />
      <Handle type="source" position={Position.Left}   style={{ ...handleStyle, left: -4, top: '50%' }} />
      <Handle type="source" position={Position.Right}  style={{ ...handleStyle, right: -4, top: '50%' }} />

      <div
        className="flex flex-col items-center text-center px-1 py-0.5 select-none"
        style={{ background: 'transparent' }}
      >
        {style.label && (
          <span
            className="text-[8px] font-bold tracking-widest uppercase mb-0.5"
            style={{ color: style.color, opacity: 0.7 }}
          >
            {style.label}
          </span>
        )}
        <span
          className="text-[13px] font-semibold leading-snug whitespace-pre-wrap"
          style={{
            color: selected ? style.selectedColor : style.color,
            textShadow: '0 1px 2px rgba(255,255,255,0.9)',
            borderBottom: selected ? `1.5px solid ${style.selectedColor}` : '1.5px solid transparent',
            transition: 'all 0.15s',
          }}
        >
          {String(data.label)}
        </span>
      </div>
    </div>
  );
}
