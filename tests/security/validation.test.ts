import { describe, it, expect } from 'vitest';
import {
  validateChatPayload,
  MAX_MESSAGE_CONTENT_LENGTH,
  MAX_REQUEST_BODY_BYTES,
  MAX_MESSAGE_COUNT,
  DEFAULT_AGENT,
} from '@/lib/security/validation';

describe('Request Validation (lib/security/validation)', () => {
  it('accepts a valid message and defaults to Aura agent', () => {
    const result = validateChatPayload({ message: 'Bantu saya analisis strategi perniagaan.' });
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.message).toBe('Bantu saya analisis strategi perniagaan.');
      expect(result.data.agent).toBe(DEFAULT_AGENT);
      expect(result.data.hermesAgentId).toBe('aura');
      expect(result.data.sessionId).toBe('default');
    }
  });

  it('accepts all allowlisted agents and maps to Hermes identifier', () => {
    const agents = [
      ['Aura', 'aura'],
      ['Aura-Trade', 'aura-trade'],
      ['Aura-Pen', 'aura-pen'],
      ['Aura-Art', 'aura-art'],
      ['Aura-Scout', 'aura-scout'],
      ['Aura-Vision', 'aura-vision'],
    ] as const;

    for (const [agent, expectedHermesId] of agents) {
      const result = validateChatPayload({ message: 'Test', agent });
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.data.agent).toBe(agent);
        expect(result.data.hermesAgentId).toBe(expectedHermesId);
      }
    }
  });

  it('rejects an unlisted or malicious agent identifier with 400', () => {
    const result = validateChatPayload({
      message: 'Test',
      agent: 'Malicious-Injected-Agent',
    });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.code).toBe('INVALID_INPUT');
      expect(result.error).toContain('tidak wujud dalam senarai sah');
    }
  });

  it('rejects empty or whitespace-only messages with 400', () => {
    const emptyResult = validateChatPayload({ message: '' });
    expect(emptyResult.valid).toBe(false);
    if (!emptyResult.valid) {
      expect(emptyResult.status).toBe(400);
      expect(emptyResult.error).toContain('tidak boleh kosong');
    }

    const whitespaceResult = validateChatPayload({ message: '     ' });
    expect(whitespaceResult.valid).toBe(false);
  });

  it('rejects an oversized message (>4000 characters) with 413', () => {
    const oversizedMessage = 'A'.repeat(MAX_MESSAGE_CONTENT_LENGTH + 1);
    const result = validateChatPayload({ message: oversizedMessage });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(413);
      expect(result.code).toBe('PAYLOAD_TOO_LARGE');
    }
  });

  it('rejects total request body exceeding 64KB with 413', () => {
    const result = validateChatPayload(
      { message: 'Hello' },
      MAX_REQUEST_BODY_BYTES + 1
    );
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(413);
      expect(result.code).toBe('PAYLOAD_TOO_LARGE');
    }
  });

  it('rejects non-object or array input with 400', () => {
    expect(validateChatPayload(null).valid).toBe(false);
    expect(validateChatPayload('plain string').valid).toBe(false);
    expect(validateChatPayload([1, 2, 3]).valid).toBe(false);
  });

  it('validates multi-turn message history with valid roles', () => {
    const payload = {
      messages: [
        { role: 'user', content: 'Hai' },
        { role: 'assistant', content: 'Hai! Ada apa yang boleh saya bantu?' },
        { role: 'user', content: 'Ceritakan tentang Sakluma.' },
      ],
      agent: 'Aura-Pen',
    };

    const result = validateChatPayload(payload);
    expect(result.valid).toBe(true);
    if (result.valid) {
      expect(result.data.message).toBe('Ceritakan tentang Sakluma.');
      expect(result.data.history?.length).toBe(3);
    }
  });

  it('rejects message history with invalid roles', () => {
    const payload = {
      messages: [
        { role: 'hacker_role', content: 'Test' },
      ],
    };
    const result = validateChatPayload(payload);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.error).toContain('tidak dibenarkan');
    }
  });

  it('rejects message history with excessive message count', () => {
    const messages = Array.from({ length: MAX_MESSAGE_COUNT + 1 }, (_, i) => ({
      role: 'user' as const,
      content: `Message ${i}`,
    }));

    const result = validateChatPayload({ messages });
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.status).toBe(400);
      expect(result.error).toContain('melebihi had maksimum');
    }
  });
});

