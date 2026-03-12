'use client';

import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
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

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.35,
  });

  const polarity = data?.polarity ?? '+';
  const isPositive = polarity === '+';

  // Edge color: thin, dark, subtle
  const strokeColor = selected ? '#1d4ed8' : 'rgba(30,30,30,0.35)';

  // Polarity sign positioned near the arrowhead (80% toward target)
  const px = sourceX * 0.25 + targetX * 0.75;
  const py = sourceY * 0.25 + targetY * 0.75;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: strokeColor,
          strokeWidth: selected ? 1.5 : 1,
          fill: 'none',
        }}
        markerEnd="url(#cld-arrow)"
        onClick={() => selectEdge(id)}
      />
      <EdgeLabelRenderer>
        <span
          onClick={() => selectEdge(id)}
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${px}px,${py}px)`,
            pointerEvents: 'all',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: 1,
            color: isPositive ? '#1d4ed8' : '#dc2626',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {isPositive ? '+' : '−'}
        </span>
      </EdgeLabelRenderer>
    </>
  );
}
