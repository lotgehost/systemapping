'use client';

import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Position } from '@xyflow/react';
import { useMapStore, MapEdge } from '@/hooks/useMapStore';

// Estimated node half-dimensions (text-only pill nodes)
const HW = 58; // half-width
const HH = 16; // half-height

function computeEndpoints(
  srcX: number, srcY: number, // source node CENTER
  tgtX: number, tgtY: number, // target node CENTER
) {
  const dx = tgtX - srcX;
  const dy = tgtY - srcY;
  const isHorizontal = Math.abs(dx) >= Math.abs(dy);

  // Angle-based offset keeps multiple edges on the same side from stacking
  if (isHorizontal) {
    // Source exits right or left; distribute vertically by angle
    const offsetY = Math.sign(dy) * Math.min(Math.abs(dy) * 0.25, HH * 0.85);
    return dx > 0
      ? { sx: srcX + HW, sy: srcY + offsetY, sp: Position.Right, tx: tgtX - HW, ty: tgtY - offsetY, tp: Position.Left }
      : { sx: srcX - HW, sy: srcY + offsetY, sp: Position.Left,  tx: tgtX + HW, ty: tgtY - offsetY, tp: Position.Right };
  } else {
    // Source exits top or bottom; distribute horizontally by angle
    const offsetX = Math.sign(dx) * Math.min(Math.abs(dx) * 0.25, HW * 0.85);
    return dy > 0
      ? { sx: srcX + offsetX, sy: srcY + HH, sp: Position.Bottom, tx: tgtX - offsetX, ty: tgtY - HH, tp: Position.Top }
      : { sx: srcX + offsetX, sy: srcY - HH, sp: Position.Top,    tx: tgtX - offsetX, ty: tgtY + HH, tp: Position.Bottom };
  }
}

export default function LabeledEdge({
  id,
  source,
  target,
  data,
  selected,
}: EdgeProps<MapEdge>) {
  const selectEdge = useMapStore((s) => s.selectEdge);
  const nodes = useMapStore((s) => s.nodes);

  const srcNode = nodes.find((n) => n.id === source);
  const tgtNode = nodes.find((n) => n.id === target);

  const polarity = data?.polarity ?? '+';
  const isPositive = polarity === '+';
  const strokeColor = selected ? '#1d4ed8' : 'rgba(30,30,30,0.6)';

  // Fallback: shouldn't happen but avoids crash
  if (!srcNode || !tgtNode) return null;

  const srcCX = srcNode.position.x + HW;
  const srcCY = srcNode.position.y + HH;
  const tgtCX = tgtNode.position.x + HW;
  const tgtCY = tgtNode.position.y + HH;

  const { sx, sy, sp, tx, ty, tp } = computeEndpoints(srcCX, srcCY, tgtCX, tgtCY);

  const [edgePath] = getBezierPath({
    sourceX: sx, sourceY: sy, sourcePosition: sp,
    targetX: tx, targetY: ty, targetPosition: tp,
    curvature: 0.35,
  });

  // Polarity sign: 75% of the way toward target along the straight line
  const px = sx * 0.3 + tx * 0.7;
  const py = sy * 0.3 + ty * 0.7;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{ stroke: strokeColor, strokeWidth: selected ? 2 : 1.2, fill: 'none' }}
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
            fontSize: 12,
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
