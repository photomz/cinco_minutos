/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../component/SearchBar.js';
import { Header, Button, Grid } from 'semantic-ui-react';

const accentButtons = ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ'];

const Home = () => {
  let [searchResults, setSearchResults] = useState([]);
  let [searchValue, setSearchValue] = useState('');
  console.log(searchResults);
  //let [results, setResults] = useState([]);
  const handleFilterResults = (re, source) => {
    return source.filter(result => re.test(result.title));
  };
  const handleAccentClick = (e, accent) => {
    setSearchValue(searchValue + accent);
  };
  return (
    <div>
      <Grid textAlign="center" style={{ height: '100vh' }}>
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
        <Grid.Row />
      </Grid>
    </div>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
