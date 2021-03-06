/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { checkOffline } from '../updateSW.js';

import { InputBar, ResultSegment } from '../components/translate';
import { AccentButtons } from '../components/landing';

import info from '../../globals.json';

const Translate = () => {
  const { slug } = useParams();

  const [offline, setOffline] = useState(false);
  const [searchValue, setSearchValue] = useState(slug || '');
  const [result, setResult] = useState({});
  const [isSearched, setIsSearched] = useState(false);
  // idle || loading || invalid
  const [action, setAction] = useState('idle');

  console.log(action);

  const onSearch = (val, unfocused) => {
    if (result.val && val.toLowerCase() === result.val.toLowerCase()) return;
    if (val.length === 0) {
      setAction('idle');
      setIsSearched(false);
      return Promise.resolve(null);
    }
    if (unfocused) {
      setAction('idle');
      setIsSearched(true);
    } else setAction('loading');
    console.log(val);
    return fetch(`${info.SERVER_URL}/translate?text=${encodeURIComponent(val)}`)
      .then(res => res.json())
      .then(res => {
        setResult({ ...res, origPhrase: val });
        if (unfocused) {
          setSearchValue(res.correctedText);
        }
        if (Object.keys(res).length) {
          setAction('idle');
          setIsSearched(true);
        } else setAction('invalid');
      });
  };

  useEffect(() => {
    checkOffline().then(val => setOffline(val));
  }, []);
  useEffect(() => {
    if (slug) onSearch(slug, true);
  }, []);
  return (
    <Grid textAlign="center" style={{ marginTop: '15vh' }}>
      <Grid.Row>
        <InputBar
          onSearch={onSearch}
          offline={offline}
          value={searchValue}
          setValue={setSearchValue}
        />
      </Grid.Row>
      <Grid.Row>
        <AccentButtons searchValue={searchValue} setSearchValue={setSearchValue} />
      </Grid.Row>
      <Grid.Row>{isSearched && <ResultSegment content={result} action={action} />}</Grid.Row>
    </Grid>
  );
};

Translate.propTypes = {
  children: PropTypes.node,
};
export default Translate;
