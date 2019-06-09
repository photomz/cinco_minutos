/* eslint-disable no-console */
import search from './quickSearch.json';
import _ from 'lodash';

const searchKeys = Object.keys(search);

const filterVerbs = (value, len) => {
  const startsWith = new RegExp(_.escapeRegExp('^' + value), 'i'); // match not case sensitive
  const contains = new RegExp(_.escapeRegExp(value), 'i');

  let results = searchKeys.filter(verb => startsWith.test(verb));
  if (results.length < len)
    results = results.concat(searchKeys.filter(verb => contains.test(verb)));
  results = results.slice(0, len).map(verb => ({ title: verb, description: search[verb] }));
  return results;
};

export default filterVerbs;
