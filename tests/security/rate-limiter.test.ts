import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRateLimiter } from '@/lib/security/rate-limiter';

describe('Rate Limiter (lib/security/rate-limiter)', () => {
  let limiter: MemoryRateLimiter;

  beforeEach(() => {
    // 3 requests allowed per 10 seconds for deterministic fast testing
    limiter = new MemoryRateLimiter(3, 10);
  });

  it('allows requests within threshold', async () => {
    const r1 = await limiter.check('user-123');
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(2);

    const r2 = await limiter.check('user-123');
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(1);

    const r3 = await limiter.check('user-123');
    expect(r3.allowed).toBe(true);
    expect(r3.remaining).toBe(0);
  });

  it('rejects requests exceeding limit with retry duration', async () => {
    await limiter.check('user-123');
    await limiter.check('user-123');
    await limiter.check('user-123');

    const blocked = await limiter.check('user-123');
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
    expect(blocked.resetSeconds).toBeGreaterThan(0);
    expect(blocked.resetSeconds).toBeLessThanOrEqual(10);
  });

  it('isolates rate limits per user key', async () => {
    await limiter.check('user-alice');
    await limiter.check('user-alice');
    await limiter.check('user-alice');

    // Alice is now blocked
    const aliceBlocked = await limiter.check('user-alice');
    expect(aliceBlocked.allowed).toBe(false);

    // Bob is fresh and allowed
    const bobResult = await limiter.check('user-bob');
    expect(bobResult.allowed).toBe(true);
    expect(bobResult.remaining).toBe(2);
  });
});

