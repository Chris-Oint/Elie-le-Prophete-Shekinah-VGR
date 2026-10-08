const CACHE_NAME = 'wmb-app-v4';   // v2 : nouvelle identité d’application (installation)
const CORE_PATHS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./manus-routes.json",
  "./js/part-001.js",
  "./js/part-002.js",
  "./js/part-003.js",
  "./js/part-004.js",
  "./js/part-005.js",
  "./js/part-006.js",
  "./js/part-007.js",
  "./js/part-008.js",
  "./js/part-009.js",
  "./js/part-010.js",
  "./js/part-011.js",
  "./js/part-012.js",
  "./js/part-013.js",
  "./js/part-014.js",
  "./js/part-015.js",
  "./js/part-016.js",
  "./js/part-017.js",
  "./js/part-018.js",
  "./js/part-019.js",
  "./js/part-020.js",
  "./js/part-021.js",
  "./js/part-022.js",
  "./js/part-023.js",
  "./js/part-024.js",
  "./data/brochures_z1.json.gz",
  "./data/brochures_z2.json.gz",
  "./data/brochures_z3.json.gz",
  "./data/brochures_z4.json.gz",
  "./data/brochures_z5.json.gz",
  "./assets/apple-touch-icon.png",
  "./assets/branham.jpg",
  "./assets/icon-192.png",
  "./assets/icon-32.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./assets/jesus.jpg",
  "./assets/portrait-cercle.jpg"
];
const urls = () => CORE_PATHS.map(path => new URL(path, self.registration.scope).href);
const isBrochureData = url => /\/data\/brochures_z\d+\.json\.gz$/.test(new URL(url).pathname);

async function status() {
  const cache = await caches.open(CACHE_NAME), all = urls();
  let count = 0;
  for (const url of all) if (await cache.match(url)) count++;
  return { count, total: all.length, complete: count === all.length };
}

async function tell(message) {
  const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  clients.forEach(client => client.postMessage(message));
}

// Update the application shell immediately. Reuse already-downloaded brochure
// files from the previous cache so an app update does not redownload ~50 MB.
// Missing brochure files are fetched when the user presses “Télécharger tous les textes”.
async function installShell() {
  const cache = await caches.open(CACHE_NAME);
  const oldCaches = await Promise.all((await caches.keys())
    .filter(key => key !== CACHE_NAME)
    .map(key => caches.open(key)));
  const missingShell = [];

  for (const url of urls()) {
    if (isBrochureData(url)) {
      // Les textes sont identiques d'une version à l'autre de l'application :
      // on les recopie au lieu d'imposer un retéléchargement de ~50 Mo.
      // S'ils sont absents, « Télécharger tous les textes » les récupère.
      continue;
    }
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) await cache.put(url, response.clone());
      else missingShell.push(url);
    } catch (_) {
      missingShell.push(url);
    }
  }
  // Keep the currently working worker if any shell file failed to update.
  if (missingShell.length) throw new Error('Application shell update was incomplete.');
}

async function fill(notify = false) {
  const cache = await caches.open(CACHE_NAME), all = urls();
  let done = 0;
  for (const url of all) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) await cache.put(url, response.clone());
    } catch (_) {}
    done++;
    if (notify) await tell({
      type: 'PROGRESS', done, total: all.length,
      text: `Préparation hors ligne… ${done} / ${all.length}`
    });
  }
  return status();
}

self.addEventListener('install', event =>
  event.waitUntil(installShell().then(() => self.skipWaiting()))
);

// Remove only this app's old caches. The sibling /plenitude/ PWA has its
// own service worker and cache, which must survive updates of this app.
self.addEventListener('activate', event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith('wmb-app-') && key !== CACHE_NAME).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));

self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE') return self.skipWaiting();
  if (event.data?.type === 'STATUS')
    return event.waitUntil(status().then(result => tell({ type: 'STATUS', ...result })));
  if (event.data?.type === 'DOWNLOAD')
    return event.waitUntil(fill(true).then(result => tell({ type: 'COMPLETE', ...result })));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME), hit = await cache.match(event.request);
    if (hit) return hit;
    try {
      const response = await fetch(event.request);
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate')
        return (await cache.match(new URL('./index.html', self.registration.scope).href)) || new Response('Hors connexion', { status: 503 });
      return new Response('Ressource indisponible hors connexion.', { status: 503 });
    }
  })());
});
