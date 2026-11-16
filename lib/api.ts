/**
 * Network-first JSON fetch with a Cache Storage fallback, so every API response the user
 * has seen once (Quran pages, prayer times, calendar months) keeps working offline,
 * independently of the service worker.
 */

const CACHE_NAME = "nur-api-v1";

export interface FetchResult<T> {
  data: T;
  fromCache: boolean;
}

export async function cachedJson<T>(url: string, opts: { timeoutMs?: number } = {}): Promise<FetchResult<T>> {
  const hasCache = typeof caches !== "undefined";
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 12000);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    if (hasCache) {
      try {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(url, res.clone());
      } catch {
        // Ignore quota errors.
      }
    }
    return { data: (await res.json()) as T, fromCache: false };
  } catch (err) {
    if (hasCache) {
      const hit = await caches.match(url);
      if (hit) return { data: (await hit.json()) as T, fromCache: true };
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
