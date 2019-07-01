/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const https = require('https');
const parser = require('node-html-parser');
const getVerbSD = verb => {
  const SDURL = 'https://www.spanishdict.com/conjugate/' + verb;
  return new Promise((resolve, reject) => {
    https.get(SDURL, res => {
      let data = '';
      if (res.statusCode !== 200) {
        if (res.statusCode == 302) {
          reject("can't conjugate " + '"' + verb + '"');
        } else {
          reject('error ' + res.statusCode);
        }
        return;
      } else {
        res.on('data', f => {
          data += f;
        });
        res.on('end', () => {
          resolve(data);
        });
      }
    });
  })
    .then(data => {
      /* eslint-disable-next-line */
      document = parser.parse(data);
      if (document.querySelector('#headword-en')) {
        const forwardVerb = document.querySelector('#quickdef1-en a');
        if (forwardVerb) {
          return getVerbSD(forwardVerb.innerHTML);
        }
        throw new Error('could not convert "' + verb + '" to a spanish verb');
      }
      const def = document
        .querySelectorAll('#headword-and-quickdefs-es a')
        .filter(el => !el.rawAttrs.includes('aria-label'))
        .map(el => el.innerHTML)
        .join(', ');
      const n = document
        .querySelectorAll('.vtable-word-text')
        .map(el =>
          el.childNodes.length > 1
            ? el.childNodes.map(el2 => (el2.rawText ? el2.rawText : el2.innerHTML)).join('')
            : el.innerHTML,
        );
      const reflexive = n[0].slice(0, 3) == 'me ';
      const [presPart, pastPart] = document
        .querySelectorAll('.conj-basic-word')
        .map(el =>
          el.childNodes.length > 1
            ? el.childNodes.map(el2 => (el2.rawText ? el2.rawText : el2.innerHTML)).join('')
            : el.innerHTML,
        );
      verb = document.querySelector('#headword-es').innerHTML + (reflexive ? 'se' : '');
      const allConj = [[[], [], [], [], []], [[], [], [], []], [[], []], presPart, pastPart];
      for (let i = 0; i < 64; i++) {
        if (i < 30) {
          allConj[0][i % 5].push(n[i]);
        } else if (i < 54) {
          allConj[1][(i - 30) % 4].push(n[i]);
        } else {
          allConj[2][(i - 54) % 2].push(n[i]);
        }
      }
      return {
        verb: verb,
        definition: def,
        reflexive: reflexive,
        conjugation: allConj,
      };
    })
    .catch(e => console.log(e));
};
const getVerb = verb => {
  // TODO: add WordReference support
  return getVerbSD(verb);
};
/* eslint-disable-next-line */
module.exports.getVerb = (verb, cachedList, callback) => {
  return cachedList[verb]
    ? new Promise(r => r(cachedList[verb])).then(callback)
    : getVerb(verb).then(callback);
};
