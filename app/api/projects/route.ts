import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const { prompt, upload_ids } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('projects')
      .insert({ prompt: prompt.trim(), status: 'pending' })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Associate uploads with this project
    if (upload_ids?.length) {
      await supabase
        .from('uploads')
        .update({ project_id: data.id })
        .in('id', upload_ids);
    }

    return NextResponse.json({ id: data.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
