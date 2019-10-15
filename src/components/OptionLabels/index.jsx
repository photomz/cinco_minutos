import React from 'react';
import PropTypes from 'prop-types';
import { Segment } from 'semantic-ui-react';

import data from './data';
import ActionableLabel from './ActionableLabel';
import ExternalRedirect from './ExternalRedirect';

const { actionableLabels, externalRedirects } = data;

const OptionLabels = ({ action, verb, disabled, setAction, ...props }) => {
  return (
    <Segment textAlign="center" {...props}>
      {actionableLabels.map(({ key, ...propsMap }) => (
        <ActionableLabel
          key={key}
          currentAction={action}
          disabled={disabled}
          setAction={setAction}
          {...propsMap}
        />
      ))}
      {externalRedirects.map(({ key, ...propsMap }) => (
        <ExternalRedirect key={key} verb={verb} disabled={disabled} {...propsMap} />
      ))}
    </Segment>
  );
};

OptionLabels.propTypes = {
  action: PropTypes.string,
  verb: PropTypes.string,
  disabled: PropTypes.bool,
  setAction: PropTypes.func,
};

export default OptionLabels;
