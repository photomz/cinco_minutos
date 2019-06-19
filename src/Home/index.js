/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import SearchBar from './component/SearchBar.js';
import ConjugationTable from './component/ConjugationTable.js';
import OptionLabels from './component/OptionLabels.js';
import ResultSegment from './component/ResultSegment.js';
import filterVerbs from './logic/filterVerbs.js';

import './index.css';
const history = createBrowserHistory();
const info = require('../../globals.json');
const accentButtons = ['´', '¨', '˜'];
const toggleAccent = [
  { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ú' },
  { ü: 'u', u: 'ü', ú: 'ü' },
  { ñ: 'n', n: 'ñ' },
];
const icons = [
  'chess rook',
  'chess knight',
  'chess king',
  'chess bishop',
  'chess queen',
  'chess pawn',
];
const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [conjResults, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  // action === idle || loading || verbCheck || addingCollection
  let [action, setAction] = useState('idle');
  const handleFilterResults = value => filterVerbs(value, 5);
  const fetchResults = value => {
    if (history.location.pathname === '/conjugate/' + value) {
      console.log('update');
      fetch(info.SERVER_URL + '/conjugate?verb=' + value, {
        headers: {
          verb: value,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      })
        .then(res => res.json())
        .then(val => {
          setConjResults(val);
          document.title =
            value.charAt(0).toUpperCase() +
            value.slice(1).toLowerCase() +
            ' Conjugation | CincoMinutos';
          setIsSearched(Boolean(Object.entries(val).length)); // force to bool
        })
        .catch(err => console.log(err));
    }
  };
  const handleSearchClick = value => {
    value = value.toLowerCase();
    if (value === conjResults.verb) return;
    setIsSearched(false);
    setAction('loading');
    if (value !== conjResults.verb) {
      fetchResults(value);
      document.title =
        value.charAt(0).toUpperCase() +
        value.slice(1).toLowerCase() +
        ' Conjugation | CincoMinutos';
      if (history.location.pathname !== '/conjugate/' + value && value) {
        history.push(history.location.pathname);
        history.replace('/conjugate/' + value);
        handleSearchClick(value);
      }
    }
    setSearchValue(value);
    setAction('idle');
  };
  useEffect(() => {
    if (['conjugate', 'conjugar'].indexOf(history.location.pathname.slice(1, 10)) > -1) {
      handleSearchClick(history.location.pathname.slice(11));
    }
    if (history.location.pathname === '/') {
      handleSearchClick('');
    }
  }, []);
  const handleAccentClick = (e, accent) => {
    const cChar = searchValue.slice(-1);
    const nChar = toggleAccent[accentButtons.indexOf(accent)][cChar];
    //eslint-disable-next-line
    if (nChar) {
      setSearchValue(searchValue.slice(0, -1) + nChar);
      document.querySelector('#homeSearchInput').focus();
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
              spanishdictLink={conjResults.spanishdictLink}
              wordreferenceLink={conjResults.wordreferenceLink}
              id="labelColumn"
            />
            <ResultSegment
              action={action}
              verb={conjResults.verb}
              def={conjResults.definition}
              isSearched={isSearched}
              presentPart={conjResults.conjugation ? conjResults.conjugation[6].body : ''}
              pastPart={conjResults.conjugation ? conjResults.conjugation[7].body : ''}
            />
          </Segment.Group>
        </Grid.Column>
      </Grid.Row>
      {isSearched && (
        <Grid.Row>
          <Grid.Column style={{ maxWidth: '80vw' }}>
            <ConjugationTable
              raised
              icons={icons}
              conjugation={conjResults.conjugation.slice(0, 6)}
            />
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
