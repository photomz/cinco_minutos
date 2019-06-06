/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import SearchBar from '../component/SearchBar.js';

let Home = props => {
  console.log(props);
  return (
    <div>
      <SearchBar buttons={['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ']} />
    </div>
  );
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
