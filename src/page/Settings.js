/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

let Settings = props => {
  console.log(props);
  return <div>Settings menu</div>;
};

Settings.propTypes = {
  children: PropTypes.node,
};

export default Settings;
