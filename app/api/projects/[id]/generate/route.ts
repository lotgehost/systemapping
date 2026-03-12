import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { chatCompletion } from '@/lib/openrouter/client';
import { parseAIResponse } from '@/lib/openrouter/parser';
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/openrouter/prompts';

export const maxDuration = 60;

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

  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Heartbeat timer
      const heartbeat = setInterval(() => {
        send({ type: 'progress', message: 'Analyzing...' });
      }, 3000);

      try {
        const userPrompt = buildUserPrompt(project.prompt, uploadedTexts);

        const rawResponse = await chatCompletion([
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ]);

        const { nodes, edges } = parseAIResponse(rawResponse);

        // Save to DB
        await supabase
          .from('projects')
          .update({ nodes, edges, status: 'ready' })
          .eq('id', id);

        send({ type: 'done', nodes, edges });
      } catch (err: unknown) {
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

  return new Response(stream, { headers: sseHeaders() });
}

function sseHeaders() {
  return {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  };
}
