const requests = new Map();

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

export function isRateLimited(ip) {
  const now = Date.now();
  const entry = requests.get(ip) || { count: 0, start: now };

  if (now - entry.start > WINDOW_MS) {
    requests.set(ip, { count: 1, start: now });
    return false;
  }

  if (entry.count >= MAX_REQUESTS) return true;

  requests.set(ip, { count: entry.count + 1, start: entry.start });
  return false;
}
