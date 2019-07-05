const info = require('../globals.json');
const CURR_CACHE = 'v1';
self.addEventListener('install', e => {
  e.waitUntil(
    fetch(info.SERVER_URL + '/SW_LS', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(res => res.filter(el => !el.startsWith('sw.js')).map(el => '/' + el))
      .then(vals => caches.open(CURR_CACHE).then(cache => cache.addAll(vals))),
  );
});
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(res => {
      return res ? res : fetch(event.request);
    }),
  );
});
