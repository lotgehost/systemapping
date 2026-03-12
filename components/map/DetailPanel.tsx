'use client';

import { useMapStore } from '@/hooks/useMapStore';
import SourceBadge from './SourceBadge';
import GlassInput from '@/components/ui/GlassInput';

const NODE_TYPE_LABELS: Record<string, string> = {
  variable:  '변수',
  exogenous: '외생변수',
  lever:     '정책 레버',
};

const NODE_TYPE_DOTS: Record<string, string> = {
  variable:  '#2563eb',
  exogenous: '#7c3aed',
  lever:     '#059669',
};

export default function DetailPanel() {
  const selectedNodeId = useMapStore((s) => s.selectedNodeId);
  const selectedEdgeId = useMapStore((s) => s.selectedEdgeId);
  const nodes = useMapStore((s) => s.nodes);
  const edges = useMapStore((s) => s.edges);
  const updateNodeData = useMapStore((s) => s.updateNodeData);
  const updateEdgeData = useMapStore((s) => s.updateEdgeData);
  const selectNode = useMapStore((s) => s.selectNode);
  const selectEdge = useMapStore((s) => s.selectEdge);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge) return null;

  const close = () => { selectNode(null); selectEdge(null); };

  const nodeType = selectedNode?.data.nodeType as string;
  const dotColor = NODE_TYPE_DOTS[nodeType] ?? 'rgba(255,255,255,0.5)';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[var(--glass-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedNode && (
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dotColor }}
            />
          )}
          <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">
            {selectedNode
              ? NODE_TYPE_LABELS[nodeType] ?? nodeType
              : '관계'}
          </span>
        </div>
        <button
          onClick={close}
          className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all duration-150 cursor-pointer text-base leading-none"
        >
          ×
        </button>
      </div>

      {/* Scrollable fields */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {selectedNode && (
          <>
            <Field label="이름">
              <GlassInput
                value={selectedNode.data.label}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, { label: (e.target as HTMLInputElement).value })
                }
              />
            </Field>

            <Field label="설명">
              <GlassInput
                multiline
                rows={5}
                value={selectedNode.data.description}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, { description: e.target.value })
                }
              />
            </Field>

            {selectedNode.data.sources.length > 0 && (
              <Field label="출처">
                <div className="space-y-2">
                  {selectedNode.data.sources.map((s, i) => (
                    <SourceBadge key={i} source={s} />
                  ))}
                </div>
              </Field>
            )}
          </>
        )}

        {selectedEdge && (
          <>
            <Field label="인과 극성">
              <div className="flex gap-2">
                {(['+', '-'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateEdgeData(selectedEdge.id, { polarity: p })}
                    className="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer border"
                    style={{
                      background: selectedEdge.data?.polarity === p
                        ? (p === '+' ? '#dbeafe' : '#fee2e2')
                        : 'transparent',
                      color: p === '+' ? '#1d4ed8' : '#b91c1c',
                      borderColor: selectedEdge.data?.polarity === p
                        ? (p === '+' ? '#93c5fd' : '#fca5a5')
                        : 'var(--glass-border)',
                    }}
                  >
                    {p === '+' ? '+ 양(+)의 인과' : '− 음(−)의 인과'}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="피드백 루프 레이블 (선택)">
              <GlassInput
                placeholder="예: R1, B1, R2"
                value={selectedEdge.data?.loop_label ?? ''}
                onChange={(e) =>
                  updateEdgeData(selectedEdge.id, { loop_label: (e.target as HTMLInputElement).value || undefined })
                }
              />
            </Field>

            <Field label="설명">
              <GlassInput
                multiline
                rows={5}
                value={selectedEdge.data?.description ?? ''}
                onChange={(e) =>
                  updateEdgeData(selectedEdge.id, { description: e.target.value })
                }
              />
            </Field>

            {(selectedEdge.data?.sources ?? []).length > 0 && (
              <Field label="출처">
                <div className="space-y-2">
                  {(selectedEdge.data?.sources ?? []).map((s, i) => (
                    <SourceBadge key={i} source={s} />
                  ))}
                </div>
              </Field>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--glass-border)]">
        <button
          onClick={close}
          className="w-full text-xs py-2 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--glass-hover)] transition-all duration-150 cursor-pointer border border-transparent hover:border-[var(--glass-border)]"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
