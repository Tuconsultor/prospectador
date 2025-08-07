self.addEventListener('install', event => {
  console.log('Service Worker instalándose...');
});

self.addEventListener('activate', event => {
  console.log('Service Worker activándose...');
});

self.addEventListener('fetch', event => {
  // Estrategia de caché (opcional por ahora, pero clave para el offline real)
});