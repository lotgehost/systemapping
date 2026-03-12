'use client';

import { EdgeProps, getStraightPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { useMapStore, MapEdge } from '@/hooks/useMapStore';

export default function LabeledEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps<MapEdge>) {
  const selectEdge = useMapStore((s) => s.selectEdge);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const polarity = data?.polarity ?? '+';
  const isPositive = polarity === '+';
  const color = selected
    ? (isPositive ? '#2563eb' : '#dc2626')
    : (isPositive ? '#1d4ed8' : '#b91c1c');

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 2 : 1.5,
          opacity: selected ? 1 : 0.55,
        }}
        markerEnd={`url(#arrow-${isPositive ? 'pos' : 'neg'}${selected ? '-sel' : ''})`}
        onClick={() => selectEdge(id)}
      />
      <EdgeLabelRenderer>
        <div
          onClick={() => selectEdge(id)}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          className="cursor-pointer"
        >
          {/* Polarity badge */}
          <span
            style={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPositive ? '#dbeafe' : '#fee2e2',
              border: `1.5px solid ${isPositive ? '#93c5fd' : '#fca5a5'}`,
              fontSize: 12,
              fontWeight: 800,
              color: isPositive ? '#1d4ed8' : '#b91c1c',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            {isPositive ? '+' : '−'}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
