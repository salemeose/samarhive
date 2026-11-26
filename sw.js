// samarHive service worker v2
// - app files (index.html, config.js, prep.js): network first (max 2.5 s), so updates show at once; cached copy when offline
// - icons and fonts: cache first, refreshed in the background
// - Google Apps Script (the data) is never cached
const V = 'samarhive-v2';
const SHELL = ['./', './index.html', './config.js', './prep.js', './manifest.webmanifest', './icon-192.png', './favicon-32.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || /(^|\.)(script\.google|googleusercontent)\.com$/.test(u.hostname)) return;
  const appFile = u.origin === location.origin && (e.request.mode === 'navigate' || /\/(index\.html|config\.js|prep\.js|sw\.js)?$/.test(u.pathname) || /\.(js|html)$/.test(u.pathname));
  if (appFile) {
    e.respondWith(caches.open(V).then(async c => {
      const net = fetch(e.request, { cache: 'no-store' }).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
      const timeout = new Promise(res => setTimeout(res, 2500));
      try { const r = await Promise.race([net, timeout]); if (r) return r; } catch (err) {}
      const hit = await c.match(e.request, { ignoreSearch: true }); return hit || net;
    }));
    return;
  }
  e.respondWith(caches.open(V).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok && (u.origin === location.origin || u.hostname.includes('fonts.g') || u.hostname.includes('cdn.shopify') || u.hostname.includes('samar.mr'))) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || net;
  }));
});
