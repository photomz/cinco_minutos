/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Popup } from 'semantic-ui-react';

// eslint-disable-next-line no-unused-vars
let prevTimeoutCall = setTimeout(() => null, 0);
let timePassed = 0;
let prevTime = performance.now();
const InputBar = ({ onSearch, value, setValue, offline, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);
  const _handleSearchChange = (e, { value }) => {
    setValue(value);
    _setIsLoading(true);
    clearTimeout(prevTimeoutCall);
    timePassed = performance.now() - prevTime;
    prevTime = performance.now();
    if (timePassed >= 500) onSearch(value).then(() => _setIsLoading(false));
    else
      prevTimeoutCall = setTimeout(() => {
        onSearch(value).then(() => _setIsLoading(false));
      }, 250);
  };
  const _handleKeyPress = e => {
    if (e.charCode === 13) {
      e.target.blur();
    }
  };
  const onBlur = () => {
    clearTimeout(prevTimeoutCall);
    _setIsLoading(true);
    onSearch(value, true).then(() => _setIsLoading(false));
  };
  return (
    <Popup
      content={'You are offline, therefore you cannot use the translation feature.'}
      disabled={!offline}
      trigger={
        <div style={{ display: 'inline-block' }}>
          <Input
            placeholder="Translate some text..."
            icon="search"
            loading={_isLoading}
            onChange={_handleSearchChange}
            onKeyPress={_handleKeyPress}
            value={value}
            size="large"
            disabled={offline}
            onBlur={onBlur}
            {...props}
          />
        </div>
      }
    />
  );
};

InputBar.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  onSearchClick: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
  inputRef: PropTypes.any,
};
export default InputBar;
