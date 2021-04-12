importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.1.1/workbox-sw.js');

if (workbox) {
  workbox.setConfig({
    debug: false
  });

  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:js|css|html)/g),
    new workbox.strategies.NetworkFirst()
  );

  workbox.routing.registerRoute(
    new RegExp(/.*\.(?:png|jpg|jpeg|svg|gif|webp)/g),
    new workbox.strategies.CacheFirst()
  );
} else {
  console.log(`No workbox on this browser 😬`);
}
