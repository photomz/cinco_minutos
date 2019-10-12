/* eslint-disable no-console */
import React, { useState, useEffect, useRef } from 'react';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import ConjugationContainer from '../../components/ConjugationContainer';
import OptionLabels from '../../components/OptionLabels';
import ResultSegment from '../../components/ResultSegment';
import filterVerbs from '../../helper/filterVerbs';

import './index.css';
import info from '../../../globals.json';
const accentButtons = ['´', '¨', '˜'];
const toggleAccent = [
  { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ú' },
  { ü: 'u', u: 'ü', ú: 'ü' },
  { ñ: 'n', n: 'ñ' },
];

const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [conjResults, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  let [placeholder, setPlaceholder] = useState('¡Vámos!');
  let [redirect, setRedirect] = useState(null);
  // action === idle || loading || verbCheck || addingCollection
  let [action, setAction] = useState('idle');
  const handleFilterResults = value => filterVerbs(value, 5);
  const fetchResults = value => {
    fetch(`${info.SERVER_URL}/conjugate?verb=${value}`, {
      headers: {
        verb: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then(res => res.json())
      .then(val => {
        value = decodeURI(value);
        if (Object.entries(val).length) setConjResults(val);
        else {
          setConjResults({ verb: value });
          setPlaceholder('Invalid verb "' + value + '"!');
        }
        setIsSearched(Boolean(Object.entries(val).length)); // force to bool
        setAction('idle');
      })
      .catch(err => console.log(err));
  };
  const handleSearchClick = value => {
    value = decodeURI(value);
    value = value.toLowerCase();
    if (value === conjResults.verb) return;
    setIsSearched(false);
    setAction('loading');
    setPlaceholder('Loading...');
    fetchResults(encodeURI(value));
    setSearchValue(value);
  };
  const handleAccentClick = (e, accent) => {
    const cChar = searchValue.slice(-1);
    const nChar = toggleAccent[accentButtons.indexOf(accent)][cChar];
    if (nChar) {
      setSearchValue(prev => prev.slice(0, -1) + nChar);
    }
  };
  return (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            content={'ℭ𝔦𝔫𝔠𝔬\n𝔐𝔦𝔫𝔲𝔱𝔬𝔰'}
            textAlign="center"
            style={{ fontSize: '4em', marginTop: '2em', marginBottom: '0.5em' }}
          />
          <SearchBar
            onFilterResults={handleFilterResults}
            onSearchClick={handleSearchClick}
            value={searchValue}
            setValue={setSearchValue}
            aria-label="search"
            autoFocus
          />
          <br />
          <Button.Group basic size="mini" style={{ margin: '0 auto' }}>
            {accentButtons.map(elem => (
              <Button key={elem} onClick={e => handleAccentClick(e, elem)}>
                {elem}
              </Button>
            ))}
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: '80vw' }}>
          <Segment.Group raised>
            <OptionLabels
              action={action}
              setAction={setAction}
              verb={conjResults.verb}
              disabled={!isSearched}
              id="labelColumn"
            />
            <ResultSegment
              action={action}
              verb={conjResults.verb}
              def={conjResults.definition}
              isSearched={isSearched}
              unsearchedVal={placeholder}
              presentPart={conjResults.conjugation ? conjResults.conjugation[6].body : ''}
              pastPart={conjResults.conjugation ? conjResults.conjugation[7].body : ''}
            />
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
      {isSearched && (
        <Grid.Row>
          <Grid.Column style={{ maxWidth: '80vw' }}>
            <ConjugationContainer raised conjugation={conjResults.conjugation.slice(0, 6)} />
          </Grid.Column>
        </Grid.Row>
      )}
    </Grid>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};
export default Home;
