'use client';

import { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { color: string; selectedColor: string; loopColor: string; label: string }> = {
  variable:  { color: '#111827', selectedColor: '#2563eb', loopColor: '#1d4ed8', label: '' },
  exogenous: { color: '#6d28d9', selectedColor: '#7c3aed', loopColor: '#7c3aed', label: 'EXT' },
  lever:     { color: '#065f46', selectedColor: '#059669', loopColor: '#059669', label: 'LEV' },
};

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const [hovered, setHovered] = useState(false);
  const selectNode = useMapStore((s) => s.selectNode);
  const selectedLoop = useMapStore((s) => s.selectedLoop);
  const edges = useMapStore((s) => s.edges);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.variable;

  const inSelectedLoop = selectedLoop
    ? edges.some((e) => e.data?.loop_label === selectedLoop && (e.source === id || e.target === id))
    : false;
  const dimmed = selectedLoop && !inSelectedLoop;

  const textColor = selected
    ? style.selectedColor
    : inSelectedLoop
    ? style.loopColor
    : style.color;

  return (
    <div
      onClick={() => selectNode(id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative select-none"
      style={{ minWidth: 60, maxWidth: 130, opacity: dimmed ? 0.1 : 1, transition: 'opacity 0.2s', cursor: hovered ? 'crosshair' : 'pointer' }}
    >
      <Handle type="target" position={Position.Top} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
      <Handle type="source" position={Position.Top}    id="st" />
      <Handle type="source" position={Position.Bottom} id="sb" />
      <Handle type="source" position={Position.Left}   id="sl" />
      <Handle type="source" position={Position.Right}  id="sr" />

      <div className="node-drag-handle flex flex-col items-center text-center cursor-grab active:cursor-grabbing">
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
            color: textColor,
            textDecoration: selected || inSelectedLoop ? 'underline' : 'none',
            textDecorationColor: textColor,
            textUnderlineOffset: '3px',
            fontWeight: inSelectedLoop ? 700 : 600,
            transition: 'color 0.2s',
          }}
        >
          {String(data.label)}
        </span>
      </div>
    </div>
  );
}
