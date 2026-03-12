'use client';

import { useEffect, useRef } from 'react';
import { useMapStore, MapNodeData, MapEdgeData } from './useMapStore';
import { Node, Edge } from '@xyflow/react';
import { SystemNode, SystemEdge } from '@/types';

function toSystemNode(n: Node<MapNodeData>): SystemNode {
  return {
    id: n.id,
    label: n.data.label,
    type: n.data.nodeType as SystemNode['type'],
    description: n.data.description,
    sources: n.data.sources,
  };
}

function toSystemEdge(e: Edge<MapEdgeData>): SystemEdge {
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    polarity: e.data?.polarity ?? '+',
    loop_label: e.data?.loop_label,
    description: e.data?.description ?? '',
    sources: e.data?.sources ?? [],
  };
}

export function useAutoSave() {
  const projectId = useMapStore((s) => s.projectId);
  const nodes = useMapStore((s) => s.nodes);
  const edges = useMapStore((s) => s.edges);
  const status = useMapStore((s) => s.status);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!projectId || status !== 'ready') return;

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      try {
        await fetch(`/api/projects/${projectId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodes: nodes.map(toSystemNode),
            edges: edges.map(toSystemEdge),
          }),
        });
      } catch {
        // silent fail — user can retry manually
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, projectId, status]);
}
