// Keeps the locked page on the phone after the first visit, so it still opens with a weak signal or none.
// Network first (so a new version always wins when there is signal), the saved copy after 4 seconds or offline.
const CACHE = 'mk3-v2';
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png'])).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const net = fetch(req, { cache: 'no-store' }).then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    const late = new Promise((r) => setTimeout(r, 4000));
    try {
      const first = await Promise.race([net, late]);
      if (first) return first;
    } catch (err) { /* no signal: fall through to the saved copy */ }
    const saved = await cache.match(req, { ignoreSearch: true }) || await cache.match('./index.html');
    return saved || net;
  })());
});
