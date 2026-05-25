type Entry = {
  count: number
  resetAt: number
}

const store = new Map<string, Entry>()

export function rateLimit(key: string, limit: number, ttlMs: number) {
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || entry.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + ttlMs })
    return { allowed: true, remaining: limit - 1 }
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterMs: entry.resetAt - now }
  }

  entry.count += 1
  return { allowed: true, remaining: limit - entry.count }
}
