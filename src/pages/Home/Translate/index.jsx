/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import { checkOffline } from '../../updateSW.js';

import SearchBar from './component/SearchBar .js';
import ResultSegment from './component/ResultSegment .js';
import { createBrowserHistory } from 'history';
const info = require('../../globals.json');
let oldLoad = setTimeout(() => {}, 0);
let history = createBrowserHistory();
const accentButtons = ['´', '¨', '˜'];
const toggleAccent = [
  { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ú' },
  { ü: 'u', u: 'ü', ú: 'ü' },
  { ñ: 'n', n: 'ñ' },
];
let oldLoc = null;
const Translate = props => {
  let [offline, setOffline] = useState(false);
  let [searchValue, setSearchValue] = useState('');
  let [content, setContent] = useState({});
  let [action, setAction] = useState('hidden');
  checkOffline().then(val => setOffline(val));
  const onSearch = (val, unfocused) => {
    clearTimeout(oldLoad);
    if (content.val && val.toLowerCase() === content.val.toLowerCase()) return;
    if (val.length === 0) {
      setAction('hidden');
      return Promise.resolve(null);
    }
    if (unfocused) setAction('idle');
    else setAction('loading');
    console.log(val);
    return new Promise(resolve => {
      oldLoad = setTimeout(
        () =>
          resolve(
            fetch(info.SERVER_URL + '/translate?text=' + encodeURIComponent(val))
              .then(res => res.json())
              .then(res => {
                const valid = !!Object.keys(res).length;
                res['origPhrase'] = val;
                setContent(res);
                if (unfocused) {
                  setSearchValue(res.correctedText);
                  history.push('/translate/' + encodeURI(res.correctedText));
                }
                if (valid) setAction('idle');
                else setAction('invalid');
              }),
          ),
        unfocused ? 0 : 500,
      );
    });
  };
  const checkPath = location => {
    if (location === oldLoc) return;
    let desiredPart = location.pathname.split('/')[2] || '';
    desiredPart = decodeURI(desiredPart);
    setSearchValue(desiredPart);
    onSearch(desiredPart);
    oldLoc = location;
  };
  useEffect(() => checkPath(window.location), []);
  useEffect(history.listen(checkPath), []);
  const handleAccentClick = (e, accent) => {
    const cChar = searchValue.slice(-1);
    const nChar = toggleAccent[accentButtons.indexOf(accent)][cChar];
    //eslint-disable-next-line
    if (nChar) {
      setSearchValue(searchValue.slice(0, -1) + nChar);
      document.querySelector('#translateSearchInput').focus();
    }
  };
  return (
    <Grid textAlign="center" style={{ marginTop: '15vh' }}>
      <Grid.Row>
        <Grid.Column>
          <SearchBar
            onSearch={onSearch}
            offline={offline}
            value={searchValue}
            setValue={setSearchValue}
            id="translateSearchInput"
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Button.Group basic size="mini" style={{ margin: '0 auto' }}>
          {accentButtons.map(elem => (
            <Button key={elem} onClick={e => handleAccentClick(e, elem)}>
              {elem}
            </Button>
          ))}
        </Button.Group>
      </Grid.Row>
      <Grid.Row>
        <ResultSegment content={content} action={action} />
      </Grid.Row>
    </Grid>
  );
};

Translate.propTypes = {
  children: PropTypes.node,
};
export default Translate;
