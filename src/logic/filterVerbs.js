/* eslint-disable no-console */
import search from './quickSearch.json';
import _ from 'lodash';

const searchKeys = Object.keys(search);

const filterVerbs = (value, len) => {
  const startsWith = new RegExp('^' + value, 'i'); // match not case sensitive
  const contains = new RegExp(value, 'i');

  let results = searchKeys.includes(value) ? [value] : [];
  results = results.concat(searchKeys.filter(verb => startsWith.test(verb)));
  if (results.length < len)
    results = results.concat(searchKeys.filter(verb => contains.test(verb)));
  results = [...new Set(results)].slice(0, len);
  results = results.map(verb => ({ title: verb, description: search[verb] }));
  return results;
};

export default filterVerbs;
