'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, Paperclip, X } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'ready' | 'error';
  upload_id?: string;
}

export default function ProblemInput() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleFilesAdded = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((f) => ({
      id: Math.random().toString(36).slice(2),
      name: f.name,
      status: 'uploading',
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const localId = newFiles[i].id;
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed');
        setUploadedFiles((prev) =>
          prev.map((f) => f.id === localId ? { ...f, status: 'ready', upload_id: data.upload_id } : f)
        );
      } catch {
        setUploadedFiles((prev) =>
          prev.map((f) => f.id === localId ? { ...f, status: 'error' } : f)
        );
      }
    }
  };

  const handleSubmit = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    setError('');
    try {
      const uploadIds = uploadedFiles
        .filter((f) => f.status === 'ready' && f.upload_id)
        .map((f) => f.upload_id!);
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim(), upload_ids: uploadIds }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to create project');
      router.push(`/map/${data.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
    }
  };

  const hasContent = prompt.trim() !== '' || uploadedFiles.length > 0;

  return (
    <div className="w-full">
      <div
        className="rounded-3xl transition-all duration-300"
        style={{
          background: isDragging ? 'rgba(20,21,24,0.92)' : 'rgba(31,32,35,0.88)',
          border: isDragging ? '1px solid rgba(96,165,250,0.5)' : '1px solid rgba(255,255,255,0.13)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(20px)',
        }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const files = Array.from(e.dataTransfer.files).filter((f) =>
            f.type === 'application/pdf' || f.name.endsWith('.pdf')
          );
          if (files.length > 0) handleFilesAdded(files);
        }}
      >
        {/* Attached files */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-4 pt-3">
            {uploadedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs"
                style={{
                  background: f.status === 'error' ? 'rgba(248,113,113,0.12)' : 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: f.status === 'error' ? '#f87171' : '#D1D5DB',
                }}
              >
                {f.status === 'uploading' && <span className="w-2.5 h-2.5 rounded-full border border-[#9CA3AF] border-t-transparent animate-spin flex-shrink-0" />}
                {f.status === 'ready' && <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] flex-shrink-0" />}
                {f.status === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] flex-shrink-0" />}
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button
                  onClick={() => setUploadedFiles((prev) => prev.filter((x) => x.id !== f.id))}
                  className="ml-0.5 text-[#6B7280] hover:text-[#D1D5DB] transition-colors cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={prompt}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder="어떤 시스템을 이해하고 싶으신가요?"
          rows={1}
          disabled={loading}
          className="w-full bg-transparent px-4 py-3.5 text-sm text-gray-100 placeholder:text-[#6B7280] focus:outline-none resize-none disabled:opacity-50"
          style={{ minHeight: '52px', maxHeight: '160px' }}
        />

        {/* Bottom actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-1.5 h-8 px-2 rounded-full text-xs text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-white/5 transition-all duration-150 cursor-pointer disabled:opacity-40"
          >
            <Paperclip className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => {
              if (e.target.files?.length) { handleFilesAdded(Array.from(e.target.files)); e.target.value = ''; }
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !hasContent}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: hasContent && !loading ? '#ffffff' : 'rgba(255,255,255,0.1)',
            }}
          >
            {loading
              ? <span className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] border-t-transparent animate-spin" />
              : <ArrowUp className="w-4 h-4" style={{ color: hasContent ? '#1F2023' : '#6B7280' }} />
            }
          </button>
        </div>
      </div>

      {error && <p className="text-xs text-red-400 mt-2 px-1">{error}</p>}
    </div>
  );
}
