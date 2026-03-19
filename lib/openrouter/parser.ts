import { z } from 'zod';
import { SystemNode, SystemEdge } from '@/types';

const SourceSchema = z.object({
  type: z.enum(['web', 'upload', 'user', 'ai_inference']),
  title: z.string(),
  url: z.string().nullish(),
  file_name: z.string().nullish(),
  excerpt: z.string().nullish(),
});

const NodeSchema = z.object({
  id: z.string(),
  label: z.string(),
  type: z.enum(['variable', 'lever', 'exogenous']),
  description: z.string(),
  sources: z.array(SourceSchema).default([]),
});

const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  polarity: z.enum(['+', '-']),
  loop_label: z.string().optional(),
  description: z.string().optional().default(''),
  sources: z.array(SourceSchema).default([]),
});

const ResponseSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

/**
 * Find simple directed cycles using DFS.
 * Returns cycles as arrays of node IDs (each cycle: [a, b, c] means a→b→c→a).
 * Limited to cycles of length 2–6 for performance and readability.
 */
function findCycles(edges: SystemEdge[]): string[][] {
  const adj = new Map<string, { target: string; edgeId: string }[]>();
  for (const e of edges) {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push({ target: e.target, edgeId: e.id });
  }

  const allNodes = [...new Set(edges.flatMap((e) => [e.source, e.target]))];
  const cycles: string[][] = [];
  const seen = new Set<string>(); // deduplicate cycles by canonical form

  function dfs(start: string, path: string[], visited: Set<string>) {
    if (path.length > 6) return;
    const neighbors = adj.get(path[path.length - 1]) ?? [];
    for (const { target } of neighbors) {
      if (target === start && path.length >= 2) {
        // Found a cycle — canonicalise by rotating to smallest node first
        const minIdx = path.indexOf([...path].sort()[0]);
        const canonical = [...path.slice(minIdx), ...path.slice(0, minIdx)].join(',');
        if (!seen.has(canonical)) {
          seen.add(canonical);
          cycles.push([...path]);
        }
      } else if (!visited.has(target)) {
        visited.add(target);
        path.push(target);
        dfs(start, path, visited);
        path.pop();
        visited.delete(target);
      }
    }
  }

  for (const node of allNodes) {
    const visited = new Set<string>([node]);
    dfs(node, [node], visited);
  }

  return cycles;
}

/**
 * Assign loop_labels to edges based on algorithmically detected cycles.
 * Overwrites any AI-generated loop_labels.
 */
export function assignLoopLabels(edges: SystemEdge[]): SystemEdge[] {
  const edgeMap = new Map<string, SystemEdge>(edges.map((e) => [e.id, { ...e, loop_label: undefined }]));

  // Build a lookup: (source, target) → edge
  const edgeByPair = new Map<string, string>(); // "src→tgt" → edgeId
  for (const e of edges) edgeByPair.set(`${e.source}→${e.target}`, e.id);

  const cycles = findCycles(edges);

  // Sort by cycle length ascending (shorter = more fundamental)
  cycles.sort((a, b) => a.length - b.length);

  let rCount = 0;
  let bCount = 0;
  const maxPerType = 3;

  for (const cycle of cycles) {
    if (rCount >= maxPerType && bCount >= maxPerType) break;

    // Find edges in this cycle
    const cycleEdgeIds: string[] = [];
    let valid = true;
    for (let i = 0; i < cycle.length; i++) {
      const src = cycle[i];
      const tgt = cycle[(i + 1) % cycle.length];
      const eid = edgeByPair.get(`${src}→${tgt}`);
      if (!eid) { valid = false; break; }
      cycleEdgeIds.push(eid);
    }
    if (!valid) continue;

    // Skip if any edge is already labeled (to avoid conflicts)
    if (cycleEdgeIds.some((eid) => edgeMap.get(eid)?.loop_label)) continue;

    // Count negative edges to determine loop type
    const negCount = cycleEdgeIds.filter((eid) => {
      const e = edges.find((x) => x.id === eid);
      return e?.polarity === '-';
    }).length;
    const isReinforcing = negCount % 2 === 0;

    if (isReinforcing && rCount >= maxPerType) continue;
    if (!isReinforcing && bCount >= maxPerType) continue;

    const label = isReinforcing ? `R${++rCount}` : `B${++bCount}`;
    for (const eid of cycleEdgeIds) {
      const e = edgeMap.get(eid);
      if (e) edgeMap.set(eid, { ...e, loop_label: label });
    }
  }

  return edges.map((e) => edgeMap.get(e.id) ?? e);
}

export function parseAIResponse(raw: string): { nodes: SystemNode[]; edges: SystemEdge[] } {
  let cleaned = raw.trim();

  // Strip markdown fences
  cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  // Try direct parse, then extract first JSON object as fallback
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (!match) throw new Error('No JSON found in AI response');
    parsed = JSON.parse(match[0]);
  }

  const validated = ResponseSchema.parse(parsed);
  const edges = validated.edges as SystemEdge[];

  return {
    nodes: validated.nodes as SystemNode[],
    edges: assignLoopLabels(edges),
  };
}
