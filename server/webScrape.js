/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const https = require('https');
const parser = require('node-html-parser');
const fs = require('fs');

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
      const html = parser.parse(data);
      if (html.querySelector('#headword-en')) {
        const forwardVerb = html.querySelector('#quickdef1-en a');
        if (forwardVerb) {
          return getVerbSD(forwardVerb.innerHTML);
        }
        throw new Error('could not convert "' + verb + '" to a spanish verb');
      }
      const def = html
        .querySelectorAll('#headword-and-quickdefs-es a')
        .filter(el => !el.rawAttrs.includes('aria-label'))
        .map(el => el.innerHTML)
        .join(', ');
      const n = html
        .querySelectorAll('.vtable-word-text')
        .map(el =>
          el.childNodes.length > 1
            ? el.childNodes.map(el2 => (el2.rawText ? el2.rawText : el2.innerHTML)).join('')
            : el.innerHTML,
        );
      const reflexive = n[0].slice(0, 3) == 'me ';
      const [presPart, pastPart] = html
        .querySelectorAll('.conj-basic-word')
        .map(el =>
          el.childNodes.length > 1
            ? el.childNodes.map(el2 => (el2.rawText ? el2.rawText : el2.innerHTML)).join('')
            : el.innerHTML,
        );
      verb = html.querySelector('#headword-es').innerHTML + (reflexive ? 'se' : '');
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
const getAllVerbs = () => {
  const NUMTOGET = 0; // Entire database 15348
  let totalSum = NUMTOGET;

  return new Promise((resolve, reject) =>
    https.get('https://cooljugator.com/es/list/all', res => {
      if (res.statusCode !== 200) throw new Error('error ' + res.statusCode);
      else {
        let data = '';
        res.on('data', c => {
          data += c;
        });
        res.on('end', () => resolve(data));
      }
    }),
  )
    .then(data => {
      const html = parser.parse(data);
      return html.querySelectorAll('.ui.segment.stacked ul .item a').map(el => el.innerHTML);
    })
    .then(allVerbs => {
      let currFile = {};
      let finished = 0;
      try {
        currFile = require('./verbs.json');
      } catch (e) {
        currFile = {};
      }
      try {
        const finishedJSON = require('./finished.json');
        finished = Number(finishedJSON['finished']);
      } catch (e) {
        finished = 0;
      }
      const minLength = finished;
      totalSum = minLength + NUMTOGET;
      allVerbs = allVerbs.slice(minLength, totalSum);
      return [recursePromiseConj(allVerbs, {}), currFile];
    })
    .then(vals => {
      const [allVerbsConj, currFile] = vals;
      allVerbsConj.then(allConj => {
        fs.writeFileSync('./verbs.json', JSON.stringify({ ...currFile, ...allConj }));
        fs.writeFileSync('./finished.json', JSON.stringify({ finished: totalSum }));
      });
    });
};
const addConj = (obj, verb) => {
  return getVerb(verb).then(conj => {
    obj[verb] = conj;
    return obj;
  });
};
const recursePromiseConj = (allVerbs, allVerbsConj, i = 0) => {
  if (allVerbs[i])
    return addConj(allVerbsConj, allVerbs[i]).then(newObj => {
      console.log('Conjugated ' + allVerbs[i]);
      return recursePromiseConj(allVerbs, newObj, i + 1);
    });
  console.log('Finished!');
  return allVerbsConj;
};
const createQuickSearch = obj => {
  Object.keys(obj).map(key => {
    obj[key] = obj[key]['definition'];
  });
  fs.writeFileSync('./quickSearch.json', JSON.stringify(obj));
};
/* eslint-disable-next-line */
module.exports.getVerb = (verb, cachedList, callback) => {
  return cachedList[verb]
    ? new Promise(r => r(cachedList[verb])).then(callback)
    : getVerb(verb).then(callback);
};
