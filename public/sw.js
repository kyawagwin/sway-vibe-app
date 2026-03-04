const CACHE_NAME = 'sway-cache-v1';

const PRECACHE_URLS = [
    '/',
    '/manifest.json',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_URLS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
        }).then((cachesToDelete) => {
            return Promise.all(cachesToDelete.map((cacheToDelete) => {
                return caches.delete(cacheToDelete);
            }));
        }).then(() => self.clients.claim())
    );
});

// Stale-while-revalidate for /api/sway/vibe
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    if (url.pathname === '/api/sway/vibe') {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    const fetchPromise = fetch(event.request).then((networkResponse) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                    return cachedResponse || fetchPromise;
                });
            })
        );
        return;
    }

    // Network falling back to cache for other assets
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
