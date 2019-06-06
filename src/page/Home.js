/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

let Home = props => {
  console.log(props);
  return <div>Home menu</div>;
};

Home.propTypes = {
  children: PropTypes.node,
};

export default Home;
