import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils/slug';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const supabase = createClient();

  const updates: Record<string, unknown> = {};

  if (body.nodes !== undefined) updates.nodes = body.nodes;
  if (body.edges !== undefined) updates.edges = body.edges;
  if (body.sources !== undefined) updates.sources = body.sources;
  if (body.status !== undefined) updates.status = body.status;

  if (body.generate_slug) {
    const { data: existing } = await supabase
      .from('projects')
      .select('share_slug')
      .eq('id', id)
      .single();

    if (!existing?.share_slug) {
      updates.share_slug = generateSlug();
    } else {
      updates.share_slug = existing.share_slug;
    }
  }

  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select('updated_at, share_slug')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createClient();

  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
