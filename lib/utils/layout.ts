import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 180;
const NODE_HEIGHT = 80;

export function applyDagreLayout<T extends Node>(
  nodes: T[],
  edges: Edge[]
): T[] {
  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'TB', nodesep: 60, ranksep: 80 });
  graph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((e) => {
    graph.setEdge(e.source, e.target);
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
