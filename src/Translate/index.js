/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

let Translate = props => {
  console.log(props);
  return <div>Translation Page</div>;
};

Translate.propTypes = {
  children: PropTypes.node,
};

export default Translate;
