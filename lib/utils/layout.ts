import { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 120;
const NODE_HEIGHT = 36;

/**
 * Circular layout: places nodes evenly on a circle.
 * Uses BFS ordering so connected nodes end up adjacent on the ring,
 * which minimises edge crossings.
 */
export function applyDagreLayout<T extends Node>(nodes: T[], edges: Edge[]): T[] {
  const n = nodes.length;
  if (n === 0) return nodes;
  if (n === 1) return [{ ...nodes[0], position: { x: 0, y: 0 } }];

  // Build undirected adjacency
  const adj = new Map<string, Set<string>>();
  nodes.forEach((node) => adj.set(node.id, new Set()));
  edges.forEach((e) => {
    if (e.source !== e.target) {
      adj.get(e.source)?.add(e.target);
      adj.get(e.target)?.add(e.source);
    }
  });

  // BFS from the highest-degree node so well-connected nodes are adjacent on ring
  const startId = [...adj.entries()].sort((a, b) => b[1].size - a[1].size)[0][0];
  const order: string[] = [];
  const visited = new Set<string>([startId]);
  const queue: string[] = [startId];

  while (queue.length > 0) {
    const curr = queue.shift()!;
    order.push(curr);
    // Sort neighbours by degree desc for better visual grouping
    const neighbours = [...(adj.get(curr) ?? [])].sort(
      (a, b) => (adj.get(b)?.size ?? 0) - (adj.get(a)?.size ?? 0)
    );
    for (const nb of neighbours) {
      if (!visited.has(nb)) {
        visited.add(nb);
        queue.push(nb);
      }
    }
  }
  // Include any disconnected nodes
  nodes.forEach((node) => {
    if (!visited.has(node.id)) order.push(node.id);
  });

  const positionIndex = new Map(order.map((id, i) => [id, i]));

  // Radius: ~180px gap between adjacent nodes on the circle
  const circumference = n * 180;
  const R = circumference / (2 * Math.PI);
  const CX = R;
  const CY = R;

  return nodes.map((node) => {
    const idx = positionIndex.get(node.id) ?? 0;
    // Start from top (−π/2) and go clockwise
    const angle = (2 * Math.PI * idx) / n - Math.PI / 2;
    return {
      ...node,
      position: {
        x: CX + R * Math.cos(angle) - NODE_WIDTH / 2,
        y: CY + R * Math.sin(angle) - NODE_HEIGHT / 2,
      },
    };
  });
}
