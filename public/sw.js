/* Nur service worker: offline app shell, cached static assets, cached API data. */
const VERSION = "v1";
const SHELL_CACHE = `nur-shell-${VERSION}`;
const STATIC_CACHE = `nur-static-${VERSION}`;
const API_CACHE = "nur-api-v1"; // shared with lib/api.ts
const AUDIO_CACHE = `nur-audio-${VERSION}`;

const SHELL_ROUTES = ["/", "/quran", "/quran/read", "/tracker", "/calendar"];
const SHELL_ASSETS = [
  "/manifest.json",
  "/icons/icon.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/apple-touch-icon.png",
];
const API_HOSTS = ["api.alquran.cloud", "api.aladhan.com"];
const AUDIO_HOSTS = ["everyayah.com", "cdn.islamic.network"];
const MAX_AUDIO_ENTRIES = 300;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll([...SHELL_ROUTES, ...SHELL_ASSETS]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([SHELL_CACHE, STATIC_CACHE, API_CACHE, AUDIO_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put(request, response.clone());
    return response;
  } catch (err) {
    const hit = (await cache.match(request, { ignoreSearch: !!fallbackUrl })) || (fallbackUrl && (await cache.match(fallbackUrl)));
    if (hit) return hit;
    throw err;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(request);
  if (hit) return hit;
  const response = await fetch(request);
  if (response.ok || response.type === "opaque") cache.put(request, response.clone());
  return response;
}

async function trimCache(cacheName, max) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i]);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  // Page navigations: fresh when online, cached shell when offline.
  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, SHELL_CACHE, url.pathname.startsWith("/quran/read") ? "/quran/read" : "/"));
    return;
  }

  // Hashed build assets and fonts never change: cache first.
  if (url.origin === self.location.origin && (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/"))) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // Quran text, prayer times, Hijri calendar.
  if (API_HOSTS.includes(url.hostname)) {
    event.respondWith(networkFirst(request, API_CACHE));
    return;
  }

  // Recitations: keep recently played ayahs for offline listening (range requests pass through).
  if (AUDIO_HOSTS.includes(url.hostname) && !request.headers.has("range")) {
    event.respondWith(
      cacheFirst(request, AUDIO_CACHE).then((res) => {
        trimCache(AUDIO_CACHE, MAX_AUDIO_ENTRIES);
        return res;
      }),
    );
    return;
  }

  // RSC payloads and other same-origin GETs.
  if (url.origin === self.location.origin) {
    event.respondWith(networkFirst(request, SHELL_CACHE));
  }
});
