import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const accentButtons = ['´', '¨', '˜'];
const toggleAccent = [
  { á: 'a', é: 'e', í: 'i', ó: 'o', ú: 'u', a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', ü: 'ú' },
  { ü: 'u', u: 'ü', ú: 'ü' },
  { ñ: 'n', n: 'ñ' },
];

const AccentButton = ({ searchValue, setSearchValue }) => {
  const handleAccentClick = (e, accent) => {
    const lastChar = searchValue.slice(-1);
    const toggledChar = toggleAccent[accentButtons.indexOf(accent)][lastChar];
    if (toggledChar) {
      // If lastChar was a vowel/had a diacritic form
      setSearchValue(prev => prev.slice(0, -1) + toggledChar);
    }
  };
  return (
    <Button.Group basic size="mini" style={{ margin: '0 auto' }}>
      {accentButtons.map(elem => (
        <Button key={elem} onClick={e => handleAccentClick(e, elem)}>
          {elem}
        </Button>
      ))}
    </Button.Group>
  );
};

AccentButton.propTypes = {
  searchValue: PropTypes.string.isRequired,
  setSearchValue: PropTypes.func.isRequired,
};

export default AccentButton;
