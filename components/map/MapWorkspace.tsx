'use client';

import { useAutoSave } from '@/hooks/useAutoSave';
import LeftPanel from './LeftPanel';
import FlowCanvas from './FlowCanvas';
import DetailPanel from './DetailPanel';
import { useMapStore } from '@/hooks/useMapStore';
import { useState } from 'react';

interface MapWorkspaceProps {
  readOnly?: boolean;
}

export default function MapWorkspace({ readOnly = false }: MapWorkspaceProps) {
  const projectId = useMapStore((s) => s.projectId);
  const selectedNodeId = useMapStore((s) => s.selectedNodeId);
  const selectedEdgeId = useMapStore((s) => s.selectedEdgeId);
  const [shareUrl, setShareUrl] = useState<string | undefined>();

  useAutoSave();

  const hasSelection = !!(selectedNodeId || selectedEdgeId);

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

      {/* Right detail panel — slides in when something is selected */}
      {!readOnly && (
        <div
          className="flex-shrink-0 border-l border-[var(--glass-border)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            width: hasSelection ? 'var(--panel-right)' : '0px',
            background: 'linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-primary) 100%)',
          }}
        >
          {hasSelection && (
            <div className="w-[320px] h-full panel-enter">
              <DetailPanel />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
