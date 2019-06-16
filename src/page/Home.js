/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment, Image, Label, Icon, Loader } from 'semantic-ui-react';

import SearchBar from '../component/SearchBar.js';
import ConjugationTable from '../component/ConjugationTable.js';
import { filterVerbs } from '../logic';
import spanishdictImage from '../spanishdict.png';
import wordreferenceImage from '../wordreference.png';

const SERVER_URL = 'http://localhost:3000';
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
const menuDefault = {
  as: 'img',
  style: { marginRight: 10, display: 'inline', height: '1.5em', width: '1.5em' },
};

const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [conjResults, setConjResults] = useState({});
  let [isSearched, setIsSearched] = useState(false);
  // action === idle || loading || verbCheck || addingCollection
  let [action, setAction] = useState('idle');

  const handleFilterResults = value => filterVerbs(value, 5);

  const handleSearchClick = value => {
    setIsSearched(false);
    setAction('loading');
    const params = {
      headers: {
        verb: value,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    };
    fetch(SERVER_URL + '/conjugate?verb=' + value, params)
      .then(res => res.json())
      .then(val => {
        setConjResults(val);
        setIsSearched(Boolean(Object.entries(val).length)); // force to bool
      })
      .catch(err => console.log(err));
    //const result = conjugation(value);
    setAction('idle');
  };

  const handleAccentClick = (e, accent) => {
    const cChar = searchValue.slice(-1);
    const nChar = toggleAccent[accentButtons.indexOf(accent)][cChar];
    //eslint-disable-next-line
    if (nChar) setSearchValue(searchValue.slice(0, -1) + nChar);
  };

  useEffect(() => {
    document.querySelector('#homeSearchInput').focus();
  }, [searchValue]);

  return (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header
            as="h1"
            content="ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰"
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
        <Grid.Column style={{ maxWidth: 1000 }} id="labelColumn">
          <Label
            onClick={() => setAction(action === 'verbCheck' ? 'idle' : 'verbCheck')}
            color={action === 'verbCheck' ? 'blue' : null}
            as="a"
          >
            <Icon name="pencil" size="large" />
            Verb Check
          </Label>
          <Label
            onClick={() => setAction(action === 'addingCollection' ? 'idle' : 'addingCollection')}
            color={action === 'addingCollection' ? 'blue' : null}
            as="a"
          >
            <Icon name="list" size="large" />
            Add To Collection
          </Label>
          <Label onClick={() => window.open(conjResults.spanishdictLink)} as="a">
            <Image {...menuDefault} src={spanishdictImage} className="menuImage" />
            SpanishDict
          </Label>
          <Label onClick={() => window.open(conjResults.wordreferenceLink)} as="a">
            <Image {...menuDefault} src={wordreferenceImage} className="menuImage" />
            WordReference
          </Label>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column style={{ maxWidth: '80vw' }}>
          <Segment raised stacked padded>
            {isSearched ? (
              <div>
                <Header as="h2" content={conjResults.verb} textAlign="left" />
                <Header as="h3" content={conjResults.definition} textAlign="left" />
              </div>
            ) : action === 'loading' ? (
              <Loader active content="Loading" inline="centered" />
            ) : (
              <Header as="h2" content="¡Vámos!" textAlign="left" />
            )}
          </Segment>
        </Grid.Column>
      </Grid.Row>
      {isSearched && (
        <Grid.Row>
          <Grid.Column style={{ maxWidth: '80vw' }}>
            <ConjugationTable
              raised
              stacked
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
