/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const info = require('../globals.json');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const he = require('he');
const compression = require('compression');
const gTrans = require('@vitalets/google-translate-api');

const verbs = require('./static/verbs.json');
// eslint-disable-next-line
const verbsMin = fs.readFileSync(path.join(__dirname, './static/verbs.json.min')).toString();
//const fullSearch = require('./static/fullSearch.json');
const headers = require('./static/headers.json');
const webScrape = require('./webScrape');
const search = require('./static/quickSearch.json');
// eslint-disable-next-line
const searchMin = fs.readFileSync(path.join(__dirname, './static/quickSearch.json.min')).toString();
const searchKeys = Object.keys(search);
// eslint-disable-next-line
let popularity = require('./static/popularity.json');
// eslint-disable-next-line
const popularityMin = fs
  .readFileSync(path.join(__dirname, './static/popularity.json.min'))
  .toString();
let { estar, haber } = verbs;
estar = estar.conjugation;
haber = haber.conjugation;

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));
const insertEnd = (arr, add) => arr.map(row => row.map(col => col.split(',')[0] + ' ' + add));

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

const conjugate = verb =>
  webScrape.getVerb(verb, verbs, result => {
    if (typeof result === 'undefined' || Object.keys(result).length === 0) return {};
    increasePopularity(verb);

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
    return {
      ...result,
      conjugation: formatted,
    };
  });
const sorter = (v1, v2) =>
  (popularity[v2] ? popularity[v2] : 0) - (popularity[v1] ? popularity[v1] : 0);
const filterVerbs = (value, len) => {
  const startsWith = new RegExp('^' + value, 'i'); // match not case sensitive
  const contains = new RegExp(value, 'i');

  let results = searchKeys.includes(value) ? [value] : [];
  results = results.concat(searchKeys.filter(verb => startsWith.test(verb)));
  results.sort(sorter);
  let extraResults = [];
  if (results.length < len) {
    extraResults = searchKeys.filter(verb => contains.test(verb));
    extraResults.sort(sorter);
  }
  results = [...new Set(results.concat(extraResults))]; // Remove duplicates
  let blankResults = [];
  results = results.filter(val => {
    if (search[val] === '') {
      blankResults.push(val);
      return false;
    } else {
      return true;
    }
  });
  results = results.concat(blankResults).slice(0, len);
  results = results.map(verb => ({ title: verb, description: search[verb] }));
  return results;
};
const increasePopularity = verb => {
  if (!popularity[verb]) popularity[verb] = info.POPULARITY_SCALE;
  else popularity[verb] += info.POPULARITY_SCALE;
  fs.writeFile(
    // eslint-disable-next-line
    path.join(__dirname, './static/popularity.json'),
    JSON.stringify(popularity),
    err => {
      if (err) console.log(err);
    },
  );
};
const translate = (text, fromEs, exact = false) => {
  const options = fromEs
    ? {
        from: 'es',
        to: 'en',
      }
    : fromEs === undefined
    ? { to: 'en' }
    : {
        from: 'en',
        to: 'es',
      };
  return gTrans(text, options).then(res => {
    if (fromEs === undefined) {
      if (res.from.iso === 'en' || res.from.iso === 'es')
        return {
          val: res.text,
          correctedText: res.from.text.autoCorrected
            ? he.decode(res.from.text.value).replace(/[\[\]]/g, '')
            : text,
          origLang: res.from.iso,
        };
      return translate(text, true, false);
    }
    if (res.from.didYouMean && (res.from.iso === 'es' || res.from.iso === 'en'))
      return translate(text, res.from.iso === 'es' ? true : false, true);

    if (!exact) {
      return translate(text, !fromEs, true).then(otherOpt => {
        if (cS(otherOpt.val, text) < cS(res.text, text)) {
          return new Promise(r => r(otherOpt));
        }
        return new Promise(r =>
          r({
            val: res.text,
            correctedText: res.from.text.autoCorrected
              ? he.decode(res.from.text.value).replace(/[\[\]]/g, '')
              : text,
            origLang: fromEs ? 'es' : 'en',
          }),
        );
      });
    }
    return new Promise(r =>
      r({
        val: res.text,
        correctedText: res.from.text.autoCorrected
          ? he.decode(res.from.text.value).replace(/[\[\]]/g, '')
          : text,
        origLang: fromEs ? 'es' : 'en',
      }),
    );
  });
};
const createExpressApp = getDistDir => {
  let app = express();
  app.use(compression());
  app.use(cors());
  let distDir = getDistDir();
  fs.watch(path.join(__dirname, '../dist'), () => {
    distDir = getDistDir();
  });
  app.get('/', (req, res) => {
    res.send(
      'Cinco Minutos API - access /popularity for most popularly searched verbs, ' +
        'access /conjugate?verb=MYVERB to access conjugations in JSON, ' +
        'access /translate?text=MYTEXT to translate from EN to ES and vice versa.',
    );
  });

  app.get('/conjugate', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    if (!req.query.verb) {
      res.json({});
      return;
    }
    conjugate(req.query.verb).then(v => res.json(v));
  });

  app.get('/translate', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    if (!req.query.text) {
      res.json({});
      return;
    }
    translate(req.query.text).then(v => res.json(v));
  });

  app.get('/popularity', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.json(popularity);
  });

  app.get('/popularity_min', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.set('Content-Type', 'text/plain');
    res.send(popularityMin);
  });

  app.get('/suggest', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.json(filterVerbs(req.query.verb, req.query.num));
  });

  app.get('/suggestAll', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.json(search);
  });

  app.get('/suggestAll_min', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.set('Content-Type', 'text/plain');
    res.send(searchMin);
  });

  app.get('/SW_LS', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.json(distDir);
  });

  app.get('/SW_allConj', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.json(verbs);
  });

  app.get('/SW_allConj_min', (req, res) => {
    res.setHeader('access-control-allow-origin', '*');
    res.set('Content-Type', 'text/plain');
    res.send(verbsMin);
  });

  app.get('*', (req, res) => {
    res.redirect('/');
  });
  return app;
};
const start = (secure = false) => {
  const getDistDir = () => fs.readdirSync(path.join(__dirname, '..', 'dist'));
  let server = null;
  let app = createExpressApp(getDistDir);
  if (secure) {
    httpsOptions = {
      cert: fs.readFileSync(path.join(__dirname, '../cert.pem')),
      key: fs.readFileSync(path.join(__dirname, '../privkey.pem')),
    };
    server = https.createServer(httpsOptions, app);
  } else {
    server = http.createServer(app);
  }
  server.listen(info.PORT);
};
if (!module.parent) start(process.argv.includes('secure') || process.env.NODE_ENV === 'production');
module.exports = { start };
