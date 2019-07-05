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
      .then(res =>
        caches
          .open(CURR_CACHE)
          .then(cache => cache.addAll(res.map(el => info.SERVER_URL + '/' + el))),
      ),
  );
});
