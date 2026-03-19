import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/openrouter/client';
import { parseAIResponse } from '@/lib/openrouter/parser';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/openrouter/prompts';

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  // Fetch project
  const { data: project, error: projError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (projError || !project) {
    return new Response(
      `data: ${JSON.stringify({ type: 'error', message: 'Project not found' })}\n\ndata: [DONE]\n\n`,
      { headers: sseHeaders() }
    );
  }

  // Fetch uploaded texts
  const { data: uploads } = await supabase
    .from('uploads')
    .select('extracted_text')
    .eq('project_id', id);

  const uploadedTexts = (uploads ?? [])
    .map((u: { extracted_text: string | null }) => u.extracted_text)
    .filter((t): t is string => !!t);

  // Mark as generating
  await supabase.from('projects').update({ status: 'generating' }).eq('id', id);

  const encoder = new TextEncoder();

  const responseStream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        console.log('[generate] send:', JSON.stringify(data));
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Heartbeat timer
      const heartbeat = setInterval(() => {
        send({ type: 'progress', message: 'Analyzing...' });
      }, 3000);

      try {
        const userPrompt = buildUserPrompt(project.prompt, uploadedTexts);
        console.log('[generate] calling chatCompletion...');

        const rawResponse = await chatCompletion([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ], 8000, 'google/gemini-2.0-flash-lite-001');

        console.log('[generate] chatCompletion returned, length:', rawResponse.length);
        console.log('[generate] raw (first 200):', rawResponse.slice(0, 200));

        const { nodes, edges } = parseAIResponse(rawResponse);
        console.log('[generate] parsed:', nodes.length, 'nodes,', edges.length, 'edges');

        // Save to DB
        await supabase
          .from('projects')
          .update({ nodes, edges, status: 'ready' })
          .eq('id', id);

        send({ type: 'done', nodes, edges });
      } catch (err: unknown) {
        console.error('[generate] error:', err);
        const msg = err instanceof Error ? err.message : 'Unknown error';
        await supabase.from('projects').update({ status: 'error' }).eq('id', id);
        send({ type: 'error', message: msg });
      } finally {
        clearInterval(heartbeat);
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      }
    },
  });

  return new Response(responseStream, { headers: sseHeaders() });
}

function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };
}
