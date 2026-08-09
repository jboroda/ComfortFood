// Naive in-memory limiter — good enough for a single long-running process, but
// on Vercel each invocation can land on a different lambda instance so this
// map doesn't persist reliably across requests. Fine for a hackathon demo,
// would swap for Upstash/Redis if this ever needed to be airtight.
const requests = new Map();

const WINDOW_MS = 60_000; // 1 min rolling window
const MAX_REQUESTS = 5;

export function isRateLimited(ip) {
  const now = Date.now();
  const entry = requests.get(ip) || { count: 0, start: now };

  // window expired, start a fresh count
  if (now - entry.start > WINDOW_MS) {
    requests.set(ip, { count: 1, start: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  requests.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}
