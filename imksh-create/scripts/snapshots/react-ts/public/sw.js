const CACHE_NAME = "React App";
const ASSETS = ["/", "/index.html", "/logo.png", "/manifest.json"];

// Install Event
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS);
      })
      .then(() => self.skipWaiting()),
  );
});

// Activate Event
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              return caches.delete(key);
            }
          }),
        );
      })
      .then(() => self.clients.claim()),
  );
});

// Fetch Event (Network First, fallback to cache)
self.addEventListener("fetch", (e) => {
  // Only handle GET requests and skip chrome-extension/dev-tools queries
  if (
    e.request.method !== "GET" ||
    !e.request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then((res) => {
        // Cache clone of successful network response
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, resClone);
        });
        return res;
      })
      .catch(() => caches.match(e.request)),
  );
});
