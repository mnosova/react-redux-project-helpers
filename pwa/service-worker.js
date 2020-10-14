'use strict';

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
  offline: 'offline-v' + CACHE_VERSION
};
const OFFLINE_URL = '/static/offline.html';

function createCacheBustedRequest(url) {
  const request = new Request(url, { cache: 'reload' });
  if ('cache' in request) {
    return request;
  }

  // If {cache: 'reload'} didn't have any effect, append a cache-busting URL parameter instead.
  const bustedUrl = new URL(url, self.location.href);
  bustedUrl.search += (bustedUrl.search ? '&' : '') + 'cachebust=' + Date.now();
  return new Request(bustedUrl);
}

self.addEventListener('install', event => {
  event.waitUntil(
    fetch(createCacheBustedRequest(OFFLINE_URL)).then(function(response) {
      return caches.open(CURRENT_CACHES.offline).then(function(cache) {
        return cache.put(OFFLINE_URL, response);
      });
    })
  );
});

self.addEventListener('activate', event => {
  const expectedCacheNames = Object.keys(CURRENT_CACHES).map(function(key) {
    return CURRENT_CACHES[key];
  });

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (expectedCacheNames.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'GET' &&
      event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.log(error);
        return caches.match(OFFLINE_URL);
      })
    );
  }
});
