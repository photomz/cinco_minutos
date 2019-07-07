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
  e.waitUntil(
    fetch(info.SERVER_URL + '/SW_LS', {
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
            return cache;
          })
          .then(cache => {
            fetch(info.SERVER_URL + '/SW_allConj', {
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            })
              .then(res => res.json())
              .then(val => {
                verbs = val;
                verbKeys = Object.keys(verbs);
                estar = verbs['estar'].conjugation;
                haber = verbs['haber'].conjugation;
                return cache.put('conjugations', new Response(JSON.stringify(val)));
              });
            return cache;
          }),
      ),
  );
});
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  e.respondWith(
    caches.match(url.origin + '/' + url.pathname.split('/').pop()).then(res => {
      return res
        ? res
        : url.origin === info.SERVER_URL
        ? fetch(e.request).then(
            res => res,
            () =>
              url.pathname === '/conjugate'
                ? conjugate(url.searchParams.get('verb'))
                : new Response(),
          )
        : caches.match('/index.html');
    }),
  );
});
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
  .match('conjugations')
  .then(res => {
    if (!res) return null;
    return res.json();
  })
  .then(val => {
    if (!val) return;
    verbs = val;
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
