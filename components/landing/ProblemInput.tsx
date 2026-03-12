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
          prev.map((f) =>
            f.id === localId ? { ...f, status: 'ready', upload_id: data.upload_id } : f
          )
        );
      } catch {
        setUploadedFiles((prev) =>
          prev.map((f) => (f.id === localId ? { ...f, status: 'error' } : f))
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
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.type === 'application/pdf' || f.name.endsWith('.pdf')
    );
    if (files.length > 0) handleFilesAdded(files);
  };

  const hasContent = prompt.trim() !== '' || uploadedFiles.length > 0;

  return (
    <div className="w-full space-y-3">
      {/* Prompt box */}
      <div
        className="rounded-3xl p-2 transition-all duration-300"
        style={{
          background: '#1F2023',
          border: isDragging
            ? '1px solid rgba(96,165,250,0.5)'
            : '1px solid #444444',
          boxShadow: '0 8px 30px rgba(0,0,0,0.24)',
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Attached files */}
        {uploadedFiles.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-2 pt-1 pb-2">
            {uploadedFiles.map((f) => (
              <div
                key={f.id}
                className="flex items-center gap-1.5 rounded-xl px-2.5 py-1 text-xs"
                style={{
                  background: f.status === 'error'
                    ? 'rgba(220,38,38,0.12)'
                    : 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: f.status === 'error' ? '#f87171' : '#D1D5DB',
                }}
              >
                {f.status === 'uploading' && (
                  <span className="w-3 h-3 rounded-full border border-[#9CA3AF] border-t-transparent animate-spin flex-shrink-0" />
                )}
                {f.status === 'ready' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] flex-shrink-0" />
                )}
                {f.status === 'error' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f87171] flex-shrink-0" />
                )}
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
          placeholder={"어떤 시스템을 이해하고 싶으신가요?\n\n예: 청년 주거 문제의 구조를 시스템으로 보고 싶다"}
          rows={3}
          disabled={loading}
          className="w-full bg-transparent px-3 py-2.5 text-sm text-gray-100 placeholder:text-[#4B5563] focus:outline-none resize-none disabled:opacity-50"
          style={{ minHeight: '80px', maxHeight: '200px' }}
        />

        {/* Actions */}
        <div className="flex items-center justify-between px-1 pt-1">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={loading}
            className="flex items-center gap-1.5 h-8 px-2 rounded-full text-xs text-[#9CA3AF] hover:text-[#D1D5DB] hover:bg-white/5 transition-all duration-150 cursor-pointer disabled:opacity-40"
          >
            <Paperclip className="w-4 h-4" />
            <span>PDF 첨부</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,application/pdf"
            multiple
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFilesAdded(Array.from(e.target.files));
                e.target.value = '';
              }
            }}
          />

          <button
            onClick={handleSubmit}
            disabled={loading || !hasContent}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: hasContent && !loading ? '#ffffff' : 'transparent',
              border: hasContent && !loading ? 'none' : '1px solid rgba(255,255,255,0.15)',
            }}
          >
            {loading ? (
              <span className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] border-t-transparent animate-spin" />
            ) : (
              <ArrowUp
                className="w-4 h-4"
                style={{ color: hasContent ? '#1F2023' : '#6B7280' }}
              />
            )}
          </button>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-400 px-2">{error}</p>
      )}

      <p className="text-[10px] text-[#4B5563] text-center">
        Enter로 전송 · Shift+Enter로 줄바꿈 · PDF 드래그 앤 드롭 가능
      </p>
    </div>
  );
}
