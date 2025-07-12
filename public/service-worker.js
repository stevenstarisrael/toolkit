const CACHE_NAME = 'toolkit-cache-v1';
const OFFLINE_URL = '/';

const toCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/logo.png',
    // Add more static assets if needed
];

importScripts('/idb-keyval-iife.min.js');

async function checkAndNotifyReminders() {
  const reminders = await self.idbKeyval.get('reminders') || [];
  const now = Date.now();
  let updated = false;
  for (const rem of reminders) {
    const target = new Date(rem.datetime).getTime();
    if (!rem.notified && target <= now) {
      self.registration.showNotification(rem.name, { body: rem.description || undefined });
      // If repeating, update to next repeat time and set notified to false
      if (rem.repeat && rem.repeat !== 'none') {
        let next = new Date(rem.datetime);
        switch (rem.repeat) {
          case 'hourly': next.setHours(next.getHours() + 1); break;
          case 'daily': next.setDate(next.getDate() + 1); break;
          case 'weekly': next.setDate(next.getDate() + 7); break;
          case 'monthly': next.setMonth(next.getMonth() + 1); break;
          case 'yearly': next.setFullYear(next.getFullYear() + 1); break;
          case 'custom':
            if (rem.customUnit === 'seconds') next.setSeconds(next.getSeconds() + Number(rem.customValue));
            if (rem.customUnit === 'minutes') next.setMinutes(next.getMinutes() + Number(rem.customValue));
            if (rem.customUnit === 'hours') next.setHours(next.getHours() + Number(rem.customValue));
            if (rem.customUnit === 'days') next.setDate(next.getDate() + Number(rem.customValue));
            break;
        }
        rem.datetime = next.toISOString();
        rem.notified = false;
      } else {
        rem.notified = true;
      }
      updated = true;
    }
  }
  if (updated) {
    await self.idbKeyval.set('reminders', reminders);
  }
}

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(toCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        if ('periodicSync' in self.registration) {
            try {
                await self.registration.periodicSync.register('reminder-sync', { minInterval: 60 * 1000 });
            } catch (e) {}
        }
    })());
    self.clients.claim();
});

self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'reminder-sync') {
    event.waitUntil(checkAndNotifyReminders());
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('/time-counters') && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/time-counters');
      }
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    self.registration.showNotification(event.data.title, event.data.options);
  }
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