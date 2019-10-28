/* eslint-disable no-console */
/* eslint-disable no-useless-escape */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const he = require('he');
const compression = require('compression');
const gTrans = require('@vitalets/google-translate-api');
const info = require('../globals.json');

// .json files are standard, .json.min files are JSON minified with a UTF16 compression algorithm
const verbs = require('./static/verbs.json');
// All known verbs that have been pre-scraped for extra speed
const verbsMin = fs.readFileSync(path.join(__dirname, './static/verbs.json.min')).toString();
const headers = require('./static/headers.json'); // Needed to nice-ify the JSON
const webScrape = require('./webScrape'); // Live web scraping! Yay!
const search = require('./static/quickSearch.json');
// Quick search the verbs for search drop-down suggestions
const searchMin = fs.readFileSync(path.join(__dirname, './static/quickSearch.json.min')).toString();
const searchKeys = Object.keys(search);
const popularity = require('./static/popularity.json');
// Popularity stats for verbs
const popularityMin = fs
  .readFileSync(path.join(__dirname, './static/popularity.json.min'))
  .toString();
let { estar, haber } = verbs;
estar = estar.conjugation;
haber = haber.conjugation;

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));
const insertEnd = (arr, add) => arr.map(row => row.map(col => `${col.split(',')[0]} ${add}`));

// Copied from string-similarity
// Ignore rest of function - used to see how close two strings are
const cS = (first, second) => {
  first = first.replace(/\s+/g, '');
  second = second.replace(/\s+/g, '');
  if (!first.length && !second.length) return 1;
  if (!first.length || !second.length) return 0;
  if (first === second) return 1;
  if (first.length === 1 && second.length === 1) return 0;
  if (first.length < 2 || second.length < 2) return 0;
  const firstBigrams = new Map();
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

// Conjugates a verb
const conjugate = verb =>
  webScrape.getVerb(verb, verbs, result => {
    // Above line searches first in the verbs object for the verb, and if it doesnt find it it webscrapes from SD
    // Next line is escape hatch if web scraping failed, i.e. verb doesn't exist
    if (typeof result === 'undefined' || Object.keys(result).length === 0) return {};
    // We increase the popularity of the verb for better suggestions
    increasePopularity(verb);

    // 101arrowz: I don't really understand the rest of this part (photomz wrote it)
    const conj = result.conjugation;
    const fullConj = [
      ...conj.slice(0, 3), // Indicative, Subjunctive, Imperative
      insertEnd(estar[0], conj[3]), // Progressive
      insertEnd(haber[0], conj[4]), // Perfect
      insertEnd(haber[1], conj[4]), // Perfect Subjunctive
      ...conj.slice(3, 5), // Present + past Participle
    ];
    const formatted = headers
      .map(({ columns, ...props }, i) => ({
        ...props,
        body: transpose([columns].concat(fullConj[i])),
      })) // data into header format, transposed - row => cols, cols => rows
      .concat([
        { title: 'Present Participle', body: fullConj[6], columns: [] },
        { title: 'Past Participle', body: fullConj[7], columns: [] },
      ]); // add back

    // Verb metadata and conjugation returned to caller
    return {
      ...result,
      conjugation: formatted,
    };
  });

// This can be used in Array.sort to sort by popularity when we return suggestions to client-side
const sorter = (v1, v2) =>
  (popularity[v2] ? popularity[v2] : 0) - (popularity[v1] ? popularity[v1] : 0);

// Filter verbs (for suggestions)
const filterVerbs = (value, len) => {
  const startsWith = new RegExp(`^${value}`, 'i'); // match not case sensitive
  const contains = new RegExp(value, 'i');

  // Direct match first
  let results = searchKeys.includes(value) ? [value] : [];
  // Fairly self explanatory
  results = results.concat(searchKeys.filter(verb => startsWith.test(verb)));
  results.sort(sorter);
  let extraResults = [];
  if (results.length < len) {
    extraResults = searchKeys.filter(verb => contains.test(verb));
    extraResults.sort(sorter);
  }
  results = [...new Set(results.concat(extraResults))]; // Remove duplicates with Set
  const blankResults = [];

  // Some verbs actually don't have a definition, so we unconditionally put those at the end
  results = results.filter(val => {
    if (search[val] === '') {
      blankResults.push(val);
      return false;
    }
    return true;
  });

  // Concat just in case there's actually room for the blank results
  results = results.concat(blankResults).slice(0, len);
  results = results.map(verb => ({ title: verb, description: search[verb] }));
  return results;
};

// Increases the popularity of a verb with persistence
const increasePopularity = verb => {
  // Popularity scale because we already have a lot of data from the web, so how much do we value our actual user input?
  if (!popularity[verb]) popularity[verb] = info.POPULARITY_SCALE;
  else popularity[verb] += info.POPULARITY_SCALE;
  fs.writeFile(
    path.join(__dirname, './static/popularity.json'),
    JSON.stringify(popularity),
    err => {
      if (err) console.log(err);
    },
  );
};

// Google Translate live translation API
// VERY weird
const translate = (text, fromEs, exact = false) => {
  // Self explanatory options mostly - if no fromEs is provided, then translate
  // from ANY language to english - we will force it to be one of spanish or english later
  // This allows GT to automatically pick the best language
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
  // It's against TOS to call this function but Google doesn't rate limit that much *shrugs*
  // It returns data in a weird format (this API is for the chrome extension), so we need
  // `he` to decode the HTML entities. Then we remove brackets that it puts around data.
  return gTrans(text, options).then(res => {
    // If we allowed Google to pick the from language...
    if (fromEs === undefined) {
      // Verify it's one of the desired languages
      if (res.from.iso === 'en' || res.from.iso === 'es') {
        return {
          val: res.text,
          correctedText: res.from.text.autoCorrected
            ? he.decode(res.from.text.value).replace(/[\[\]]/g, '') // Google translate API returns brackets around mistyped letters, must remove them
            : text,
          origLang: res.from.iso,
        };
      }
      // If it's NOT one of the desired languages, try spanish first with exact = false (can fallback to english)
      return translate(text, true, false);
    }
    // If google actually suggested we used the other one, then translate from the other one with exact = true (will not fallback)
    if (res.from.didYouMean && (res.from.iso === 'es' || res.from.iso === 'en'))
      return translate(text, res.from.iso === 'es', true);

    // If falling back to other language is okay, try the other possibility with exact = true
    if (!exact) {
      return translate(text, !fromEs, true).then(otherOpt => {
        // Compare strings to the original - sometimes, Google gets it wrong and it's literally identical
        // Whichever one is better is sent
        if (cS(otherOpt.val, text) < cS(res.text, text)) {
          return new Promise(r => r(otherOpt));
        }
        return new Promise(r =>
          r({
            val: res.text,
            correctedText: res.from.text.autoCorrected
              ? he.decode(res.from.text.value).replace(/[\[\]]/g, '') // Again, getting rid of brackets from API
              : text,
            origLang: fromEs ? 'es' : 'en',
          }),
        );
      });
    }
    // If it is exact, don't check the other option, go directly
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

// Creates an express app with all server routes.
// Mostly self-explanatory if you go to the variable/method it's calling
const createExpressApp = (secure = false) => {
  let app = express();
  app.use(compression()); // GZIP/deflate to make stuff smaller
  app.use(cors()); // CORS allows any domain to call it - not strictly necessary, but let's be nice :)
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
    translate(req.query.text)
      .then(v => res.json(v))
      .catch(() => res.status(500).json({}));
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
  if (secure) {
    app = require('https').createServer(
      {
        key: path.join(__dirname, '..', 'privkey.pem'),
        cert: path.join(__dirname, '..', 'cert.pem'),
      },
      app,
    );
  }
  return app;
};
const start = (secure = false) => {
  const app = createExpressApp(secure);
  app.listen(info.PORT);
};
if (!module.parent)
  start(47226, process.argv.includes('secure') || process.env.NODE_ENV === 'production');
module.exports = { start, createExpressApp };
