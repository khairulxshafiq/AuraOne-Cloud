import { describe, it, expect, vi } from 'vitest';
import { createSafeErrorResponse } from '@/lib/security/errors';
import { safeLogger } from '@/lib/logger';

describe('Safe Error Handling (lib/security/errors.ts)', () => {
  it('creates safe JSON error response with headers', async () => {
    const response = createSafeErrorResponse(
      429,
      'RATE_LIMITED',
      'Terlalu banyak permintaan. Sila cuba sebentar lagi.',
      'test-req-123',
      60,
    );

    expect(response.status).toBe(429);
    expect(response.headers.get('content-type')).toBe('application/json');
    expect(response.headers.get('x-request-id')).toBe('test-req-123');
    expect(response.headers.get('retry-after')).toBe('60');

    const body = await response.json();
    expect(body.error.code).toBe('RATE_LIMITED');
    expect(body.error.message).toBe('Terlalu banyak permintaan. Sila cuba sebentar lagi.');
    expect(body.error.requestId).toBe('test-req-123');
    expect(body.error.retryAfter).toBe(60);
  });

  it('creates error response without optional requestId and retryAfter', async () => {
    const response = createSafeErrorResponse(
      401,
      'AUTH_REQUIRED',
      'Log masuk diperlukan untuk meneruskan.',
    );

    expect(response.status).toBe(401);
    expect(response.headers.get('x-request-id')).toBeNull();
    expect(response.headers.get('retry-after')).toBeNull();

    const body = await response.json();
    expect(body.error.code).toBe('AUTH_REQUIRED');
    expect(body.error.requestId).toBeUndefined();
  });
});

describe('Safe Structured Logger (lib/logger.ts)', () => {
  it('logs info events via console.log', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    safeLogger.info('Test info event', { requestId: 'req-info-1', userId: 'usr-1' });

    expect(consoleSpy).toHaveBeenCalled();
    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.level).toBe('info');
    expect(logged.event).toBe('Test info event');
    expect(logged.requestId).toBe('req-info-1');
    expect(logged.userId).toBe('usr-1');
    expect(logged.timestamp).toBeDefined();

    consoleSpy.mockRestore();
  });

  it('logs warn events via console.warn', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    safeLogger.warn('Test warn event', {
      requestId: 'req-warn-1',
      statusCode: 429,
      errorCategory: 'RATE_LIMITED',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.level).toBe('warn');
    expect(logged.statusCode).toBe(429);

    consoleSpy.mockRestore();
  });

  it('logs error events via console.error', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    safeLogger.error('Test error event', {
      requestId: 'req-err-1',
      errorCategory: 'UPSTREAM_ERROR',
      errorDetail: 'Connection timeout',
    });

    expect(consoleSpy).toHaveBeenCalled();
    const logged = JSON.parse(consoleSpy.mock.calls[0][0]);
    expect(logged.level).toBe('error');
    expect(logged.errorCategory).toBe('UPSTREAM_ERROR');

    consoleSpy.mockRestore();
  });
});
