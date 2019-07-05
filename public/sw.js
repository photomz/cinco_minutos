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
      .then(res => res.map(el => '/' + el))
      .then(vals =>
        caches
          .open(CURR_CACHE)
          .then(cache => {
            cache.addAll(vals);
            return cache;
          })
          .then(cache => {
            fetch(info.SERVER_URL + '/suggestAll', {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            })
              .then(res => res.json())
              .then(val =>
                cache.put(info.SERVER_URL + '/suggestAll', new Response(JSON.stringify(val))),
              );
            return cache;
          })
          .then(cache => {
            fetch(info.SERVER_URL + '/popularity', {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            })
              .then(res => res.json())
              .then(val =>
                cache.put(info.SERVER_URL + '/popularity', new Response(JSON.stringify(val))),
              );
          }),
      ),
  );
});
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(res => {
      return res
        ? res
        : e.request.url.startsWith(info.SERVER_URL)
        ? fetch(e.request)
            .then(val =>
              caches.open(CURR_CACHE).then(cache => {
                cache.put(e.request.url, val.clone());
                return val;
              }),
            )
            .catch(err => console.log('ERROR:', err))
        : caches.match('/index.html');
    }),
  );
});
