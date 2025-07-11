const CACHE_NAME = 'toolkit-cache-v1';
const OFFLINE_URL = '/';

const toCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/logo.png',
    // Add more static assets if needed
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const { request } = event;
    if (request.method !== 'GET') return;
    if (request.headers.get('accept')?.includes('text/html')) {
        // Network first for HTML
        event.respondWith(
            fetch(request)
                .then(response => {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                    return response;
                })
                .catch(() => caches.match(request).then(r => r || caches.match(OFFLINE_URL)))
        );
    } else {
        // Cache first for static
        event.respondWith(
            caches.match(request).then(
                cached =>
                    cached || fetch(request).then(response => {
                        const copy = response.clone();
                        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
                        return response;
                    })
            )
        );
    }
}); 