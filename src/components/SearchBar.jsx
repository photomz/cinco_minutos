/* eslint-disable no-console */
import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search } from 'semantic-ui-react';

let prevTime = performance.now();
let prevTimeoutCall = setTimeout(() => null, 0);
let cached = false;
let timePassed = 0;
// eslint-disable-next-line no-unused-vars
const SearchBar = forwardRef(
  ({ onFilterResults, onSearchClick, value, setValue, showResults, ...props }, ref) => {
    let [_isLoading, _setIsLoading] = useState(false);
    let [_results, _setResults] = useState(showResults ? [] : null);

    const _handleResultSelect = (e, { result }) => {
      setValue(result.title);
      _handleSearchClick(result.title);
    };
    const _handleSearchClick = val => {
      onSearchClick(typeof val === 'string' ? val : value);
    };
    const _handleSearchChange = (e, { value }) => {
      setValue(value);
      if (!showResults) return _setResults(null);
      if (value.length < 1) return _setResults([]);
      _setIsLoading(true);
      if (!cached) {
        clearTimeout(prevTimeoutCall);
        timePassed = performance.now() - prevTime;
        prevTime = performance.now();
        if (timePassed >= 250 && value.length > 1) {
          onFilterResults(value).then(val => {
            _setResults(val[0]);
            cached = val[1];
            _setIsLoading(false);
          });
        } else {
          prevTimeoutCall = setTimeout(() => {
            onFilterResults(value).then(val => _setResults(val[0]));
            _setIsLoading(false);
          }, 250);
        }
      } else {
        clearTimeout(prevTimeoutCall);
        onFilterResults(value).then(val => {
          _setResults(val[0]);
          prevTimeoutCall = setTimeout(() => _setIsLoading(false), 200);
        });
      }
    };
    const _handleKeyPress = e => {
      if (e.charCode === 13) {
        e.target.blur();
        _handleSearchClick();
      }
    };
    return (
      <Search
        ref={ref}
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
  },
);

SearchBar.displayName = 'SearchBar';
SearchBar.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  onFilterResults: PropTypes.func,
  onSearchClick: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
  inputRef: PropTypes.any,
  showResults: PropTypes.bool,
};
SearchBar.defaultProps = {
  showResults: true,
};

export default SearchBar;
