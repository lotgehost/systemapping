'use client';

import { useState, useRef, useEffect } from 'react';
import { useMapStore, MapNode, MapEdge } from '@/hooks/useMapStore';
import { assignLoopLabels } from '@/lib/openrouter/parser';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  opCount?: number;
}

type MapOp =
  | { type: 'addNode'; node: { id: string; label: string; nodeType: string; description: string } }
  | { type: 'removeNode'; nodeId: string }
  | { type: 'updateNode'; nodeId: string; data: Partial<{ label: string; description: string }> }
  | { type: 'addEdge'; edge: { id: string; source: string; target: string; polarity: '+' | '-'; description: string } }
  | { type: 'removeEdge'; edgeId: string }
  | { type: 'updateEdge'; edgeId: string; data: Partial<{ polarity: '+' | '-'; description: string }> };

function applyOperations(ops: MapOp[]) {
  const store = useMapStore.getState();
  let { nodes, edges } = store;

  console.log('[chat] applyOperations called with', ops.length, 'ops:', JSON.stringify(ops));
  console.log('[chat] current nodes:', nodes.map(n => n.id + ':' + n.data.label));

  for (const op of ops) {
    if (op.type === 'addNode') {
      const n = op.node;
      // Skip if a node with this ID or label already exists
      const alreadyExists = nodes.some(
        (nd) => nd.id === n.id || nd.data.label === n.label
      );
      if (alreadyExists) continue;
      const newNode: MapNode = {
        id: n.id,
        type: n.nodeType as MapNode['type'],
        position: {
          x: (nodes.reduce((s, nd) => s + nd.position.x, 0) / (nodes.length || 1)) + (Math.random() - 0.5) * 200,
          y: (nodes.reduce((s, nd) => s + nd.position.y, 0) / (nodes.length || 1)) + (Math.random() - 0.5) * 200,
        },
        data: { label: n.label, nodeType: n.nodeType, description: n.description, sources: [] },
      };
      nodes = [...nodes, { ...newNode, selected: false }];
    } else if (op.type === 'removeNode') {
      nodes = nodes.filter((n) => n.id !== op.nodeId);
      edges = edges.filter((e) => e.source !== op.nodeId && e.target !== op.nodeId);
    } else if (op.type === 'updateNode') {
      nodes = nodes.map((n) =>
        n.id === op.nodeId ? { ...n, data: { ...n.data, ...op.data } } : n
      );
    } else if (op.type === 'addEdge') {
      const e = op.edge;
      const newEdge: MapEdge = {
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'labeled',
        data: { polarity: e.polarity, description: e.description, sources: [] },
      };
      edges = [...edges, { ...newEdge, selected: false }];
    } else if (op.type === 'removeEdge') {
      edges = edges.filter((e) => e.id !== op.edgeId);
    } else if (op.type === 'updateEdge') {
      edges = edges.map((e) =>
        e.id === op.edgeId ? { ...e, data: { ...e.data, ...op.data } as MapEdge['data'] } : e
      );
    }
  }

  // Recompute loop labels based on updated edges
  const systemEdges = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    polarity: (e.data?.polarity ?? '+') as '+' | '-',
    description: e.data?.description ?? '',
    sources: e.data?.sources ?? [],
  }));
  const relabeled = assignLoopLabels(systemEdges);
  edges = edges.map((e) => {
    const updated = relabeled.find((r) => r.id === e.id);
    return updated
      ? { ...e, data: { ...e.data, loop_label: updated.loop_label } as MapEdge['data'] }
      : e;
  });

  console.log('[chat] after ops, nodes:', nodes.map(n => n.id + ':' + n.data.label));
  useMapStore.setState({ nodes, edges });
  console.log('[chat] setState done, store nodes now:', useMapStore.getState().nodes.map(n => n.id + ':' + n.data.label));
}

export default function ChatPanel() {
  const projectId = useMapStore((s) => s.projectId);
  const storeNodes = useMapStore((s) => s.nodes);
  const storeEdges = useMapStore((s) => s.edges);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (overrideText?: string) => {
    const text = overrideText ?? input;
    if (!text.trim() || loading || !projectId) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const currentNodes = storeNodes.map((n) => ({ id: n.id, label: n.data.label, type: n.data.nodeType }));
      const currentEdges = storeEdges.map((e) => ({ id: e.id, source: e.source, target: e.target, polarity: e.data?.polarity }));
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history, currentNodes, currentEdges }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Chat failed');

      const ops: MapOp[] = data.operations ?? [];
      console.log('[chat] received reply, ops count:', ops.length, 'ops:', JSON.stringify(ops));
      if (ops.length > 0) {
        applyOperations(ops);
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, opCount: ops.length },
      ]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `오류: ${err instanceof Error ? err.message : 'Something went wrong'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2 pt-2">
            {[
              '누락된 피드백 루프가 있나요?',
              '가장 영향력 있는 레버는 무엇인가요?',
              '정신건강 노드를 추가해줘',
            ].map((q) => (
              <button
                key={q}
                onClick={() => send(q)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer border"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed"
              style={
                m.role === 'user'
                  ? { background: '#111827', color: '#ffffff', borderRadius: '12px 12px 2px 12px' }
                  : { background: 'var(--glass-bg-strong)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '12px 12px 12px 2px' }
              }
            >
              {m.content}
            </div>
            {!!m.opCount && m.opCount > 0 && (
              <div className="flex items-center gap-1 mt-1 px-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1.5 5l2.5 2.5 4.5-4.5" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[10px] text-[#059669]">{m.opCount}개 변경사항이 맵에 반영됨</span>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', borderRadius: '12px 12px 12px 2px' }}
            >
              <LoadingSpinner size={12} />
              <span className="text-xs text-[var(--text-muted)]">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[var(--glass-border)] flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
            }}
            placeholder="Ask about this map..."
            rows={2}
            className="flex-1 resize-none text-xs rounded-lg px-3 py-2 outline-none transition-all duration-150"
            style={{ background: 'var(--glass-bg-strong)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)' }}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#111827', color: '#ffffff' }}
          >
            Send
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Enter로 전송 · Shift+Enter 줄바꿈</p>
      </div>
    </div>
  );
}
