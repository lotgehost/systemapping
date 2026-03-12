import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 36;

export function applyDagreLayout<T extends Node>(
  nodes: T[],
  edges: Edge[]
): T[] {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setGraph({
    rankdir: 'LR',
    nodesep: 100,
    ranksep: 200,
    edgesep: 50,
    marginx: 80,
    marginy: 80,
  });
  graph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((e) => {
    if (e.source !== e.target) graph.setEdge(e.source, e.target);
  });

  dagre.layout(graph);

  return nodes.map((n) => {
    const pos = graph.node(n.id);
    return {
      ...n,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });
}
