// lib/rate-limit.ts
const rates = new Map<string, { count: number; reset: number }>();

export function isRateLimited(ip: string, limit: number = 10, windowMs: number = 60000) {
  const now = Date.now();
  const rate = rates.get(ip) || { count: 0, reset: now + windowMs };

  if (now > rate.reset) {
    rate.count = 0;
    rate.reset = now + windowMs;
  }

  rate.count++;
  rates.set(ip, rate);

  return rate.count > limit;
}

export function clearRateLimit(ip: string) {
  rates.delete(ip);
}
