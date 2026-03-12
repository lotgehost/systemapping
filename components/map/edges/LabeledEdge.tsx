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

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const relationType = data?.relation_type ? String(data.relation_type) : '';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)',
          strokeWidth: selected ? 1.5 : 1,
        }}
        onClick={() => selectEdge(id)}
      />
      {relationType && (
        <EdgeLabelRenderer>
          <div
            onClick={() => selectEdge(id)}
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="cursor-pointer"
          >
            <span className="glass rounded-full px-2 py-0.5 text-[10px] text-[var(--text-muted)] whitespace-nowrap">
              {relationType}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
