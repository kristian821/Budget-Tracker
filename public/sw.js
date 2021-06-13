const FILES_TO_CACHE = ["./index.html"]
const APP_PREFIX = 'Budget Tracker - ';
const VERSION = 'v1.0.0';
const CACHE_NAME = APP_PREFIX + VERSION;
self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log(`Installing cache ${CACHE_NAME}`);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
})

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(keyList) {
            let cacheKeepList = keyList.filter(function (key) {
                return key.indexOf(APP_PREFIX);
            });
            cacheKeepList.push(CACHE_NAME);

            return Promise.all(keyList.map(function (key, i) {
                if (cacheKeepList.indexOf(key) === -1) {
                    console.log(`deleting cache ${keyList[i]}`);
                    return caches.delete(keyList[i]);
                }
            }));
        })
    );
})

self.addEventListener('fetch', function(e) {
    console.log(`fetch request ${e.request.url}`)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                return request;
            } else {
                return fetch(e.request);
            }
        })
    )
})