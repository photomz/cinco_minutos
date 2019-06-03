import React, { useState } from 'react';
import './App.css';

// import VerbContainer from './VerbContainer';
import NavBar from './NavBar';
// import SearchContainer from './SearchContainer';

let App = () => {
  let [navActive, setNavActive] = useState('home');
  const onNavBarClick = (e, { name }) => {
    setNavActive(name);
  };
  return (
    <div>
      <NavBar
        onClick={onNavBarClick}
        active={navActive}
        items={['home', 'browse', 'collections', 'settings', 'about']}
      />
      <div>Hello World!</div>
    </div>
  );
};

export default App;
