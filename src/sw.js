const cacheName = 'charge-pro-cache-v2'; // <--- 1. UPDATE THE CACHE NAME (Version Bump!)
const assetsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png',
  // Note: Your HTML uses inline <style> and <script>, so we'll remove references
  // to external 'style.css' and 'script.js' unless you plan to separate them.
];

// Install Service Worker and cache assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log('Service Worker caching new assets');
      return cache.addAll(assetsToCache).catch(error => {
        console.error('Failed to cache assets:', error);
      });
    })
  );
});

// Activate the Service Worker and clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  const cacheWhitelist = [cacheName]; // Only keep the current version
  
  event.waitUntil(
    // 2. Clear old caches
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(name => {
          if (cacheWhitelist.indexOf(name) === -1) {
            console.log('Service Worker deleting old cache:', name);
            return caches.delete(name); // Delete any cache that doesn't match the new cacheName
          }
        })
      );
    }).then(() => {
      // 3. Take control of clients immediately (optional but good for PWA updates)
      return self.clients.claim(); 
    })
  );
});

// Serve assets from cache, falling back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached asset if found, otherwise fetch from network
      return response || fetch(event.request);
    })
  );
});