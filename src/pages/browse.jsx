/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

const Browse = props => {
  console.log(props);
  return <div>Browse menu</div>;
};

Browse.propTypes = {
  children: PropTypes.node,
};

export default Browse;
