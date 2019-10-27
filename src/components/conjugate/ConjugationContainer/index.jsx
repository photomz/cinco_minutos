import React from 'react';
import PropTypes from 'prop-types';
import MobileConjugationContainer from './MobileConjugationContainer';
import WidescreenConjugationContainer from './WidescreenConjugationContainer';
import { Segment } from 'semantic-ui-react';
import { icons } from './data.json';

const ConjugationContainer = ({ conjugation, ...props }) => (
  <Segment.Group {...props}>
    <MobileConjugationContainer conjugation={conjugation} icons={icons} />
    <WidescreenConjugationContainer conjugation={conjugation} icons={icons} />
  </Segment.Group>
);

ConjugationContainer.propTypes = {
  conjugation: PropTypes.array,
  icons: PropTypes.array,
};

export default ConjugationContainer;
