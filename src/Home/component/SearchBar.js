/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search } from 'semantic-ui-react';

let prevTime = performance.now();
let prevFilterCall = setTimeout(() => null, 0);
let cached = false;
let timesFast = 0;
// eslint-disable-next-line no-unused-vars
const SearchBar = ({ onFilterResults, onSearchClick, value, setValue, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);
  let [_results, _setResults] = useState([]);
  const revertState = () => {
    _setIsLoading(false);
    _setResults([]);
    setValue('');
  };
  const _handleResultSelect = (e, { result }) => {
    setValue(result.title);
    _handleSearchClick(result.title);
  };
  const _handleSearchClick = val => {
    document.querySelector('#homeSearchInput').blur();
    onSearchClick(typeof val === 'string' ? val : value);
  };
  const _handleSearchChange = (e, { value }) => {
    _setIsLoading(true);
    setValue(value);
    //console.log('value - ', value);
    setTimeout(() => {
      if (value.length < 1) return revertState();
      //console.log('value in timeout - ', value);
      if (!cached) {
        clearTimeout(prevFilterCall);
        if (performance.now() - prevTime >= 500) {
          onFilterResults(value).then(val => {
            _setResults(val[0]);
            cached = val[1];
          });
          prevTime = performance.now();
          ++timesFast;
        } else {
          prevFilterCall = setTimeout(() => {
            onFilterResults(value).then(val => _setResults(val[0]));
          }, 500 + timesFast * 100);
          timesFast = 0;
        }
      } else {
        onFilterResults(value).then(val => _setResults(val[0]));
      }
      _setIsLoading(false);
    }, 200);
  };
  const _handleKeyPress = e => {
    if (e.charCode === 13) _handleSearchClick();
  };
  return (
    <Search
      id="homeSearchInput"
      size="large"
      loading={_isLoading}
      onResultSelect={_handleResultSelect}
      onSearchChange={_handleSearchChange}
      onKeyPress={_handleKeyPress}
      results={_results}
      value={value}
      noResultsDescription="Make sure to use the infintive form."
      icon={<Icon inverted circular link name="search" onClick={_handleSearchClick} />}
      {...props}
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
