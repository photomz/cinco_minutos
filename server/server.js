/* eslint-disable no-console */
const verbs = require('./data/verbs.json');
//const fullSearch = require('./data/fullSearch.json');
const headers = require('./data/headers.json');
let { estar, haber } = verbs;
estar = estar.conjugation;
haber = haber.conjugation;

const transpose = arr => arr[0].map((col, i) => arr.map(row => row[i]));
const insertEnd = (arr, add) => arr.map(row => row.map(col => col.split(',')[0] + ' ' + add));

const conjugate = verb => {
  //const query = fullSearch[verb];
  //if (typeof query === 'undefined') return null;
  const result = verbs[verb];
  if (typeof result === 'undefined') return {};
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
};

export default conjugate;
