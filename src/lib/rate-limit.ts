class TokenBucket {
  private tokens: number;
  private lastRefill: number;
  constructor(
    private capacity: number,
    private refillRate: number,
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }
  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
  consume(n: number = 1): boolean {
    this.refill();
    if (this.tokens >= n) {
      this.tokens -= n;
      return true;
    }
    return false;
  }
}

const buckets = new Map<string, TokenBucket>();

export async function rateLimit(key: string, limit: number, windowSec: number) {
  const bucket = buckets.get(key) ?? new TokenBucket(limit, limit / windowSec);
  buckets.set(key, bucket);
  const allowed = bucket.consume(1);
  return {
    allowed,
    remaining: Math.max(0, limit - 1),
    resetAt: Date.now() + windowSec * 1000,
    retryAfter: allowed ? 0 : windowSec,
  };
}
