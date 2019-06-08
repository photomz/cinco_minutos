/* eslint-disable no-console */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon, Search } from 'semantic-ui-react';
import _ from 'lodash';
import faker from 'faker';

const source = _.times(5, () => ({
  title: faker.company.companyName(),
  description: faker.company.catchPhrase(),
  image: faker.internet.avatar(),
  price: faker.finance.amount(0, 100, 2, '$'),
}));

// eslint-disable-next-line no-unused-vars
const SearchBar = ({ onFilterResults, results, setResults, value, setValue, ...props }) => {
  let [_isLoading, _setIsLoading] = useState(false);
  const revertState = () => {
    _setIsLoading(false);
    setResults([]);
    setValue('');
  };
  const handleResultSelect = (e, { result }) => {
    setValue(result.title);
    handleResultSearch();
  };
  const handleResultSearch = () => {
    console.log('Search button clicked');
  };
  const handleSearchChange = (e, { value }) => {
    _setIsLoading(true);
    setValue(value);
    setTimeout(() => {
      // adapt later
      if (value.length < 1) return revertState();
      const re = new RegExp(_.escapeRegExp(value), 'i'); // match not case sensitive
      // adapt based upon json file structure
      setResults(onFilterResults(re, source));
      _setIsLoading(false);
    }, 500);
  };
  return (
    <Search
      aligned="right"
      size="massive"
      loading={_isLoading}
      onResultSelect={handleResultSelect}
      onSearchChange={_.debounce(handleSearchChange, 500, {
        leading: true,
      })}
      results={results}
      value={value}
      icon={<Icon inverted circular link name="search" onClick={handleResultSearch} />}
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
