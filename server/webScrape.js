/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const https = require('https');
const parser = require('node-html-parser');
const fs = require('fs');
const popularityScale = require('../globals.json').POPULARITY_SCALE;

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
const getVerb = (verb, cachedList = {}, callback = () => null) => {
  // TODO: add WordReference support
  return cachedList[verb]
    ? new Promise(r => r(cachedList[verb])).then(callback)
    : getVerbSD(verb).then(callback);
};
const getAllVerbs = () => {
  const NUMTOGET = 0; // Entire database 15348
  let totalSum = NUMTOGET;

  return new Promise((resolve, reject) =>
    https.get('https://cooljugator.com/es/list/all', res => {
      if (res.statusCode !== 200) {
        reject(new Error('error ' + res.statusCode));
        return;
      } else {
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
const createPopularity = (max = 61) => {
  let popularity = {};
  try {
    popularity = require('./popularity.json');
  } catch (e) {
    popularity = {};
  }
  recursePromisePopularity(popularity, 0, max).then(val => {
    const minVal = Math.min(...Object.values(val));
    for (let v in val) {
      val[v] = Math.round((popularityScale * val[v]) / minVal);
    }
    fs.writeFileSync('./popularity.json', JSON.stringify(val));
  });
};
const recursePromisePopularity = (obj, num = 0, max = 61) => {
  if (num > max) {
    console.log('Finished!');
    return obj;
  }
  return getPopularity(obj, num).then(newObj => {
    console.log('Page ' + num + ' scraped');
    return recursePromisePopularity(newObj, num + 1, max);
  });
};
const getPopularity = (obj, num) => {
  return new Promise((resolve, reject) =>
    https.get('https://lingolex.com/verbs/popular_verbs.php?page=' + num, res => {
      if (res.statusCode !== 200) {
        reject(new Error('error ' + res.statusCode));
        return;
      }
      let page = '';
      res.on('data', c => {
        page += c;
      });
      res.on('end', () => resolve(page));
    }),
  ).then(data => {
    html = parser.parse(data);
    const allVerbs = [...html.querySelectorAll('td')].slice(7, 87);
    allVerbs.map((el, ind) => {
      if (ind % 4 === 1) {
        let val = parseInt(allVerbs[ind - 1].innerHTML);
        let elTXT = el.firstChild.innerHTML ? el.firstChild.innerHTML : el.innerHTML;
        if (!obj[elTXT]) obj[elTXT] = val;
        else obj[elTXT] += val;
      }
    });
    return obj;
  });
};
/* eslint-disable-next-line */
module.exports.getVerb = getVerb;
