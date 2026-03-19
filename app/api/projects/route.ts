import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/server-auth';

export async function GET() {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const supabase = createClient();
    const { data, error } = await supabase
      .from('projects')
      .select('id, prompt, status, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data ?? []);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { prompt, upload_ids } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'prompt is required' }, { status: 400 });
    }

    const supabase = createClient();

    const { data, error } = await supabase
      .from('projects')
      .insert({ prompt: prompt.trim(), status: 'pending', user_id: user.id })
      .select('id')
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

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
