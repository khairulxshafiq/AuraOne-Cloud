export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
}

export interface IRateLimiter {
  check(key: string): Promise<RateLimitResult>;
}

interface RateLimitRecord {
  timestamps: number[];
}

/**
 * In-memory sliding window rate limiter.
 * Suitable for single-instance Node.js and testing environments.
 * For horizontally scaled multi-region production, an Upstash Redis or Vercel KV adapter
 * implements IRateLimiter.
 */
export class MemoryRateLimiter implements IRateLimiter {
  private readonly store: Map<string, RateLimitRecord> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;

  constructor(maxRequests = 20, windowSeconds = 60) {
    this.maxRequests = maxRequests;
    this.windowMs = windowSeconds * 1000;
  }

  async check(key: string): Promise<RateLimitResult> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    let record = this.store.get(key);
    if (!record) {
      record = { timestamps: [] };
      this.store.set(key, record);
    }

    // Filter out expired timestamps
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (record.timestamps.length >= this.maxRequests) {
      const oldest = record.timestamps[0];
      const resetSeconds = Math.max(1, Math.ceil((oldest + this.windowMs - now) / 1000));
      return {
        allowed: false,
        remaining: 0,
        resetSeconds,
      };
    }

    record.timestamps.push(now);
    const remaining = this.maxRequests - record.timestamps.length;
    const resetSeconds = Math.ceil(this.windowMs / 1000);

    return {
      allowed: true,
      remaining,
      resetSeconds,
    };
  }

  /**
   * Clears internal state (useful in test teardown).
   */
  reset(): void {
    this.store.clear();
  }
}

export const defaultChatRateLimiter = new MemoryRateLimiter(20, 60);
