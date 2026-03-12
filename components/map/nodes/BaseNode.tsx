'use client';

import { Handle, Position, NodeProps } from '@xyflow/react';
import { useMapStore, MapNode } from '@/hooks/useMapStore';

const NODE_STYLES: Record<string, { label: string; dot: string; borderSelected: string }> = {
  actor:             { label: '행위자',    dot: 'rgba(255,255,255,0.85)', borderSelected: 'rgba(255,255,255,0.5)' },
  structural_factor: { label: '구조 요인', dot: 'rgba(200,200,200,0.7)',  borderSelected: 'rgba(200,200,200,0.4)' },
  outcome:           { label: '결과',      dot: 'rgba(160,160,160,0.6)',  borderSelected: 'rgba(160,160,160,0.35)' },
  feedback_loop:     { label: '피드백',    dot: 'rgba(120,120,120,0.6)',  borderSelected: 'rgba(140,140,140,0.35)' },
  intervention:      { label: '개입',      dot: 'rgba(255,255,255,0.35)', borderSelected: 'rgba(255,255,255,0.25)' },
};

export default function BaseNode({ id, data, selected }: NodeProps<MapNode>) {
  const selectNode = useMapStore((s) => s.selectNode);
  const style = NODE_STYLES[String(data.nodeType)] ?? NODE_STYLES.actor;
  const sources = Array.isArray(data.sources) ? data.sources : [];

  return (
    <div
      onClick={() => selectNode(id)}
      className="relative"
      style={{ minWidth: 160, maxWidth: 210 }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: 6,
          height: 6,
          top: -3,
        }}
      />

      <div
        className="rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
        style={{
          background: selected
            ? 'rgba(255,255,255,0.07)'
            : 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: `1px solid ${selected ? style.borderSelected : 'rgba(255,255,255,0.07)'}`,
          boxShadow: selected
            ? `0 0 0 1px ${style.borderSelected}, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)`
            : '0 2px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          transform: selected ? 'translateY(-1px)' : 'translateY(0)',
        }}
      >
        {/* Type badge row */}
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: style.dot }}
            />
            <span
              className="text-[9px] font-medium tracking-widest uppercase"
              style={{ color: style.dot }}
            >
              {style.label}
            </span>
          </div>
          {sources.length > 0 && (
            <span
              className="text-[9px] tabular-nums rounded-full px-1.5 py-0.5"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'rgba(255,255,255,0.25)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {sources.length}
            </span>
          )}
        </div>

        {/* Label */}
        <p
          className="text-sm font-medium leading-snug"
          style={{ color: 'rgba(255,255,255,0.88)' }}
        >
          {String(data.label)}
        </p>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.1)',
          width: 6,
          height: 6,
          bottom: -3,
        }}
      />
    </div>
  );
}
