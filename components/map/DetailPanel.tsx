'use client';

import { useMapStore, MapEdge, MapNode } from '@/hooks/useMapStore';
import SourceBadge from './SourceBadge';
import GlassInput from '@/components/ui/GlassInput';

const NODE_TYPE_LABELS: Record<string, string> = {
  variable:  'Variable',
  exogenous: 'External',
  lever:     'Lever',
};

const NODE_TYPE_DOTS: Record<string, string> = {
  variable:  '#2563eb',
  exogenous: '#7c3aed',
  lever:     '#059669',
};

/** Trace an ordered path through loop edges: returns path + whether it closes back to start */
function traceLoopPath(loopEdges: MapEdge[]): { path: { nodeId: string; edge: MapEdge | null }[]; closed: boolean } {
  if (loopEdges.length === 0) return { path: [], closed: false };

  const adj = new Map<string, MapEdge>();
  for (const e of loopEdges) adj.set(e.source, e);

  const startId = loopEdges[0].source;
  const path: { nodeId: string; edge: MapEdge | null }[] = [];
  const visited = new Set<string>();
  let cur = startId;
  let closed = false;

  while (!visited.has(cur)) {
    visited.add(cur);
    const out = adj.get(cur) ?? null;
    path.push({ nodeId: cur, edge: out });
    if (!out) break;
    cur = out.target;
    if (cur === startId) { closed = true; break; }
  }
  return { path, closed };
}

export default function DetailPanel() {
  const selectedNodeId = useMapStore((s) => s.selectedNodeId);
  const selectedEdgeId = useMapStore((s) => s.selectedEdgeId);
  const selectedLoop   = useMapStore((s) => s.selectedLoop);
  const nodes = useMapStore((s) => s.nodes);
  const edges = useMapStore((s) => s.edges);
  const updateNodeData = useMapStore((s) => s.updateNodeData);
  const updateEdgeData = useMapStore((s) => s.updateEdgeData);
  const selectNode = useMapStore((s) => s.selectNode);
  const selectEdge = useMapStore((s) => s.selectEdge);
  const selectLoop = useMapStore((s) => s.selectLoop);

  const selectedNode = selectedNodeId ? nodes.find((n) => n.id === selectedNodeId) : null;
  const selectedEdge = selectedEdgeId ? edges.find((e) => e.id === selectedEdgeId) : null;

  if (!selectedNode && !selectedEdge && !selectedLoop) return null;

  const close = () => { selectNode(null); selectEdge(null); selectLoop(null); };

  // ── Loop panel ─────────────────────────────────────────────────────────────
  if (selectedLoop && !selectedNode && !selectedEdge) {
    const isReinforcing = selectedLoop.startsWith('R');
    const color = isReinforcing ? '#dc2626' : '#059669';
    const loopEdges = edges.filter((e) => e.data?.loop_label === selectedLoop);
    const { path, closed } = traceLoopPath(loopEdges);
    const nodeMap = new Map<string, MapNode>(nodes.map((n) => [n.id, n]));

    // Count negative polarities to describe behavior
    const negCount = loopEdges.filter((e) => e.data?.polarity === '-').length;

    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-5 border-b border-[var(--glass-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 44 44">
              <path
                d={isReinforcing ? 'M 14.5,35 A 15,15 0 1,1 29.5,35' : 'M 29.5,35 A 15,15 0 1,0 14.5,35'}
                fill="none"
                stroke={color}
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-[10px] font-medium tracking-widest uppercase" style={{ color }}>
              {selectedLoop} — {isReinforcing ? '강화 루프' : '균형 루프'}
            </span>
          </div>
          <button
            onClick={close}
            className="w-6 h-6 flex items-center justify-center rounded-md text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-hover)] transition-all duration-150 cursor-pointer text-base leading-none"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Loop type description */}
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {isReinforcing
              ? `음의 관계 ${negCount}개 (짝수) — 변화가 같은 방향으로 증폭됩니다.`
              : `음의 관계 ${negCount}개 (홀수) — 변화가 반대 방향으로 상쇄됩니다.`}
          </p>

          {/* Cycle path */}
          {path.length > 0 && (
            <div>
              <label className="block text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mb-3">
                순환 경로
              </label>
              <div className="space-y-0">
                {path.map(({ nodeId, edge }, i) => {
                  const node = nodeMap.get(nodeId);
                  const polarity = edge?.data?.polarity ?? null;
                  const isPos = polarity === '+';
                  return (
                    <div key={i}>
                      {/* Node */}
                      <button
                        onClick={() => selectNode(nodeId)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-[var(--glass-hover)] transition-colors cursor-pointer"
                      >
                        <span className="text-[13px] font-semibold text-[var(--text-primary)]">
                          {node?.data.label ?? nodeId}
                        </span>
                        {node?.data.description && (
                          <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-snug line-clamp-2">
                            {node.data.description}
                          </p>
                        )}
                      </button>
                      {/* Arrow to next */}
                      {edge && (
                        <div className="flex items-center gap-1.5 px-4 py-0.5">
                          <span
                            className="text-[11px] font-bold"
                            style={{ color: isPos ? '#1d4ed8' : '#dc2626' }}
                          >
                            {isPos ? '+' : '−'}
                          </span>
                          <svg width="60" height="12" viewBox="0 0 60 12">
                            <line x1="0" y1="6" x2="52" y2="6" stroke={isPos ? '#1d4ed8' : '#dc2626'} strokeWidth="1.5" />
                            <path d="M52,3 L60,6 L52,9 Z" fill={isPos ? '#1d4ed8' : '#dc2626'} />
                          </svg>
                          {edge.data?.description && (
                            <span className="text-[10px] text-[var(--text-muted)] leading-snug line-clamp-1 flex-1">
                              {edge.data.description}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {/* Cycle closed indicator */}
                {closed && path.length > 0 && (
                  <div className="flex items-center gap-1.5 px-4 py-1 opacity-50">
                    <svg width="10" height="10" viewBox="0 0 10 10">
                      <path d="M5,0 A5,5 0 1,1 0,5" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M0,2 L2,6 L4,2 Z" fill={color}/>
                    </svg>
                    <span className="text-[10px]" style={{ color }}>순환</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    );
  }

  // ── Node / Edge panel ──────────────────────────────────────────────────────
  const nodeType = selectedNode?.data.nodeType as string;
  const dotColor = NODE_TYPE_DOTS[nodeType] ?? 'rgba(0,0,0,0.3)';

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-5 border-b border-[var(--glass-border)] flex items-center justify-between">
        <div className="flex items-center gap-2">
          {selectedNode && (
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
          )}
          <span className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)]">
            {selectedNode ? NODE_TYPE_LABELS[nodeType] ?? nodeType : 'Edge'}
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
            <Field label="Name">
              <GlassInput
                value={selectedNode.data.label}
                onChange={(e) =>
                  updateNodeData(selectedNode.id, { label: (e.target as HTMLInputElement).value })
                }
              />
            </Field>
            <Field label="Description">
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
              <Field label="Sources">
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
            <Field label="Polarity">
              <div className="flex gap-2">
                {(['+', '-'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => updateEdgeData(selectedEdge.id, { polarity: p })}
                    className="flex-1 py-1.5 rounded-lg text-sm font-bold transition-all duration-150 cursor-pointer border"
                    style={{
                      background: selectedEdge.data?.polarity === p
                        ? (p === '+' ? '#dbeafe' : '#fee2e2') : 'transparent',
                      color: p === '+' ? '#1d4ed8' : '#b91c1c',
                      borderColor: selectedEdge.data?.polarity === p
                        ? (p === '+' ? '#93c5fd' : '#fca5a5') : 'var(--glass-border)',
                    }}
                  >
                    {p === '+' ? '+ Positive' : '− Negative'}
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Loop label (optional)">
              <GlassInput
                placeholder="e.g. R1, B1, R2"
                value={selectedEdge.data?.loop_label ?? ''}
                onChange={(e) =>
                  updateEdgeData(selectedEdge.id, { loop_label: (e.target as HTMLInputElement).value || undefined })
                }
              />
            </Field>
            <Field label="Description">
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
              <Field label="Sources">
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
