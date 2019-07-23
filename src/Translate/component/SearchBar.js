/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search, Popup } from 'semantic-ui-react';

// eslint-disable-next-line no-unused-vars
const SearchBar = ({ onFilterResults, onSearchClick, value, setValue, offline, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);
  const _handleSearchClick = val => {
    _setIsLoading(true);
    onSearchClick(typeof val === 'string' ? val : value);
    _setIsLoading(false);
  };
  const _handleSearchChange = (e, { value }) => {
    setValue(value);
  };
  const _handleKeyPress = e => {
    if (e.charCode === 13) {
      e.target.blur();
      _handleSearchClick();
    }
  };
  return (
    <Popup
      content={'You are offline, therefore you cannot use the translation feature.'}
      disabled={!offline}
      trigger={
        <Search
          size="large"
          loading={_isLoading}
          onSearchChange={_handleSearchChange}
          onKeyPress={_handleKeyPress}
          value={value}
          noResultsDescription="Make sure to use the infintive form."
          icon={<Icon inverted circular link name="search" onClick={_handleSearchClick} />}
          {...props}
        />
      }
    />
  );
};

SearchBar.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  onFilterResults: PropTypes.func,
  onSearchClick: PropTypes.func,
  _results: PropTypes.array,
  _setResults: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
  inputRef: PropTypes.any,
};
export default SearchBar;
