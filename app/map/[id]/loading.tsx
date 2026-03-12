import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Loading() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={32} />
        <p className="text-sm text-[var(--text-muted)]">시스템 맵을 불러오는 중...</p>
      </div>
    </div>
  );
}
