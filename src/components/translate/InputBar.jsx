/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Input, Popup } from 'semantic-ui-react';

const InputBar = ({ onSearch, value, setValue, offline, ...props }) => {
  const [_isLoading, _setIsLoading] = useState(false);
  const _handleSearchChange = (e, { value }) => {
    setValue(value);
    _setIsLoading(true);
    onSearch(value).then(() => _setIsLoading(false));
  };
  const _handleKeyPress = e => {
    if (e.charCode === 13) {
      e.target.blur();
    }
  };
  const onBlur = () => {
    _setIsLoading(true);
    onSearch(value, true).then(() => _setIsLoading(false));
  };
  return (
    <Popup
      content="You are offline, therefore you cannot use the translation feature."
      disabled={!offline}
      trigger={
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
      }
    />
  );
};

InputBar.propTypes = {
  onSearch: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
  offline: PropTypes.bool,
};
export default InputBar;
