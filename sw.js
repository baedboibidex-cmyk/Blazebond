const CACHE_NAME = 'bondly-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/firebase.js',
  '/navbar.js',
  '/profile.html',
  '/profile.js',
  '/matches.html',
  '/matches.js',
  '/chat.html',
  '/chat.js',
  '/status.html',
  '/status.js',
  '/games.html',
  '/premium.html',
  '/verify18.html',
  '/call.html',
  '/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
