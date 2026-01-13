const CACHE_NAME = "whitenoise-v2";
const AUDIO_CACHE_NAME = "whitenoise-audio-v1";

const urlsToCache = [
    "/",
    "/index.html",
    "/manifest.json",
    "/favicon.ico",
    "/logo192.png",
    "/logo512.png",
];

// Install event - cache assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                console.log("Opened cache");
                return cache.addAll(urlsToCache);
            })
            .then(() => self.skipWaiting()),
    );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
    const cacheWhitelist = [CACHE_NAME, AUDIO_CACHE_NAME];
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (!cacheWhitelist.includes(cacheName)) {
                            console.log("Deleting old cache:", cacheName);
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
    const url = new URL(event.request.url);

    // Handle audio files with a separate cache strategy
    if (url.pathname.startsWith("/sounds/") && url.pathname.endsWith(".mp3")) {
        event.respondWith(
            caches.open(AUDIO_CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(event.request).then((networkResponse) => {
                        // Cache the audio file for offline use
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            }),
        );
        return;
    }

    // Handle other requests
    event.respondWith(
        caches
            .match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                return fetch(event.request).then((response) => {
                    // Don't cache non-successful responses or non-GET requests
                    if (
                        !response ||
                        response.status !== 200 ||
                        response.type !== "basic" ||
                        event.request.method !== "GET"
                    ) {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                    return response;
                });
            })
            .catch(() => {
                // Fallback for offline - return cached index.html for navigation requests
                if (event.request.mode === "navigate") {
                    return caches.match("/index.html");
                }
            }),
    );
});

// Handle background sync for timer persistence
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "TIMER_UPDATE") {
        // Store timer state for background processing
        self.timerEndTime = event.data.endTime;
    }
});
