importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({
    debug: false
  });

  workbox.googleAnalytics.initialize();

  workbox.routing.setDefaultHandler(
    (args) => {
      if (args.event.request.method === 'GET') {
        return new workbox.strategies.NetworkFirst().handle(args);
      }
      return fetch(args.event.request);
    }
  );

  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:js|css|html)/g),
    new workbox.strategies.NetworkFirst()
  );

  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/g),
    new workbox.strategies.CacheFirst({
      cacheName: 'images',
      plugins: [
        new workbox.cacheableResponse.CacheableResponsePlugin({
          statuses: [0, 200],
        }),
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 60,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        }),
      ],
    })
  );
}
