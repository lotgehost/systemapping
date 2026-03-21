'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, Paperclip, X, Clock } from 'lucide-react';
import RecentProjects from './RecentProjects';

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
  const [showProjects, setShowProjects] = useState(false);
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
    <div className="w-full space-y-3">
      {/* Input box */}
      <div
        className="rounded-3xl transition-all duration-300"
        style={{
          background: isDragging ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.6)',
          border: isDragging ? '1px solid rgba(0,0,0,0.2)' : '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
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
                  background: f.status === 'error' ? 'rgba(239,68,68,0.1)' : 'rgba(0,0,0,0.06)',
                  border: '1px solid rgba(0,0,0,0.08)',
                  color: f.status === 'error' ? '#dc2626' : '#374151',
                }}
              >
                {f.status === 'uploading' && <span className="w-2.5 h-2.5 rounded-full border border-[#6B7280] border-t-transparent animate-spin flex-shrink-0" />}
                {f.status === 'ready' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />}
                {f.status === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />}
                <span className="max-w-[120px] truncate">{f.name}</span>
                <button
                  onClick={() => setUploadedFiles((prev) => prev.filter((x) => x.id !== f.id))}
                  className="ml-0.5 text-[#9CA3AF] hover:text-[#374151] transition-colors cursor-pointer"
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
          placeholder=""
          rows={1}
          disabled={loading}
          className="w-full bg-transparent px-4 pt-3 pb-2 text-sm text-gray-800 outline-none focus:outline-none focus:ring-0 resize-none disabled:opacity-50"
          style={{ minHeight: '36px', maxHeight: '160px' }}
        />

        {/* Bottom actions */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-0.5">
            {/* PDF attach */}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="flex items-center gap-1.5 h-8 px-2 rounded-full text-xs text-[#9CA3AF] hover:text-[#374151] hover:bg-black/5 transition-all duration-150 cursor-pointer disabled:opacity-40"
              title="Attach PDF"
            >
              <Paperclip className="w-4 h-4" />
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

            {/* My projects */}
            <button
              onClick={() => setShowProjects((v) => !v)}
              className="h-8 w-8 flex items-center justify-center rounded-full text-base hover:bg-black/5 transition-all duration-150 cursor-pointer"
              title="My Projects"
              style={{ color: showProjects ? '#374151' : '#9CA3AF' }}
            >
              <Clock className="w-4 h-4" />
            </button>
          </div>

          {/* Send */}
          <button
            onClick={handleSubmit}
            disabled={loading || !hasContent}
            className="h-8 w-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              background: hasContent && !loading ? 'rgba(15,15,20,0.85)' : 'rgba(0,0,0,0.1)',
            }}
          >
            {loading
              ? <span className="w-3.5 h-3.5 rounded-full border border-[#9CA3AF] border-t-transparent animate-spin" />
              : <ArrowUp className="w-4 h-4" style={{ color: hasContent ? '#ffffff' : '#9CA3AF' }} />
            }
          </button>
        </div>
      </div>

      {/* My Projects panel */}
      {showProjects && (
        <div className="animate-slide-up">
          <RecentProjects />
        </div>
      )}

      {error && <p className="text-xs text-red-500 px-1">{error}</p>}
    </div>
  );
}
