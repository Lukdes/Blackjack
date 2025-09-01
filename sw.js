const CACHE = "bj-v3";
const CORE = ["index.html","manifest.webmanifest","sw.js","icon-192.png","icon-512.png","apple-touch-icon.png"];

self.addEventListener("install", e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
  );
  self.clients.claim();
});
self.addEventListener("fetch", e => {
  const req = e.request;
  const isHTML = req.mode === "navigate" || (req.headers.get("accept")||"").includes("text/html");
  if (isHTML) {
    e.respondWith(fetch(req).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(req).then(r => r || fetch(req)));
});
