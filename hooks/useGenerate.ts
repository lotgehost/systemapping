'use client';

import { useCallback } from 'react';
import { useMapStore, MapNode, MapEdge } from './useMapStore';
import { applyDagreLayout } from '@/lib/utils/layout';
import { SystemNode, SystemEdge } from '@/types';

export function useGenerate() {
  const setStatus = useMapStore((s) => s.setStatus);

  const generate = useCallback(async (projectId: string) => {
    console.log('[useGenerate] generate() called, projectId:', projectId);
    setStatus('generating');

    try {
      const res = await fetch(`/api/projects/${projectId}/generate`, { method: 'POST' });
      console.log('[useGenerate] fetch response status:', res.status, 'ok:', res.ok);

      if (!res.ok || !res.body) throw new Error('Generation failed');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const raw = line.slice(6).trim();
          if (!raw || raw === '[DONE]') continue;

          let event: { type: string; nodes?: SystemNode[]; edges?: SystemEdge[]; message?: string };
          try {
            event = JSON.parse(raw);
          } catch {
            // ignore malformed heartbeat lines
            continue;
          }

          console.log('[useGenerate] event received:', event.type);
          if (event.type === 'done') {
            const sysNodes: SystemNode[] = event.nodes ?? [];
            const sysEdges: SystemEdge[] = event.edges ?? [];

            const flowNodes: MapNode[] = sysNodes.map((n) => ({
              id: n.id,
              type: n.type,
              position: { x: 0, y: 0 },
              data: {
                label: n.label,
                nodeType: n.type,
                description: n.description,
                sources: n.sources,
              },
            }));

            const flowEdges: MapEdge[] = sysEdges.map((e) => ({
              id: e.id,
              source: e.source,
              target: e.target,
              type: 'labeled',
              data: {
                polarity: e.polarity,
                loop_label: e.loop_label,
                description: e.description,
                sources: e.sources,
              },
            }));

            const laidOut = applyDagreLayout(flowNodes, flowEdges);
            console.log('[useGenerate] laidOut nodes:', laidOut.length);
            useMapStore.setState({ nodes: laidOut, edges: flowEdges });
            setStatus('ready');
            console.log('[useGenerate] status set to ready');
            return;
          }

          if (event.type === 'error') {
            setStatus('error', event.message ?? 'Generation error');
            return;
          }
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setStatus('error', msg);
    }
  }, [setStatus]);

  return { generate };
}
