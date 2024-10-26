const cacheName = 'charge-pro-cache-v1';
const assetsToCache = [
  './',
  './ChargePro.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  './style.css',  // Replace this with your actual CSS file if any
  './script.js'   // Replace this with your actual JS file
];

// Install Service Worker and cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Activate the Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker activated');
});

// Serve assets from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
