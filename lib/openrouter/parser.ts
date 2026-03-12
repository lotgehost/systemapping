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
  // Strip markdown fences if present
  let cleaned = raw.trim();
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();
  }

  const parsed = JSON.parse(cleaned);
  const validated = ResponseSchema.parse(parsed);

  return {
    nodes: validated.nodes as SystemNode[],
    edges: validated.edges as SystemEdge[],
  };
}
