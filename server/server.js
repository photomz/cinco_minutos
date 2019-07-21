/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const info = require('../globals.json');
const fs = require('fs');
const path = require('path');
const https = require('https');
const compression = require('compression');
const gTrans = require('@vitalets/google-translate-api');
let app = express();
app.use(compression());
app.use(cors());
app.use(bodyParser.json());

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
const getDistDir = () => fs.readdirSync(path.join(__dirname, '..', 'dist'));
let distDir = getDistDir();
fs.watch(path.join(__dirname, '../dist'), () => {
  distDir = getDistDir();
});
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
    : {
        from: 'en',
        to: 'es',
      };
  return gTrans(text, options).then(res => {
    if (res.text) return res;
    if (!exact) return translate(text, !fromEs, true);
    return {};
  });
};
app.get('/', (req, res) => {
  res.send(
    'Cinco Minutos API - access /popularity for most popularly searched verbs, access /conjugate?verb=MYVERB to access conjugations in JSON.',
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
/* Only use if SSL certificate exists 
httpsOptions = {
  cert: fs.readFileSync(path.join(__dirname, "../cert.pem")),
  key: fs.readFileSync(path.join(__dirname, "../privkey.pem"))
};
https.createServer(httpsOptions, app).listen(info.PORT);
*/
app.listen(info.PORT);
