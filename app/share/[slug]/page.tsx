'use client';

import { useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useMapStore, MapNode, MapEdge } from '@/hooks/useMapStore';
import MapWorkspace from '@/components/map/MapWorkspace';
import { SystemNode, SystemEdge } from '@/types';

export default function SharePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const setPrompt = useMapStore((s) => s.setPrompt);
  const setStatus = useMapStore((s) => s.setStatus);

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/share/${slug}`);
      if (!res.ok) { router.push('/'); return; }

      const project = await res.json();
      setPrompt(project.prompt);

      const { applyDagreLayout } = await import('@/lib/utils/layout');
      const flowNodes: MapNode[] = ((project.nodes ?? []) as SystemNode[]).map((n) => ({
        id: n.id,
        type: n.type,
        position: { x: 0, y: 0 },
        data: { label: n.label, nodeType: n.type, description: n.description, sources: n.sources },
      }));
      const flowEdges: MapEdge[] = ((project.edges ?? []) as SystemEdge[]).map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: 'labeled',
        data: { relation_type: e.relation_type, description: e.description, sources: e.sources },
      }));

      const laidOut = applyDagreLayout(flowNodes, flowEdges);
      useMapStore.setState({ nodes: laidOut, edges: flowEdges });
      setStatus('ready');
    }

    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  return <MapWorkspace readOnly />;
}
