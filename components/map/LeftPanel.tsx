'use client';

import { useState } from 'react';
import { useMapStore } from '@/hooks/useMapStore';
import GlassButton from '@/components/ui/GlassButton';
import GlassInput from '@/components/ui/GlassInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { NodeType } from '@/types';

const NODE_TYPES: { value: NodeType; label: string; dot: string }[] = [
  { value: 'variable',  label: 'Variable', dot: '#2563eb' },
  { value: 'exogenous', label: 'External', dot: '#7c3aed' },
  { value: 'lever',     label: 'Lever',    dot: '#059669' },
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
  const [newNodeType, setNewNodeType] = useState<NodeType>('variable');
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
              background: 'rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.1)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="3" cy="3" r="1.5" fill="#2563eb" />
              <circle cx="9" cy="3" r="1.5" fill="#7c3aed" />
              <circle cx="6" cy="9" r="1.5" fill="#059669" />
              <line x1="3" y1="3" x2="9" y2="3" stroke="rgba(0,0,0,0.2)" strokeWidth="0.75" />
              <line x1="3" y1="3" x2="6" y2="9" stroke="rgba(0,0,0,0.2)" strokeWidth="0.75" />
              <line x1="9" y1="3" x2="6" y2="9" stroke="rgba(0,0,0,0.2)" strokeWidth="0.75" />
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
            Topic
          </p>
          <div
            className="rounded-lg p-3 text-sm text-[var(--text-secondary)] leading-relaxed"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5)',
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
              background: 'rgba(0,0,0,0.03)',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <LoadingSpinner size={13} />
            <span className="text-xs text-[var(--text-muted)] animate-pulse-subtle">Analyzing system...</span>
          </div>
        )}

        {status === 'error' && (
          <div
            className="rounded-lg px-3 py-2.5 animate-fade-in"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.15)',
            }}
          >
            <p className="text-xs text-red-500">{errorMessage || 'An error occurred during analysis.'}</p>
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
              Add node
            </button>

            {showAddNode && (
              <div
                className="rounded-xl p-3 space-y-3 animate-slide-up"
                style={{
                  background: 'var(--glass-bg-strong)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                }}
              >
                <GlassInput
                  placeholder="Node name"
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
                          ? 'bg-black/8 text-[var(--text-primary)] border border-black/12'
                          : 'text-[var(--text-muted)] border border-transparent hover:text-[var(--text-secondary)] hover:bg-black/4'
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
                    Cancel
                  </button>
                  <GlassButton
                    variant="primary"
                    className="flex-1 text-[10px] py-1.5"
                    onClick={handleAddNode}
                  >
                    Add
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
              Node types
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
              ? 'Link copied!'
              : shareUrl
              ? 'Copy link'
              : 'Create share link'}
          </GlassButton>
        )}
      </div>
    </div>
  );
}
