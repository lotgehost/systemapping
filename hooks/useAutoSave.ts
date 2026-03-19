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
  const pendingRef = useRef<{ nodes: typeof nodes; edges: typeof edges; projectId: string } | null>(null);

  const save = (projectId: string, nodes: typeof pendingRef.current['nodes'], edges: typeof pendingRef.current['edges']) => {
    fetch(`/api/projects/${projectId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nodes: nodes.map(toSystemNode),
        edges: edges.map(toSystemEdge),
      }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (!projectId || status !== 'ready') return;

    pendingRef.current = { nodes, edges, projectId };

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      if (pendingRef.current) {
        const { projectId, nodes, edges } = pendingRef.current;
        save(projectId, nodes, edges);
        pendingRef.current = null;
      }
    }, 1500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, projectId, status]);

  // 페이지 이동 시 즉시 저장
  useEffect(() => {
    return () => {
      if (pendingRef.current) {
        const { projectId, nodes, edges } = pendingRef.current;
        save(projectId, nodes, edges);
      }
    };
  }, []);
}
