/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';

const About = props => {
  console.log(props);
  return <div>About menu</div>;
};

About.propTypes = {
  children: PropTypes.node,
};

export default About;
