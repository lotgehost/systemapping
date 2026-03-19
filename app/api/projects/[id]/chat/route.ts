import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/openrouter/client';

export const maxDuration = 60;

const CHAT_SYSTEM_PROMPT = `You are a systems thinking advisor specializing in Causal Loop Diagrams (CLD / 인과지도). You help users refine their system map.

You have access to the current map (nodes and edges). Respond in Korean, concisely.

When the user refers to a node or edge by name, match it flexibly:
- Ignore spacing differences (e.g. "스마트폰사용량" → "스마트폰 사용량")
- Tolerate minor typos or spelling variations (e.g. "주의집중녁" → "주의집중력")
- Match by meaning if the intent is clear
Always use the exact node/edge ID from the current map when generating operations.

When the user asks to MODIFY the map (add/remove/change nodes or edges), you MUST:
1. Explain what you're doing in 1-2 sentences
2. Output a JSON block wrapped in <operations> tags describing the exact changes

CRITICAL RULES:
- To connect two EXISTING nodes, use ONLY addEdge with their existing IDs. Do NOT addNode for nodes that already exist.
- To add a NEW node and connect it, use addNode first, then addEdge.
- Never create a node with an ID that already exists in the current map.
- For new node IDs, use the next available number (e.g. if n10 is the highest, use n11).
- For new edge IDs, use the next available number (e.g. if e15 is the highest, use e16).

Operation types:
- addNode: { "type": "addNode", "node": { "id": "nXX", "label": "한글명", "nodeType": "variable|lever|exogenous", "description": "한글 설명" } }
- removeNode: { "type": "removeNode", "nodeId": "nXX" }
- updateNode: { "type": "updateNode", "nodeId": "nXX", "data": { "label": "...", "description": "..." } }
- addEdge: { "type": "addEdge", "edge": { "id": "eXX", "source": "nXX", "target": "nYY", "polarity": "+|-", "description": "한글 설명" } }
- removeEdge: { "type": "removeEdge", "edgeId": "eXX" }
- updateEdge: { "type": "updateEdge", "edgeId": "eXX", "data": { "polarity": "+|-", "description": "..." } }

Example — connecting two EXISTING nodes n1 and n3:
"두 노드를 연결했습니다.
<operations>
[
  {"type":"addEdge","edge":{"id":"e16","source":"n1","target":"n3","polarity":"+","description":"설명"}}
]
</operations>"

Example — adding a NEW node and connecting it to existing n1:
"스트레스 변수를 추가하고 스마트폰 사용량과 연결했습니다.
<operations>
[
  {"type":"addNode","node":{"id":"n11","label":"스트레스","nodeType":"variable","description":"청소년의 심리적 스트레스 수준"}},
  {"type":"addEdge","edge":{"id":"e20","source":"n1","target":"n11","polarity":"+","description":"스마트폰 사용이 증가하면 스트레스가 증가한다"}}
]
</operations>"

When only answering questions (no map change), do NOT include <operations>.
Keep responses concise (2-4 sentences for analysis, 1-2 sentences + operations for changes).`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { message, history, currentNodes, currentEdges } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('prompt')
      .eq('id', id)
      .single();

    if (error) return NextResponse.json({ error: `DB error: ${error.message}` }, { status: 500 });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });

    // Use client-provided state (always up-to-date) instead of DB
    type ClientNode = { id: string; label: string; type: string };
    type ClientEdge = { id: string; source: string; target: string; polarity: string };
    const nodes: ClientNode[] = currentNodes ?? [];
    const edges: ClientEdge[] = currentEdges ?? [];

    const nodesSummary = nodes.map((n) => `- [${n.id}] ${n.label} (${n.type})`).join('\n');
    const edgesSummary = edges.map((e) => `- [${e.id}] ${e.source}→${e.target} (${e.polarity})`).join('\n');

    const contextMessage = `[현재 맵]
주제: ${project.prompt}
노드(${nodes.length}):
${nodesSummary || '(없음)'}
엣지(${edges.length}):
${edgesSummary || '(없음)'}`;

    const recentHistory = (history ?? []).slice(-10);

    const messages = [
      { role: 'system' as const, content: CHAT_SYSTEM_PROMPT },
      { role: 'user' as const, content: contextMessage },
      { role: 'assistant' as const, content: '네, 현재 맵을 확인했습니다. 무엇을 도와드릴까요?' },
      ...recentHistory,
      { role: 'user' as const, content: message },
    ];

    const raw = await chatCompletion(messages, 800, 'google/gemini-2.0-flash-lite-001');

    // Parse <operations> block if present
    console.log('[chat route] raw response (first 300):', raw.slice(0, 300));
    const opsMatch = raw.match(/<operations>([\s\S]*?)<\/operations>/);
    let operations: unknown[] = [];
    let reply = raw;

    if (!opsMatch) {
      console.log('[chat route] no <operations> block found in response');
    }

    if (opsMatch) {
      try {
        operations = JSON.parse(opsMatch[1].trim());
        console.log('[chat route] parsed operations:', operations.length, JSON.stringify(operations).slice(0, 500));
      } catch (e) {
        console.log('[chat route] failed to parse operations:', e, 'raw match:', opsMatch[1].slice(0, 200));
        operations = [];
      }
      reply = raw.replace(/<operations>[\s\S]*?<\/operations>/, '').trim();

      // Persist updated nodes/edges to DB if there are operations
      if (operations.length > 0) {
        // We'll let the client apply ops and save via autosave
      }
    }

    return NextResponse.json({ reply, operations });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
