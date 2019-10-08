// eslint-disable-next-line
const LZString = (function() {
  var o = String.fromCharCode,
    i = {
      decompressFromUTF16: function(o) {
        return null == o
          ? ''
          : '' == o
          ? null
          : i._decompress(o.length, 16384, function(i) {
              return o.charCodeAt(i) - 32;
            });
      },
      _decompress: function(i, n, t) {
        var e,
          r,
          s,
          p,
          a,
          l,
          f,
          u = [],
          d = 4,
          c = 4,
          h = 3,
          v = '',
          w = [],
          m = { val: t(0), position: n, index: 1 };
        for (e = 0; 3 > e; e += 1) u[e] = e;
        for (s = 0, a = Math.pow(2, 2), l = 1; l != a; )
          (p = m.val & m.position),
            (m.position >>= 1),
            0 == m.position && ((m.position = n), (m.val = t(m.index++))),
            (s |= (p > 0 ? 1 : 0) * l),
            (l <<= 1);
        switch (s) {
          case 0:
            for (s = 0, a = Math.pow(2, 8), l = 1; l != a; )
              (p = m.val & m.position),
                (m.position >>= 1),
                0 == m.position && ((m.position = n), (m.val = t(m.index++))),
                (s |= (p > 0 ? 1 : 0) * l),
                (l <<= 1);
            f = o(s);
            break;
          case 1:
            for (s = 0, a = Math.pow(2, 16), l = 1; l != a; )
              (p = m.val & m.position),
                (m.position >>= 1),
                0 == m.position && ((m.position = n), (m.val = t(m.index++))),
                (s |= (p > 0 ? 1 : 0) * l),
                (l <<= 1);
            f = o(s);
            break;
          case 2:
            return '';
        }
        for (u[3] = f, r = f, w.push(f); ; ) {
          if (m.index > i) return '';
          for (s = 0, a = Math.pow(2, h), l = 1; l != a; )
            (p = m.val & m.position),
              (m.position >>= 1),
              0 == m.position && ((m.position = n), (m.val = t(m.index++))),
              (s |= (p > 0 ? 1 : 0) * l),
              (l <<= 1);
          switch ((f = s)) {
            case 0:
              for (s = 0, a = Math.pow(2, 8), l = 1; l != a; )
                (p = m.val & m.position),
                  (m.position >>= 1),
                  0 == m.position && ((m.position = n), (m.val = t(m.index++))),
                  (s |= (p > 0 ? 1 : 0) * l),
                  (l <<= 1);
              (u[c++] = o(s)), (f = c - 1), d--;
              break;
            case 1:
              for (s = 0, a = Math.pow(2, 16), l = 1; l != a; )
                (p = m.val & m.position),
                  (m.position >>= 1),
                  0 == m.position && ((m.position = n), (m.val = t(m.index++))),
                  (s |= (p > 0 ? 1 : 0) * l),
                  (l <<= 1);
              (u[c++] = o(s)), (f = c - 1), d--;
              break;
            case 2:
              return w.join('');
          }
          if ((0 == d && ((d = Math.pow(2, h)), h++), u[f])) v = u[f];
          else {
            if (f !== c) return null;
            v = r + r.charAt(0);
          }
          w.push(v), (u[c++] = r + v.charAt(0)), (r = v), 0 == --d && ((d = Math.pow(2, h)), h++);
        }
      },
    };
  return i;
})();
const info = require('../globals.json');
const CURR_CACHE = 'v1';
const headers = [
  {
    title: 'Indicative',
    headers: ['Present', 'Preterite', 'Imperfect', 'Conditional', 'Future'],
    columns: ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/ellas/Uds.'],
  },
  {
    title: 'Subjunctive',
    headers: ['Present', 'Imperfect (-ra)', 'Imperfect (-se)', 'Future'],
    columns: ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/ellas/Uds.'],
  },
  {
    title: 'Imperative',
    headers: ['Affirmative', 'Negative'],
    columns: ['tú', 'Ud.', 'nosotros', 'vosotros', 'Uds.'],
  },
  {
    title: 'Progressive',
    headers: ['Present', 'Preterite', 'Imperfect', 'Conditional', 'Future'],
    columns: ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/ellas/Uds.'],
  },
  {
    title: 'Perfect',
    headers: ['Present', 'Preterite', 'Past', 'Conditional', 'Future'],
    columns: ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/ellas/Uds.'],
  },
  {
    title: 'Perfect Subjunctive',
    headers: ['Present', 'Past (-ra)', 'Past (-se)', 'Future'],
    columns: ['yo', 'tú', 'él/ella/Ud.', 'nosotros', 'vosotros', 'ellos/ellas/Uds.'],
  },
];
let verbs = {};
let verbKeys = [];
let estar = {};
let haber = {};
self.addEventListener('install', e => {
  e.waitUntil(prepareForOffline());
});
const prepareForOffline = () =>
  fetch('/pwa-precache.json', {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(res => res.json())
    .then(vals =>
      caches
        .open(CURR_CACHE)
        .then(cache => {
          vals;
          cache.addAll(vals.filter(el => el !== 'sw.js').map(el => '/' + el));
          return cache;
        })
        .then(cache => {
          fetch(info.SERVER_URL + '/suggestAll_min', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'text/plain',
            },
          })
            .then(res => res.text())
            .then(val => cache.put(info.SERVER_URL + '/suggestAll_min', new Response(val)));
          return cache;
        })
        .then(cache => {
          fetch(info.SERVER_URL + '/popularity_min', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'text/plain',
            },
          })
            .then(res => res.text())
            .then(val => cache.put(info.SERVER_URL + '/popularity_min', new Response(val)));
          return cache;
        })
        .then(cache => {
          fetch(info.SERVER_URL + '/SW_allConj_min', {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'text/plain',
            },
          })
            .then(res => res.text())
            .then(val => {
              verbs = JSON.parse(LZString.decompressFromUTF16(val));
              verbKeys = Object.keys(verbs);
              estar = verbs['estar'].conjugation;
              haber = verbs['haber'].conjugation;
              return cache.put(info.SERVER_URL + '/SW_allConj_min', new Response(val));
            });
          return cache;
        }),
    );
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  e.respondWith(
    caches.match(e.request).then(res => {
      return !res
        ? url.origin === info.SERVER_URL
          ? fetch(e.request).then(
              res => res,
              () =>
                url.pathname === '/conjugate'
                  ? conjugate(url.searchParams.get('verb'))
                  : new Response(),
            )
          : caches.match('/index.html').then(val => (val ? val : fetch(e.request)))
        : res;
    }),
  );
});
self.addEventListener('message', e => {
  e.waitUntil(
    messageCallback(e).then(p => {
      let message = 'OK';
      if (Array.isArray(p)) {
        message = p[0];
        p = p[1];
      }
      e.ports[0].postMessage(message);
      return p;
    }),
  );
});
const messageCallback = e => {
  const data = JSON.parse(e.data);
  if (data.type === 'offline') {
    if (data.value) {
      return caches
        .open(CURR_CACHE)
        .then(cache => cache.keys())
        .then(res => {
          if (res.length <= 3) return prepareForOffline();
          return new Promise(r => r(null));
        });
    } else if (data.value !== undefined) {
      return clearCache(false);
    } else {
      return caches
        .open(CURR_CACHE)
        .then(cache => cache.keys())
        .then(keys => [keys.length > 3, null]);
    }
  }
  return new Promise(r => r(null));
};
self.addEventListener('activate', e => {
  e.waitUntil(clearCache());
});
const clearCache = (keepCurrCache = true) =>
  caches.keys().then(names =>
    Promise.all(
      names.map(cacheName => {
        if (cacheName !== CURR_CACHE || !keepCurrCache) {
          return caches.delete(cacheName);
        }
      }),
    ),
  );
// Copied from string-similarity
const cS = (first, second) => {
  first = first.replace(/\s+/g, '');
  second = second.replace(/\s+/g, '');
  if (!first.length && !second.length) return 1;
  if (!first.length || !second.length) return 0;
  if (first === second) return 1;
  if (first.length === 1 && second.length === 1) return 0;
  if (first.length < 2 || second.length < 2) return 0;
  let firstBigrams = new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substr(i, 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
    firstBigrams.set(bigram, count);
  }
  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substr(i, 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }
  return (2.0 * intersectionSize) / (first.length + second.length - 2);
};
caches
  .match(info.SERVER_URL + '/SW_allConj_min')
  .then(res => {
    if (!res) return null;
    return res.text();
  })
  .then(val => {
    if (!val) return;
    verbs = JSON.parse(LZString.decompressFromUTF16(val));
    verbKeys = Object.keys(val);
    estar = verbs['estar'].conjugation;
    haber = verbs['haber'].conjugation;
  });
const closestConj = str => {
  const literal = verbs[str];
  if (literal) return literal;
  const bySimilarity = verbKeys.map(el => cS(str, el));
  const maxSim = Math.max(...bySimilarity);
  if (maxSim > 0.5) return verbs[verbKeys[bySimilarity.indexOf(maxSim)]];
  return {};
};
const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));
const insertEnd = (arr, add) => arr.map(row => row.map(col => col.split(',')[0] + ' ' + add));
const conjugate = verb => {
  const result = closestConj(verb);
  if (Object.keys(result).length === 0) return new Response('{}');
  const conj = result.conjugation;
  const fullConj = [
    ...conj.slice(0, 3), // Indicative, Subjunctive, Imperative
    insertEnd(estar[0], conj[3]), // Progressive
    insertEnd(haber[0], conj[4]), // Perfect
    insertEnd(haber[1], conj[4]), // Perfect Subjunctive
    ...conj.slice(3, 5), // Present + past Participle
  ];
  let formatted = headers
    .map(({ columns, ...props }, i) => ({
      ...props,
      body: transpose([columns].concat(fullConj[i])),
    })) // data into header format, transposed - row => cols, cols => rows
    .concat([
      { title: 'Present Participle', body: fullConj[6], columns: [] },
      { title: 'Past Participle', body: fullConj[7], columns: [] },
    ]); // add back
  //console.log('formatted - ', formatted);
  return new Response(
    JSON.stringify({
      ...result,
      conjugation: formatted,
    }),
  );
};
