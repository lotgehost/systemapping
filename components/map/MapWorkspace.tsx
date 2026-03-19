'use client';

import { useAutoSave } from '@/hooks/useAutoSave';
import LeftPanel from './LeftPanel';
import FlowCanvas from './FlowCanvas';
import DetailPanel from './DetailPanel';
import ChatPanel from './ChatPanel';
import { useMapStore } from '@/hooks/useMapStore';
import { useState, useEffect } from 'react';

interface MapWorkspaceProps {
  readOnly?: boolean;
}

export default function MapWorkspace({ readOnly = false }: MapWorkspaceProps) {
  const projectId = useMapStore((s) => s.projectId);
  const selectedNodeId = useMapStore((s) => s.selectedNodeId);
  const selectedEdgeId = useMapStore((s) => s.selectedEdgeId);
  const selectedLoop = useMapStore((s) => s.selectedLoop);
  const [shareUrl, setShareUrl] = useState<string | undefined>();
  const [rightTab, setRightTab] = useState<'chat' | 'detail'>('chat');

  useAutoSave();

  const hasSelection = !!(selectedNodeId || selectedEdgeId || selectedLoop);

  // Auto-switch to detail tab when something is selected
  useEffect(() => {
    if (hasSelection) setRightTab('detail');
  }, [hasSelection]);

  const handleShare = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ generate_slug: true }),
      });
      const data = await res.json();
      if (data.share_slug) {
        const url = `${window.location.origin}/share/${data.share_slug}`;
        setShareUrl(url);
        await navigator.clipboard.writeText(url);
      }
    } catch {
      // ignore
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--bg-primary)]">
      {/* Left panel */}
      <div
        className="flex-shrink-0 border-r border-[var(--glass-border)] relative z-10"
        style={{
          width: 'var(--panel-left)',
          background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          boxShadow: '1px 0 0 var(--glass-border)',
        }}
      >
        <LeftPanel readOnly={readOnly} onShare={handleShare} shareUrl={shareUrl} />
      </div>

      {/* Main canvas */}
      <div className="flex-1 overflow-hidden relative">
        <FlowCanvas readOnly={readOnly} />
      </div>

      {/* Right panel — always visible when not readOnly */}
      {!readOnly && (
        <div
          className="flex-shrink-0 border-l border-[var(--glass-border)] flex flex-col overflow-hidden"
          style={{
            width: 'var(--panel-right)',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          }}
        >
          {/* Tabs */}
          <div
            className="flex flex-shrink-0 border-b border-[var(--glass-border)]"
            style={{ background: 'var(--glass-bg)' }}
          >
            {(['chat', 'detail'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setRightTab(tab)}
                className="flex-1 py-3 text-[10px] font-semibold tracking-widest uppercase transition-all duration-150 cursor-pointer relative"
                style={{
                  color: rightTab === tab ? 'var(--text-primary)' : 'var(--text-muted)',
                  background: 'transparent',
                }}
              >
                {tab === 'chat' ? 'Chat' : 'Details'}
                {tab === 'detail' && hasSelection && (
                  <span
                    className="absolute top-2.5 right-4 w-1.5 h-1.5 rounded-full"
                    style={{ background: '#2563eb' }}
                  />
                )}
                {rightTab === tab && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    style={{ background: '#2563eb' }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="flex-1 overflow-hidden">
            {rightTab === 'chat' ? (
              <ChatPanel />
            ) : (
              hasSelection ? (
                <DetailPanel />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-xs text-[var(--text-muted)] text-center px-6">
                    Click a node or edge<br />to see details
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
