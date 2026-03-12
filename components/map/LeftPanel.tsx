'use client';

import { useState } from 'react';
import { useMapStore } from '@/hooks/useMapStore';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { NodeType } from '@/types';

const NODE_TYPES: { value: NodeType; label: string; dot: string }[] = [
  { value: 'actor',             label: '행위자',    dot: 'rgba(255,255,255,0.9)' },
  { value: 'structural_factor', label: '구조 요인', dot: 'rgba(200,200,200,0.7)' },
  { value: 'outcome',           label: '결과',      dot: 'rgba(160,160,160,0.6)' },
  { value: 'feedback_loop',     label: '피드백',    dot: 'rgba(120,120,120,0.6)' },
  { value: 'intervention',      label: '개입',      dot: 'rgba(255,255,255,0.35)' },
];

interface LeftPanelProps {
  readOnly?: boolean;
  onShare?: () => void;
  shareUrl?: string;
}

export default function LeftPanel({ readOnly = false, onShare, shareUrl }: LeftPanelProps) {
  const prompt = useMapStore((s) => s.prompt);
  const status = useMapStore((s) => s.status);
  const errorMessage = useMapStore((s) => s.errorMessage);
  const addNode = useMapStore((s) => s.addNode);

  const [showAddNode, setShowAddNode] = useState(false);
  const [newNodeLabel, setNewNodeLabel] = useState('');
  const [newNodeType, setNewNodeType] = useState<NodeType>('actor');
  const [copied, setCopied] = useState(false);

  const handleAddNode = () => {
    if (!newNodeLabel.trim()) return;
    addNode({ label: newNodeLabel.trim(), type: newNodeType, description: '', sources: [] });
    setNewNodeLabel('');
    setShowAddNode(false);
  };

  const handleShare = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return;
    }
    onShare?.();
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo / header */}
      <div className="px-5 py-5 border-b border-[var(--glass-border)]">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="3" cy="3" r="1.5" fill="rgba(255,255,255,0.8)" />
              <circle cx="9" cy="3" r="1.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="6" cy="9" r="1.5" fill="rgba(255,255,255,0.6)" />
              <line x1="3" y1="3" x2="9" y2="3" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
              <line x1="3" y1="3" x2="6" y2="9" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
              <line x1="9" y1="3" x2="6" y2="9" stroke="rgba(255,255,255,0.3)" strokeWidth="0.75" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-widest uppercase text-[var(--text-muted)]">
            System Mapper
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">

        {/* Topic */}
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mb-2">
            분석 주제
          </p>
          <div
            className="rounded-lg p-3 text-sm text-[var(--text-secondary)] leading-relaxed"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
            }}
          >
            {prompt}
          </div>
        </div>

        {/* Status */}
        {status === 'generating' && (
          <div
            className="rounded-lg px-3 py-2.5 flex items-center gap-2.5 animate-fade-in"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <LoadingSpinner size={13} />
            <span className="text-xs text-[var(--text-muted)] animate-pulse-subtle">시스템 분석 중...</span>
          </div>
        )}

        {status === 'error' && (
          <div
            className="rounded-lg px-3 py-2.5 animate-fade-in"
            style={{
              background: 'rgba(255,60,60,0.05)',
              border: '1px solid rgba(255,60,60,0.12)',
            }}
          >
            <p className="text-xs text-red-400/80">{errorMessage || '분석 중 오류가 발생했습니다.'}</p>
          </div>
        )}

        {/* Add node */}
        {!readOnly && status === 'ready' && (
          <div className="space-y-2">
            <button
              onClick={() => setShowAddNode((v) => !v)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-all duration-150 hover:bg-[var(--glass-hover)] border border-transparent hover:border-[var(--glass-border)] cursor-pointer"
            >
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
              </svg>
              노드 추가
            </button>

            {showAddNode && (
              <div
                className="rounded-xl p-3 space-y-3 animate-slide-up"
                style={{
                  background: 'var(--glass-bg)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                }}
              >
                <GlassInput
                  placeholder="노드 이름"
                  value={newNodeLabel}
                  onChange={(e) => setNewNodeLabel((e.target as HTMLInputElement).value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddNode(); }}
                  autoFocus
                />
                <div className="flex flex-wrap gap-1.5">
                  {NODE_TYPES.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setNewNodeType(t.value)}
                      className={`flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-md transition-all duration-150 cursor-pointer ${
                        newNodeType === t.value
                          ? 'bg-white/10 text-[var(--text-primary)] border border-white/15'
                          : 'text-[var(--text-muted)] border border-transparent hover:text-[var(--text-secondary)] hover:bg-white/5'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: t.dot }}
                      />
                      {t.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowAddNode(false)}
                    className="flex-1 text-[10px] py-1.5 rounded-md text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors cursor-pointer"
                  >
                    취소
                  </button>
                  <GlassButton
                    variant="primary"
                    className="flex-1 text-[10px] py-1.5"
                    onClick={handleAddNode}
                  >
                    추가
                  </GlassButton>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Legend */}
        {status === 'ready' && (
          <div className="pt-2">
            <p className="text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] mb-2.5">
              노드 유형
            </p>
            <div className="space-y-1.5">
              {NODE_TYPES.map((t) => (
                <div key={t.value} className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: t.dot }}
                  />
                  <span className="text-[11px] text-[var(--text-muted)]">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-4 border-t border-[var(--glass-border)] space-y-2">
        {!readOnly && (
          <GlassButton
            variant="ghost"
            className="w-full text-xs py-2"
            onClick={handleShare}
            disabled={status !== 'ready'}
          >
            {copied
              ? '링크 복사됨'
              : shareUrl
              ? '링크 복사'
              : '공유 링크 생성'}
          </GlassButton>
        )}
      </div>
    </div>
  );
}
