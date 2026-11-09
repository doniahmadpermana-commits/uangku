// Naikkan versi ini setiap kali file aplikasi diubah supaya HP mengambil versi baru.
const CACHE = 'uangku-v2';
const ASSETS = [
  './', 'index.html', 'privasi.html', 'manifest.webmanifest', 'firebase-config.js',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'vendor/fonts/plus-jakarta-sans.woff2',
  'vendor/firebase/firebase-app.js', 'vendor/firebase/firebase-auth.js', 'vendor/firebase/firebase-firestore.js',
];

self.addEventListener('install', e => {
  // cache: 'reload' supaya tidak mengambil salinan lama dari cache HTTP browser.
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Halaman: network-first (update cepat masuk). Aset lain: langsung dari cache
// lalu diperbarui di belakang layar (stale-while-revalidate).
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('index.html', copy)); return res; })
        .catch(() => caches.match('index.html'))
    );
    return;
  }
  // Konfigurasi Firebase: network-first juga, supaya perubahan config langsung terpakai.
  if (new URL(req.url).pathname.endsWith('/firebase-config.js')) {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache' })
        .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }))
    );
    return;
  }
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then(res => { if (res.ok) c.put(req, res.clone()); return res; });
    if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
    return net;
  }));
});
