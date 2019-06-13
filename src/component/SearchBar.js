/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search } from 'semantic-ui-react';
import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
const SearchBar = ({
  onFilterResults,
  onSearchClick,
  results,
  setResults,
  value,
  setValue,
  ...props
}) => {
  let [_isLoading, _setIsLoading] = useState(false);

  const revertState = () => {
    _setIsLoading(false);
    setResults([]);
    setValue('');
  };
  const _handleResultSelect = (e, { result }) => {
    setValue(result.title);
    _handleSearchClick();
  };
  const _handleSearchClick = () => {
    onSearchClick(value);
  };
  const _handleSearchChange = (e, { value }) => {
    _setIsLoading(true);
    setValue(value);
    //console.log('value - ', value);
    setTimeout(() => {
      if (value.length < 1) return revertState();
      //console.log('value in timeout - ', value);
      setResults(onFilterResults(value));
      _setIsLoading(false);
    }, 200);
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
  results: PropTypes.array,
  setResults: PropTypes.func,
  value: PropTypes.string,
  setValue: PropTypes.func,
};

export default SearchBar;
