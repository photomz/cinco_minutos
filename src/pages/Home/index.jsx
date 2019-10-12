/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Button, Grid, Segment } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import ConjugationContainer from '../../components/ConjugationContainer';
import OptionLabels from '../../components/OptionLabels';
import ResultSegment from '../../components/ResultSegment';
import filterVerbs from '../../helper/filterVerbs';

import info from '../../../globals.json';
const accentButtons = ['´', '¨', '˜'];
const toggleAccent = [
  { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ú' },
  { ü: 'u', u: 'ü', ú: 'ü' },
  { ñ: 'n', n: 'ñ' },
];

const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [redirect, setRedirect] = useState(false);

  const handleFilterResults = value => filterVerbs(value, 5);

  const handleSearchClick = value => {
    setSearchValue(value);
    setRedirect(true);
  };

  const handleAccentClick = (e, accent) => {
    const cChar = searchValue.slice(-1);
    const nChar = toggleAccent[accentButtons.indexOf(accent)][cChar];
    if (nChar) {
      setSearchValue(prev => prev.slice(0, -1) + nChar);
    }
  };
  return redirect ? (
    <Redirect to={`/conjugate/${searchValue}`} />
  ) : (
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
    </Grid>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};
export default Home;
