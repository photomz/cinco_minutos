/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search, Ref } from 'semantic-ui-react';
import _ from 'lodash';

// eslint-disable-next-line no-unused-vars
const SearchBar = ({ onFilterResults, onSearchClick, value, setValue, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);
  let [_results, _setResults] = useState([]);

  const revertState = () => {
    _setIsLoading(false);
    _setResults([]);
    setValue('');
  };
  const getSearchDOM = node => {
    console.log(node);
    node.firstChild.firstChild.id = 'homeSearchInput';
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
      _setResults(onFilterResults(value));
      _setIsLoading(false);
    }, 200);
  };

  return (
    <Ref innerRef={getSearchDOM}>
      <Search
        size="large"
        loading={_isLoading}
        onResultSelect={_handleResultSelect}
        onSearchChange={_.debounce(_handleSearchChange, 500, {
          leading: true,
        })}
        results={_results}
        value={value}
        noResultsDescription="Make sure to use the infintive form."
        icon={<Icon inverted circular link name="search" onClick={_handleSearchClick} />}
        {...props}
      />
    </Ref>
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
