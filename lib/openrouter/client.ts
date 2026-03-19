const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function chatCompletionStream(
  messages: ChatMessage[],
  maxTokens = 2500,
  model = 'google/gemini-2.0-flash-001'
): Promise<ReadableStream<string>> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'System Mapper',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
      stream: true,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const body = res.body!;
  const decoder = new TextDecoder();

  return new ReadableStream<string>({
    async start(controller) {
      const reader = body.getReader();
      let accumulated = '';
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split('\n')) {
            const trimmed = line.trim();
            if (!trimmed.startsWith('data:')) continue;
            const data = trimmed.slice(5).trim();
            if (data === '[DONE]') continue;
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content;
              if (token) {
                accumulated += token;
                controller.enqueue(accumulated);
              }
            } catch {
              // skip malformed lines
            }
          }
        }
      } finally {
        reader.releaseLock();
        controller.close();
      }
    },
  });
}

export async function chatCompletion(
  messages: ChatMessage[],
  maxTokens = 800,
  model = 'anthropic/claude-3.5-haiku'
): Promise<string> {
  const res = await fetch(`${OPENROUTER_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
      'X-Title': 'System Mapper',
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.3,
    }),
    signal: AbortSignal.timeout(90_000),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  const choice = data.choices?.[0];
  if (choice?.finish_reason === 'length') {
    throw new Error('AI response was truncated (max_tokens reached). Try a simpler prompt.');
  }
  const content = choice?.message?.content;
  if (!content) throw new Error('Empty response from OpenRouter');
  return content;
}
