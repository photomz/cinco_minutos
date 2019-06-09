/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search } from 'semantic-ui-react';
import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
const SearchBar = ({ onFilterResults, results, setResults, value, setValue, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);

  const revertState = () => {
    _setIsLoading(false);
    setResults([]);
    setValue('');
  };

  const _handleResultSelect = (e, { result }) => {
    setValue(result.title);
    _handleResultSearch();
  };

  const _handleResultSearch = () => {
    console.log('Search button clicked');
  };

  const _handleSearchChange = (e, { value }) => {
    _setIsLoading(true);
    setValue(value);
    console.log('value - ', value);
    setTimeout(() => {
      if (value.length < 1) return revertState();
      console.log('value in timeout - ', value);
      setResults(onFilterResults(value));
      _setIsLoading(false);
    }, 100);
  };

  return (
    <Search
      aligned="right"
      size="large"
      loading={_isLoading}
      onResultSelect={_handleResultSelect}
      onSearchChange={_.debounce(_handleSearchChange, 500, {
        leading: true,
      })}
      results={results}
      value={value}
      noResultsDescription="Make sure to use the infintive form."
      icon={<Icon inverted circular link name="search" onClick={_handleResultSearch} />}
      {...props}
    />
  );
};

SearchBar.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  onFilterResults: PropTypes.func,
  results: PropTypes.array,
  setResults: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default SearchBar;
