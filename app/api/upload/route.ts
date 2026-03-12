import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const allowedTypes = ['application/pdf', 'text/plain'];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Only PDF and TXT files are supported' }, { status: 400 });
  }

  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large (max 10 MB)' }, { status: 400 });
  }

  const supabase = createClient();
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let extractedText = '';

  if (file.type === 'application/pdf') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require('pdf-parse') as (buf: Buffer) => Promise<{ text: string }>;
      const result = await pdfParse(buffer);
      extractedText = result.text;
    } catch {
      return NextResponse.json({ error: 'Failed to parse PDF' }, { status: 500 });
    }
  } else {
    extractedText = buffer.toString('utf-8');
  }

  // Upload file to Supabase Storage
  const storageKey = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
  const { error: storageError } = await supabase.storage
    .from('uploads')
    .upload(storageKey, buffer, { contentType: file.type });

  if (storageError) {
    // Continue even if storage fails — we have the text
    console.error('Storage upload failed:', storageError.message);
  }

  // Save metadata to DB (no project_id yet — will be associated on project creation)
  const { data, error: dbError } = await supabase
    .from('uploads')
    .insert({
      file_name: file.name,
      storage_key: storageKey,
      extracted_text: extractedText.slice(0, 50_000), // cap at 50k chars
    })
    .select('id')
    .single();

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({
    upload_id: data.id,
    file_name: file.name,
    extracted_text_preview: extractedText.slice(0, 200),
  });
}
