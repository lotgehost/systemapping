'use client';

import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Position, useInternalNode } from '@xyflow/react';
import { useMapStore, MapEdge } from '@/hooks/useMapStore';

/** Returns the exact center of the closest side of the source node pointing toward target,
 *  and the matching entry side center on the target node. */
function getSideCenter(
  srcX: number, srcY: number, srcW: number, srcH: number,
  tgtX: number, tgtY: number, tgtW: number, tgtH: number,
) {
  // Centers of each node
  const scx = srcX + srcW / 2;
  const scy = srcY + srcH / 2;
  const tcx = tgtX + tgtW / 2;
  const tcy = tgtY + tgtH / 2;

  const dx = tcx - scx;
  const dy = tcy - scy;

  if (Math.abs(dx) >= Math.abs(dy)) {
    // Horizontal dominant → exit right or left
    return dx >= 0
      ? { sx: srcX + srcW, sy: scy, sp: Position.Right, tx: tgtX,        ty: tcy, tp: Position.Left  }
      : { sx: srcX,        sy: scy, sp: Position.Left,  tx: tgtX + tgtW, ty: tcy, tp: Position.Right };
  } else {
    // Vertical dominant → exit bottom or top
    return dy >= 0
      ? { sx: scx, sy: srcY + srcH, sp: Position.Bottom, tx: tcx, ty: tgtY,        tp: Position.Top    }
      : { sx: scx, sy: srcY,        sp: Position.Top,    tx: tcx, ty: tgtY + tgtH, tp: Position.Bottom };
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

  // Get actual measured positions from React Flow internals
  const srcInternal = useInternalNode(source);
  const tgtInternal = useInternalNode(target);

  const polarity = data?.polarity ?? '+';
  const isPositive = polarity === '+';
  const strokeColor = selected ? '#1d4ed8' : 'rgba(30,30,30,0.6)';

  if (!srcInternal || !tgtInternal) return null;

  const srcAbs = srcInternal.internals.positionAbsolute;
  const srcW   = srcInternal.measured?.width  ?? 100;
  const srcH   = srcInternal.measured?.height ?? 30;
  const tgtAbs = tgtInternal.internals.positionAbsolute;
  const tgtW   = tgtInternal.measured?.width  ?? 100;
  const tgtH   = tgtInternal.measured?.height ?? 30;

  const { sx, sy, sp, tx, ty, tp } = getSideCenter(
    srcAbs.x, srcAbs.y, srcW, srcH,
    tgtAbs.x, tgtAbs.y, tgtW, tgtH,
  );

  const [edgePath] = getBezierPath({
    sourceX: sx, sourceY: sy, sourcePosition: sp,
    targetX: tx, targetY: ty, targetPosition: tp,
    curvature: 0.35,
  });

  // +/− label: right at the arrowhead (8px back from target along the straight line)
  const dist = Math.sqrt((tx - sx) ** 2 + (ty - sy) ** 2) || 1;
  const ux = (sx - tx) / dist;
  const uy = (sy - ty) / dist;
  const px = tx + ux * 14;
  const py = ty + uy * 14;

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
