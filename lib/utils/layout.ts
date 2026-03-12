import dagre from '@dagrejs/dagre';
import { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 50;

/**
 * Positions nodes using a hybrid approach:
 * 1. Run dagre to get a rough layout
 * 2. Remap node positions onto a circle/ellipse to avoid the linear top-down feel
 * This gives organic, web-like placement that suits CLD diagrams.
 */
export function applyDagreLayout<T extends Node>(
  nodes: T[],
  edges: Edge[]
): T[] {
  if (nodes.length === 0) return nodes;

  const graph = new dagre.graphlib.Graph();
  graph.setGraph({ rankdir: 'LR', nodesep: 100, ranksep: 180, align: 'UL' });
  graph.setDefaultEdgeLabel(() => ({}));

  nodes.forEach((n) => {
    graph.setNode(n.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
  });

  edges.forEach((e) => {
    if (e.source !== e.target) graph.setEdge(e.source, e.target);
  });

  dagre.layout(graph);

  // Compute bounding box of dagre output
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  nodes.forEach((n) => {
    const pos = graph.node(n.id);
    if (!pos) return;
    minX = Math.min(minX, pos.x);
    minY = Math.min(minY, pos.y);
    maxX = Math.max(maxX, pos.x);
    maxY = Math.max(maxY, pos.y);
  });

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  // Map dagre normalized position onto an ellipse
  // This breaks up the straight-line feel while preserving relative clustering
  const CX = (nodes.length * 90);   // ellipse center x
  const CY = (nodes.length * 70);   // ellipse center y
  const RX = CX * 0.72;              // ellipse x-radius
  const RY = CY * 0.58;              // ellipse y-radius

  return nodes.map((n) => {
    const pos = graph.node(n.id);
    if (!pos) return n;

    // Normalize to [-1, 1]
    const nx = ((pos.x - minX) / rangeX) * 2 - 1;
    const ny = ((pos.y - minY) / rangeY) * 2 - 1;

    // Convert normalized cartesian to polar, map radius to ellipse
    const angle = Math.atan2(ny, nx);
    const dist = Math.sqrt(nx * nx + ny * ny); // 0..~1.414

    // Nodes near the center stay near center; outer nodes spread to ellipse perimeter
    const r = Math.pow(dist / 1.414, 0.65); // soften the radial distribution

    const x = CX + RX * r * Math.cos(angle) - NODE_WIDTH / 2;
    const y = CY + RY * r * Math.sin(angle) - NODE_HEIGHT / 2;

    return { ...n, position: { x, y } };
  });
}
