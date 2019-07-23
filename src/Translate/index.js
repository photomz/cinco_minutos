/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import { checkOffline } from '../updateSW.js';

import SearchBar from './component/SearchBar.js';

const Translate = props => {
  let [offline, setOffline] = useState(false);
  let [searchValue, setSearchValue] = useState('');
  useEffect(() => {
    checkOffline().then(val => setOffline(val));
  });
  return (
    <Grid textAlign="center">
      <Grid.Row>
        <Grid.Column>
          <SearchBar
            onSearch={() => {}}
            offline={offline}
            value={searchValue}
            setValue={setSearchValue}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

Translate.propTypes = {
  children: PropTypes.node,
};

export default Translate;
