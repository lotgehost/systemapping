'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { color: string; selectedColor: string; label: string }> = {
  variable:  { color: '#111827', selectedColor: '#2563eb', label: '' },
  exogenous: { color: '#6d28d9', selectedColor: '#7c3aed', label: 'EXT' },
  lever:     { color: '#065f46', selectedColor: '#059669', label: 'LEV' },
};

const h = { background: 'transparent', border: 'none', width: 1, height: 1, minWidth: 0, minHeight: 0 };

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative cursor-pointer select-none"
      style={{ minWidth: 60, maxWidth: 130 }}
    >
      <Handle type="target" position={Position.Top}    style={{ ...h, top: '50%',    left: '50%' }} />
      <Handle type="target" position={Position.Bottom} style={{ ...h, bottom: '50%', left: '50%' }} />
      <Handle type="target" position={Position.Left}   style={{ ...h, left: '50%',   top: '50%' }} />
      <Handle type="target" position={Position.Right}  style={{ ...h, right: '50%',  top: '50%' }} />
      <Handle type="source" position={Position.Top}    style={{ ...h, top: '50%',    left: '50%' }} />
      <Handle type="source" position={Position.Bottom} style={{ ...h, bottom: '50%', left: '50%' }} />
      <Handle type="source" position={Position.Left}   style={{ ...h, left: '50%',   top: '50%' }} />
      <Handle type="source" position={Position.Right}  style={{ ...h, right: '50%',  top: '50%' }} />

      <div className="flex flex-col items-center text-center">
        {style.label && (
          <span
            className="text-[8px] font-semibold tracking-widest uppercase leading-none mb-0.5"
            style={{ color: style.color, opacity: 0.55 }}
          >
            {style.label}
          </span>
        )}
        <span
          className="text-[13px] font-semibold leading-snug text-center"
          style={{
            color: selected ? style.selectedColor : style.color,
            textDecoration: selected ? 'underline' : 'none',
            textDecorationColor: style.selectedColor,
            textUnderlineOffset: '3px',
          }}
        >
          {String(data.label)}
        </span>
      </div>
    </div>
  );
}
