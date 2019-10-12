/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import { checkOffline } from '../../updateSW.js';

import InputBar from './component/InputBar';
import ResultSegment from './component/ResultSegment';
import AccentButtons from '../../components/AccentButtons';
import { createBrowserHistory } from 'history';
import info from '../../../globals.json';
let oldLoad = setTimeout(() => {}, 0);
let history = createBrowserHistory();

let oldLoc = null;
const Translate = () => {
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

  return (
    <Grid textAlign="center" style={{ marginTop: '15vh' }}>
      <Grid.Row>
        <Grid.Column>
          <InputBar
            onSearch={onSearch}
            offline={offline}
            value={searchValue}
            setValue={setSearchValue}
          />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <AccentButtons searchValue={searchValue} setSearchValue={setSearchValue} />
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
