/* eslint-disable no-console */
const info = require('../../../globals.json');
let popularity = {};
let searchObj = {};
let searchKeys = Object.keys(searchObj);
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
fetch(info.SERVER_URL + '/suggestAll', {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})
  .then(val => {
    fetch(info.SERVER_URL + '/popularity', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(obj => (popularity = obj));
    return val.json();
  })
  .then(v => {
    searchObj = v;
    searchKeys = Object.keys(searchObj);
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
