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

  const polarity = data?.polarity ?? '+';
  const loopLabel = data?.loop_label ? String(data.loop_label) : '';
  const isPositive = polarity === '+';

  const polarityStyle = isPositive
    ? { bg: '#dbeafe', text: '#1d4ed8', border: '#bfdbfe' }
    : { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };

  const loopStyle = loopLabel.startsWith('R')
    ? { bg: '#fef9c3', text: '#854d0e', border: '#fde68a' }
    : { bg: '#dcfce7', text: '#166534', border: '#bbf7d0' };

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: selected
            ? (isPositive ? '#2563eb' : '#dc2626')
            : 'rgba(0,0,0,0.2)',
          strokeWidth: selected ? 2 : 1.5,
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
            gap: 3,
          }}
          className="cursor-pointer"
        >
          <span
            style={{
              background: polarityStyle.bg,
              color: polarityStyle.text,
              border: `1px solid ${polarityStyle.border}`,
              borderRadius: '999px',
              padding: '1px 6px',
              fontSize: 11,
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          >
            {isPositive ? '+' : '−'}
          </span>
          {loopLabel && (
            <span
              style={{
                background: loopStyle.bg,
                color: loopStyle.text,
                border: `1px solid ${loopStyle.border}`,
                borderRadius: '999px',
                padding: '1px 5px',
                fontSize: 9,
                fontWeight: 600,
                lineHeight: 1.6,
              }}
            >
              {loopLabel}
            </span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
