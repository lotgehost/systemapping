import { z } from 'zod';
import { SystemNode, SystemEdge } from '@/types';

const SourceSchema = z.object({
  type: z.enum(['web', 'upload', 'user', 'ai_inference']),
  title: z.string(),
  url: z.string().optional(),
  file_name: z.string().optional(),
  excerpt: z.string().optional(),
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
  description: z.string(),
  sources: z.array(SourceSchema).default([]),
});

const ResponseSchema = z.object({
  nodes: z.array(NodeSchema),
  edges: z.array(EdgeSchema),
});

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

  return {
    nodes: validated.nodes as SystemNode[],
    edges: validated.edges as SystemEdge[],
  };
}
