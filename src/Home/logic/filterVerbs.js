/* eslint-disable no-console */
import search from '../../static/quickSearch.json';
const searchKeys = Object.keys(search);
const info = require('../../../globals.json');
let popularity = {};
fetch(info.SERVER_URL + '/popularity')
  .then(res => res.json())
  .then(obj => (popularity = obj));
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
  results = [...new Set(results.concat(extraResults))].slice(0, len);
  results = results.map(verb => ({ title: verb, description: search[verb] }));
  return results;
};

export default filterVerbs;
