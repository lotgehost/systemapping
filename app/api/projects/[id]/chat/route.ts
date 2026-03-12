import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/openrouter/client';

const CHAT_SYSTEM_PROMPT = `You are a systems thinking advisor specializing in Causal Loop Diagrams (CLD / 인과지도). You are helping a user refine and improve their system map.

You have access to the current map state (nodes and edges). When answering:
- Reference specific nodes/edges from the map when relevant
- Suggest concrete improvements: missing variables, incorrect polarities, overlooked feedback loops
- Explain causal mechanisms in simple Korean
- If the user asks to add/remove/modify something, describe EXACTLY what change to make (e.g., "n3 노드와 n7 노드 사이에 + 극성의 엣지를 추가하세요")
- Keep responses concise and actionable (3-5 sentences max unless explaining a complex concept)
- Always respond in Korean`;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { message, history } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'message is required' }, { status: 400 });
    }

    const supabase = createClient();
    const { data: project, error } = await supabase
      .from('projects')
      .select('prompt, nodes, edges')
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const nodesSummary = (project.nodes ?? []).map((n: { id: string; label: string; type: string }) =>
      `- [${n.id}] ${n.label} (${n.type})`
    ).join('\n');

    const edgesSummary = (project.edges ?? []).map((e: { id: string; source: string; target: string; polarity: string; loop_label?: string }) =>
      `- [${e.id}] ${e.source} → ${e.target} (${e.polarity}${e.loop_label ? ', ' + e.loop_label : ''})`
    ).join('\n');

    const contextMessage = `[현재 맵 상태]
분석 주제: ${project.prompt}

노드 (${(project.nodes ?? []).length}개):
${nodesSummary || '(없음)'}

엣지 (${(project.edges ?? []).length}개):
${edgesSummary || '(없음)'}`;

    const messages = [
      { role: 'system' as const, content: CHAT_SYSTEM_PROMPT },
      { role: 'user' as const, content: contextMessage },
      { role: 'assistant' as const, content: '네, 현재 맵을 확인했습니다. 무엇을 도와드릴까요?' },
      ...(history ?? []),
      { role: 'user' as const, content: message },
    ];

    const reply = await chatCompletion(messages);
    return NextResponse.json({ reply });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
