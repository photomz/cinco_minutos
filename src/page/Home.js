/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';

import SearchBar from '../component/SearchBar.js';
import ConjugationTable from '../component/ConjugationTable.js';
import { filterVerbs } from '../logic';
import conjugation from '../../server/server.js'; // delete this later

const accentButtons = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];
const icons = [
  'chess rook',
  'chess knight',
  'chess king',
  'chess bishop',
  'chess queen',
  'chess pawn',
];

const Home = () => {
  let [searchResults, setSearchResults] = useState([]);
  let [searchValue, setSearchValue] = useState('');
  let [isSearched, setIsSearched] = useState(false);
  let [conjResults, setConjResults] = useState({});

  const handleFilterResults = value => filterVerbs(value, 5);
  const handleSearchClick = value => {
    const result = conjugation(value);
    setIsSearched(!!result); // force to bool
    setConjResults(result);
  };
  const handleAccentClick = (e, accent) => setSearchValue(searchValue + accent);
  return (
    <div>
      <Grid textAlign="center" style={{ height: '70vh' }}>
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
              results={searchResults}
              setResults={setSearchResults}
              value={searchValue}
              setValue={setSearchValue}
            />
            <br />
            <Button.Group basic size="small" style={{ margin: '0 auto' }}>
              {accentButtons.map(elem => (
                <Button key={elem} onClick={e => handleAccentClick(e, elem)}>
                  {elem}
                </Button>
              ))}
            </Button.Group>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column style={{ maxWidth: 1000 }}>
            {conjResults.verb ? (
              <div>
                <Segment raised stacked padded>
                  <Header as="h2" content={conjResults.verb} textAlign="left" />
                  <Header as="h3" content={conjResults.definition} textAlign="left" />
                </Segment>
                <ConjugationTable
                  raised
                  stacked
                  icons={icons}
                  conjugation={conjResults.conjugation.slice(0, 6)}
                />
              </div>
            ) : (
              <Segment raised stacked padded>
                <Header as="h2" content="¡Vámos!" textAlign="left" />
              </Segment>
            )}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
