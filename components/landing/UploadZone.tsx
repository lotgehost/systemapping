'use client';

import { useRef, useState } from 'react';

interface UploadedFile {
  id: string;
  name: string;
  status: 'uploading' | 'ready' | 'error';
}

interface UploadZoneProps {
  uploadedFiles: UploadedFile[];
  onFilesAdded: (files: File[]) => void;
  onFileRemove: (id: string) => void;
}

export default function UploadZone({
  uploadedFiles,
  onFilesAdded,
  onFileRemove,
}: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files).filter(
      (f) => f.type === 'application/pdf' || f.type === 'text/plain'
    );
    if (files.length) onFilesAdded(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length) onFilesAdded(files);
    e.target.value = '';
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`
          rounded-lg px-4 py-3 text-sm cursor-pointer
          transition-all duration-200 text-center
          border
          ${dragging
            ? 'border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.06)]'
            : 'border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[var(--glass-hover)] hover:border-[var(--glass-border-strong)]'
          }
        `}
      >
        <span className="text-[var(--text-muted)] text-xs">
          + 자료 첨부 (PDF, TXT)
        </span>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          multiple
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {uploadedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {uploadedFiles.map((f) => (
            <div
              key={f.id}
              className="rounded-md px-2.5 py-1 text-xs flex items-center gap-2"
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <span className={f.status === 'error' ? 'text-red-400/70' : 'text-[var(--text-secondary)]'}>
                {f.status === 'uploading' ? '·' : f.status === 'error' ? '✗' : '✓'} {f.name}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onFileRemove(f.id); }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
