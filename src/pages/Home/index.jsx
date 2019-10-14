/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Header, Grid } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';

import SearchBar from '../../components/SearchBar';
import AccentButtons from '../../components/AccentButtons';
import filterVerbs from '../../helper/filterVerbs';

const Home = () => {
  let [searchValue, setSearchValue] = useState('');
  let [redirect, setRedirect] = useState(false);

  const handleFilterResults = value => filterVerbs(value, 5);

  const handleSearchClick = value => {
    setSearchValue(value);
    setRedirect(true);
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
          <AccentButtons searchValue={searchValue} setSearchValue={setSearchValue} />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};
export default Home;
