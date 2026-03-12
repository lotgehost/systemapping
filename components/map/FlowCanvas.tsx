'use client';

import { useCallback, useMemo, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  EdgeTypes,
  useViewport,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMapStore } from '@/hooks/useMapStore';
import BaseNode from './nodes/BaseNode';
import LabeledEdge from './edges/LabeledEdge';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: NodeTypes = {
  variable: BaseNode as any,
  lever: BaseNode as any,
  exogenous: BaseNode as any,
  // legacy aliases
  actor: BaseNode as any,
  structural_factor: BaseNode as any,
  outcome: BaseNode as any,
  feedback_loop: BaseNode as any,
  intervention: BaseNode as any,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const edgeTypes: EdgeTypes = {
  labeled: LabeledEdge as any,
};

/** Renders loop label circles (R1/B1 etc.) as overlay using flow→container coords */
function LoopLabelOverlay() {
  const nodes = useMapStore((s) => s.nodes);
  const edges = useMapStore((s) => s.edges);
  const { x: vpX, y: vpY, zoom } = useViewport();

  const loopLabels = useMemo(() => {
    const seen = new Set<string>();
    const result: { label: string; x: number; y: number; isReinforcing: boolean }[] = [];

    for (const edge of edges) {
      const loopLabel = edge.data?.loop_label;
      if (!loopLabel || seen.has(String(loopLabel))) continue;
      seen.add(String(loopLabel));

      const participants = new Set<string>();
      for (const e of edges) {
        if (e.data?.loop_label === loopLabel) {
          participants.add(e.source);
          participants.add(e.target);
        }
      }

      const pts = Array.from(participants)
        .map((nid) => nodes.find((n) => n.id === nid))
        .filter(Boolean);
      if (pts.length === 0) continue;

      const cx = pts.reduce((s, n) => s + (n!.position.x + 80), 0) / pts.length;
      const cy = pts.reduce((s, n) => s + (n!.position.y + 20), 0) / pts.length;

      result.push({ label: String(loopLabel), x: cx, y: cy, isReinforcing: String(loopLabel).startsWith('R') });
    }
    return result;
  }, [nodes, edges]);

  return (
    <>
      {loopLabels.map(({ label, x, y, isReinforcing }) => {
        const px = x * zoom + vpX;
        const py = y * zoom + vpY;
        const color = isReinforcing ? '#dc2626' : '#059669';
        const markerId = `loop-ah-${label}`;
        // 300° arc: center (22,22) radius 15
        // Bottom-left (120°): (14.5, 35) — Bottom-right (60°): (29.5, 35)
        // R (reinforcing): clockwise sweep=1 going up and over the top
        // B (balancing): counter-clockwise sweep=0
        const arcPath = isReinforcing
          ? 'M 14.5,35 A 15,15 0 1,1 29.5,35'
          : 'M 29.5,35 A 15,15 0 1,0 14.5,35';
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              transform: 'translate(-50%, -50%)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          >
            <svg width="44" height="44" viewBox="0 0 44 44">
              <defs>
                <marker
                  id={markerId}
                  markerWidth="7"
                  markerHeight="7"
                  refX="6"
                  refY="3.5"
                  orient="auto"
                  markerUnits="userSpaceOnUse"
                >
                  <path d="M0,0 L7,3.5 L0,7 Z" fill={color} />
                </marker>
              </defs>
              {/* Smooth arc with auto-oriented arrowhead */}
              <path
                d={arcPath}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd={`url(#${markerId})`}
              />
              {/* Label centered inside arc */}
              <text
                x="22"
                y="23"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontWeight="800"
                fill={color}
                style={{ fontFamily: 'var(--font-heading)', userSelect: 'none' }}
              >
                {label}
              </text>
            </svg>
          </div>
        );
      })}
    </>
  );
}

function FlowInner({ readOnly }: { readOnly: boolean }) {
  const nodes = useMapStore((s) => s.nodes);
  const edges = useMapStore((s) => s.edges);
  const onNodesChange = useMapStore((s) => s.onNodesChange);
  const onEdgesChange = useMapStore((s) => s.onEdgesChange);
  const onConnect = useMapStore((s) => s.onConnect);
  const selectNode = useMapStore((s) => s.selectNode);
  const selectEdge = useMapStore((s) => s.selectEdge);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  return (
    <div ref={containerRef} className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : onNodesChange}
        onEdgesChange={readOnly ? undefined : onEdgesChange}
        onConnect={readOnly ? undefined : onConnect}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        deleteKeyCode={readOnly ? null : 'Backspace'}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-primary)' }}
      >
        <Background variant={BackgroundVariant.Dots} gap={32} size={1} color="rgba(0,0,0,0.07)" />
        <Controls position="bottom-left" showInteractive={false} />
        <MiniMap position="bottom-right" nodeColor="rgba(0,0,0,0.12)" maskColor="rgba(255,255,255,0.55)" />
      </ReactFlow>
      {/* Loop label overlay — rendered inside ReactFlowProvider to access useViewport */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <LoopLabelOverlay />
      </div>
    </div>
  );
}

export default function FlowCanvas({ readOnly = false }: { readOnly?: boolean }) {
  return (
    <ReactFlowProvider>
      <FlowInner readOnly={readOnly} />
    </ReactFlowProvider>
  );
}
