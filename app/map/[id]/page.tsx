'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, MapNode, MapEdge } from '@/hooks/useMapStore';
import { useGenerate } from '@/hooks/useGenerate';
import MapWorkspace from '@/components/map/MapWorkspace';
import { SystemNode, SystemEdge } from '@/types';

export default function MapPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const setProjectId = useMapStore((s) => s.setProjectId);
  const setPrompt = useMapStore((s) => s.setPrompt);
  const setStatus = useMapStore((s) => s.setStatus);
  const { generate } = useGenerate();

  useEffect(() => {
    setProjectId(id);

    async function init() {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) { router.push('/'); return; }

      const project = await res.json();
      console.log('[page] project loaded:', project.status, 'nodes:', project.nodes?.length);
      setPrompt(project.prompt);

      if (project.status === 'ready' && project.nodes?.length) {
        const { applyDagreLayout } = await import('@/lib/utils/layout');
        const flowNodes: MapNode[] = (project.nodes as SystemNode[]).map((n) => ({
          id: n.id,
          type: n.type,
          position: { x: 0, y: 0 },
          dragHandle: '.node-drag-handle',
          data: { label: n.label, nodeType: n.type, description: n.description, sources: n.sources },
        }));
        const flowEdges: MapEdge[] = (project.edges as SystemEdge[]).map((e) => ({
          id: e.id,
          source: e.source,
          target: e.target,
          type: 'labeled',
          data: { polarity: e.polarity, loop_label: e.loop_label, description: e.description, sources: e.sources },
        }));
        const laidOut = applyDagreLayout(flowNodes, flowEdges);
        useMapStore.setState({ nodes: laidOut, edges: flowEdges });
        setStatus('ready');
      } else {
        generate(id);
      }
    }

    init();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return <MapWorkspace />;
}
