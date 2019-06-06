/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Icon, Input, Button } from 'semantic-ui-react';

// eslint-disable-next-line no-unused-vars
let SearchBar = ({ buttons, ...props }) => {
  let input = null;
  let [inputVal, setInputVal] = useState('');

  const onAccentClick = (e, accent) => {
    setInputVal(inputVal + accent);
  };
  const onChange = e => {
    setInputVal(e.target.value);
  };
  useEffect(() => {
    if (input) input.focus();
  });
  return (
    <div>
      <Input
        circular
        placeholder="Search"
        onChange={onChange}
        size="huge"
        ref={node => {
          input = node;
        }}
      >
        <input value={inputVal} />
        <Icon size="large" name="search" inverted circular link />
      </Input>
      <br />
      <br />
      <div>
        {buttons.map(elem => (
          <Button circular key={elem} size="tiny" onClick={e => onAccentClick(e, elem)}>
            {elem}
          </Button>
        ))}
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
};

export default SearchBar;
