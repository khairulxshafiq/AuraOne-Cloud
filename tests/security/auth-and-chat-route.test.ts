import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/chat/route';
import * as supabaseServer from '@/lib/supabase-server';
import { defaultChatRateLimiter } from '@/lib/security/rate-limiter';

describe('Chat API Route Security & Authentication (app/api/chat/route.ts)', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    defaultChatRateLimiter.reset();
  });

  it('rejects unauthenticated requests with HTTP 401', async () => {
    // Mock authenticateChatRequest returning null (no session)
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue(null);

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(401);

    const data = await response.json();
    expect(data.error.code).toBe('AUTH_REQUIRED');
    expect(data.error.message).toContain('Akses tidak sah');
    expect(response.headers.get('x-request-id')).toBeDefined();
  });

  it('rejects malformed JSON payloads with HTTP 400', async () => {
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue({
      id: 'user-valid-1',
      email: 'user@example.com',
    });

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: '{ this is invalid json',
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error.code).toBe('INVALID_INPUT');
    expect(data.error.message).toContain('JSON yang sah');
  });

  it('rejects empty messages with HTTP 400', async () => {
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue({
      id: 'user-valid-1',
      email: 'user@example.com',
    });

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: '   ' }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error.code).toBe('INVALID_INPUT');
  });

  it('rejects disallowed agent injection with HTTP 400', async () => {
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue({
      id: 'user-valid-1',
      email: 'user@example.com',
    });

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Hello',
        agent: 'EvilHackerAgent',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.error.message).toContain('tidak wujud dalam senarai sah');
  });

  it('allows authenticated users and returns SSE streaming response with x-request-id', async () => {
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue({
      id: 'user-valid-1',
      email: 'user@example.com',
    });

    const customReqId = 'custom-request-id-0123456789';
    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-request-id': customReqId,
      },
      body: JSON.stringify({
        message: 'Bagaimana sistem kredit berfungsi?',
        agent: 'Aura',
      }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toContain('text/event-stream');
    expect(response.headers.get('x-request-id')).toBe(customReqId);

    // Read first chunk from fallback stream
    const reader = response.body?.getReader();
    expect(reader).toBeDefined();
    if (reader) {
      const { done, value } = await reader.read();
      expect(done).toBe(false);
      const text = new TextDecoder().decode(value);
      expect(text).toContain('data: ');
    }
  });

  it('enforces rate limiting and returns HTTP 429 when threshold exceeded', async () => {
    vi.spyOn(supabaseServer, 'authenticateChatRequest').mockResolvedValue({
      id: 'rate-limited-user',
      email: 'user@example.com',
    });

    // Default rate limiter allows 20 req/min; send 21 requests
    for (let i = 0; i < 20; i++) {
      const req = new NextRequest('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: `Message ${i}` }),
      });
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 21st request must be blocked with 429
    const blockedReq = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Over quota message' }),
    });

    const blockedRes = await POST(blockedReq);
    expect(blockedRes.status).toBe(429);
    expect(blockedRes.headers.get('Retry-After')).toBeDefined();

    const data = await blockedRes.json();
    expect(data.error.code).toBe('RATE_LIMITED');
    expect(data.error.message).toContain('Had kekerapan permintaan telah dicapai');
  });
});

