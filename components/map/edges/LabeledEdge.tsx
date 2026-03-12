'use client';

import { EdgeProps, getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
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

  // getSmoothStepPath auto-selects the nearest side handle and routes cleanly
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 40,
  });

  const polarity = data?.polarity ?? '+';
  const isPositive = polarity === '+';
  const color = selected
    ? (isPositive ? '#2563eb' : '#dc2626')
    : (isPositive ? '#374151' : '#9ca3af');

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: color,
          strokeWidth: selected ? 2 : 1.5,
          opacity: selected ? 1 : 0.45,
        }}
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
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: isPositive ? '#dbeafe' : '#fee2e2',
              border: `1.5px solid ${isPositive ? '#93c5fd' : '#fca5a5'}`,
              fontSize: 11,
              fontWeight: 800,
              color: isPositive ? '#1d4ed8' : '#b91c1c',
              lineHeight: 1,
            }}
          >
            {isPositive ? '+' : '−'}
          </span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
