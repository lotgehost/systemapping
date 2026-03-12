'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { color: string; selectedColor: string; bg: string; bgSelected: string; label: string }> = {
  variable:  { color: '#1d3461', selectedColor: '#2563eb', bg: 'rgba(29,52,97,0.07)',    bgSelected: 'rgba(37,99,235,0.12)',   label: '' },
  exogenous: { color: '#6d28d9', selectedColor: '#7c3aed', bg: 'rgba(109,40,217,0.07)', bgSelected: 'rgba(124,58,237,0.12)', label: 'EXT' },
  lever:     { color: '#065f46', selectedColor: '#059669', bg: 'rgba(6,95,70,0.07)',     bgSelected: 'rgba(5,150,105,0.12)',  label: 'LEV' },
};

const handleStyle = { background: 'transparent', border: 'none', width: 8, height: 8 };

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative cursor-pointer"
      style={{ minWidth: 72, maxWidth: 150 }}
    >
      {/* 4-directional handles — getSmoothStepPath picks the best port automatically */}
      <Handle type="target" position={Position.Top}    style={{ ...handleStyle, top: -4,    left: '50%' }} />
      <Handle type="target" position={Position.Bottom} style={{ ...handleStyle, bottom: -4, left: '50%' }} />
      <Handle type="target" position={Position.Left}   style={{ ...handleStyle, left: -4,   top: '50%' }} />
      <Handle type="target" position={Position.Right}  style={{ ...handleStyle, right: -4,  top: '50%' }} />
      <Handle type="source" position={Position.Top}    style={{ ...handleStyle, top: -4,    left: '50%' }} />
      <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, bottom: -4, left: '50%' }} />
      <Handle type="source" position={Position.Left}   style={{ ...handleStyle, left: -4,   top: '50%' }} />
      <Handle type="source" position={Position.Right}  style={{ ...handleStyle, right: -4,  top: '50%' }} />

      <div
        className="flex flex-col items-center text-center select-none px-3 py-1.5 transition-all duration-150"
        style={{
          background: selected ? style.bgSelected : style.bg,
          borderRadius: 999,
          border: `1.5px solid ${selected ? style.selectedColor + '55' : style.color + '22'}`,
          boxShadow: selected ? `0 0 0 3px ${style.selectedColor}18` : 'none',
        }}
      >
        {style.label && (
          <span
            className="text-[8px] font-bold tracking-widest uppercase leading-none mb-0.5"
            style={{ color: style.color, opacity: 0.65 }}
          >
            {style.label}
          </span>
        )}
        <span
          className="text-[12px] font-semibold leading-snug"
          style={{
            color: selected ? style.selectedColor : style.color,
            textShadow: '0 1px 2px rgba(255,255,255,0.8)',
          }}
        >
          {String(data.label)}
        </span>
      </div>
    </div>
  );
}
