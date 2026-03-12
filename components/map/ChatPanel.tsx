'use client';

import { useState, useRef, useEffect } from 'react';
import { useMapStore } from '@/hooks/useMapStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatPanel() {
  const projectId = useMapStore((s) => s.projectId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading || !projectId) return;

    const userMsg: Message = { role: 'user', content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch(`/api/projects/${projectId}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content, history }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Chat failed');
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err: unknown) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[var(--glass-border)] flex-shrink-0">
        <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">AI Assistant</p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">Chat about the current map</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="space-y-2 pt-2">
            {[
              'Are there missing feedback loops in this map?',
              'Explain the reinforcing loop R1',
              'Which lever has the highest leverage?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setInput(q)}
                className="w-full text-left text-xs px-3 py-2.5 rounded-lg transition-all duration-150 cursor-pointer border"
                style={{
                  color: 'var(--text-secondary)',
                  borderColor: 'var(--glass-border)',
                  background: 'var(--glass-bg)',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className="max-w-[85%] rounded-xl px-3 py-2.5 text-xs leading-relaxed"
              style={
                m.role === 'user'
                  ? {
                      background: '#2563eb',
                      color: '#ffffff',
                      borderRadius: '12px 12px 2px 12px',
                    }
                  : {
                      background: 'var(--glass-bg-strong)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--glass-border)',
                      borderRadius: '12px 12px 12px 2px',
                    }
              }
            >
              {m.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div
              className="px-3 py-2.5 rounded-xl flex items-center gap-2"
              style={{
                background: 'var(--glass-bg-strong)',
                border: '1px solid var(--glass-border)',
                borderRadius: '12px 12px 12px 2px',
              }}
            >
              <LoadingSpinner size={12} />
              <span className="text-xs text-[var(--text-muted)]">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-[var(--glass-border)] flex-shrink-0">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask about the map or request changes..."
            rows={2}
            className="flex-1 resize-none text-xs rounded-lg px-3 py-2 outline-none transition-all duration-150"
            style={{
              background: 'var(--glass-bg-strong)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-primary)',
            }}
          />
          <button
            onClick={send}
            disabled={loading || !input.trim()}
            className="px-3 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex-shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: '#2563eb',
              color: '#ffffff',
            }}
          >
            Send
          </button>
        </div>
        <p className="text-[10px] text-[var(--text-muted)] mt-1.5">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
