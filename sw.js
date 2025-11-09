// Service Worker (sw.js)
const CACHE_NAME = 'sinyal-takip-cache-v1';
const urlsToCache = [
  'index.html',
  'manifest.json',
  'https://cdn.tailwindcss.com'
  // Buraya gelecekte eklenecek diğer varlıkları (CSS, JS, resimler) ekleyebilirsiniz.
];

// 1. Install (Yükleme) Aşaması: Cache'i oluştur ve dosyaları ekle
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache açıldı');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Fetch (Getirme) Aşaması: Önce cache'e bak, yoksa network'e git
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache'de varsa, cache'den döndür
        if (response) {
          return response;
        }
        // Cache'de yoksa, network'ten al
        return fetch(event.request);
      }
    )
  );
});

// 3. Activate (Aktifleştirme) Aşaması: Eski cache'leri temizle
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
