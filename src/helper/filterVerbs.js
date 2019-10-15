/* eslint-disable no-console */
import lzString from 'lz-string';
import info from '../../globals.json';
let popularity = {};
let searchObj = {};
let searchKeys = Object.keys(searchObj);
const serviceWorkerExists = !!('serviceWorker' in navigator && navigator.serviceWorker.controller);
let search = (v, len) =>
  fetch(info.SERVER_URL + '/suggest?verb=' + v + '&num=' + len, {
    headers: {
      verb: v,
      num: len,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })
    .then(res => res.json())
    .then(obj => [obj, false]);
if (serviceWorkerExists) localStorage.clear();
if (serviceWorkerExists) console.log('Service worker active! Offline functionality avaialable.');
const searchObjLS = localStorage.getItem('suggestions');
const popularityLS = localStorage.getItem('popularity');
(searchObjLS
  ? new Promise(r => {
      r(lzString.decompressFromUTF16(searchObjLS));
    })
  : fetch(info.SERVER_URL + '/suggestAll_min', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/plain',
      },
    })
)
  .then(val => {
    if (popularityLS) popularity = JSON.parse(lzString.decompressFromUTF16(popularityLS));
    else
      fetch(info.SERVER_URL + '/popularity_min', {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/plain',
        },
      })
        .then(res => res.text())
        .then(obj => {
          if (!serviceWorkerExists) {
            localStorage.setItem('popularity', obj);
          }
          popularity = JSON.parse(lzString.decompressFromUTF16(obj));
        });
    return val;
  })
  .then(v => {
    if (typeof v === 'object') {
      v.text().then(val => {
        if (!serviceWorkerExists) {
          localStorage.setItem('suggestions', val);
        }
        searchObj = JSON.parse(lzString.decompressFromUTF16(val));
        searchKeys = Object.keys(searchObj);
      });
    } else {
      searchObj = JSON.parse(v);
      searchKeys = Object.keys(searchObj);
    }
  });
const sorter = (v1, v2) =>
  (popularity[v2] ? popularity[v2] : 0) - (popularity[v1] ? popularity[v1] : 0);
const filterVerbs = (value, len) => {
  if (!searchKeys.length) return search(value, len);
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
    if (searchObj[val] === '') {
      blankResults.push(val);
      return false;
    } else {
      return true;
    }
  });
  results = results.concat(blankResults).slice(0, len);
  results = results.map(verb => ({ title: verb, description: searchObj[verb] }));
  return new Promise(r => {
    r([results, true]);
  });
};

export default filterVerbs;
