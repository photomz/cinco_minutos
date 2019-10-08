/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

let Collections = props => {
  console.log(props);
  return <div>Collections menu</div>;
};

Collections.propTypes = {
  children: PropTypes.node,
};

export default Collections;
