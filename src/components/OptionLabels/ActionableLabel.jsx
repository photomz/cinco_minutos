import React from 'react';
import PropTypes from 'prop-types';
import { Label, Icon, Popup } from 'semantic-ui-react';

const ActionableLabel = ({
  currentAction,
  setAction,
  toggleableAction,
  second,
  icon,
  name,
  disabled,
}) => (
  <Popup
    disabled={!disabled}
    content={`Search for a valid verb to toggle ${name}.`}
    trigger={
      <Label
        onClick={() =>
          !disabled && setAction(prev => (prev === toggleableAction ? second : toggleableAction))
        }
        color={currentAction === toggleableAction ? 'blue' : null}
        as="a"
      >
        <Icon name={icon} size="large" />
        {name}
      </Label>
    }
  />
);

ActionableLabel.propTypes = {
  currentAction: PropTypes.string,
  setAction: PropTypes.func,
  toggleableAction: PropTypes.string,
  second: PropTypes.string,
  icon: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

ActionableLabel.defaultProps = {
  second: 'idle',
};

export default ActionableLabel;
