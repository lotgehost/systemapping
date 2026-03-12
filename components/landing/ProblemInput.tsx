'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import GlassInput from '@/components/ui/GlassInput';
import GlassButton from '@/components/ui/GlassButton';
import UploadZone from './UploadZone';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

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
    if (!prompt.trim()) return;
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

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <GlassInput
        multiline
        rows={5}
        placeholder="어떤 시스템을 이해하고 싶으신가요?&#10;&#10;예: 청년 주거 문제의 구조를 시스템으로 보고 싶다&#10;예: 지역소멸 문제의 핵심 원인과 피드백 루프를 분석하고 싶다"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <UploadZone
        uploadedFiles={uploadedFiles}
        onFilesAdded={handleFilesAdded}
        onFileRemove={(id) =>
          setUploadedFiles((prev) => prev.filter((f) => f.id !== id))
        }
      />

      {error && (
        <p className="text-sm text-red-400">{error}</p>
      )}

      <GlassButton
        variant="primary"
        className="w-full py-3 text-base font-semibold flex items-center justify-center gap-2"
        onClick={handleSubmit}
        disabled={loading || !prompt.trim()}
      >
        {loading ? (
          <>
            <LoadingSpinner size={16} />
            <span>분석 중...</span>
          </>
        ) : (
          '시스템 초안 생성'
        )}
      </GlassButton>
    </div>
  );
}
