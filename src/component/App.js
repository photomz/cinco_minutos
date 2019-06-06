/* eslint-disable no-console */
import React, { useState } from 'react';
import './App.css';

import NavBar from './NavBar';
import {
  HomePage as Home,
  BrowsePage as Browse,
  CollectionsPage as Collections,
  SettingsPage as Settings,
  AboutPage as About,
} from '../page/index.js';

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'life ring' },
  { name: 'home', icon: 'home' },
  { name: 'browse', icon: 'book' },
  { name: 'collections', icon: 'archive' },
  { name: 'settings', icon: 'settings' },
  { name: 'about', icon: 'code' },
  { name: 'github', icon: 'github' },
];
const App = () => {
  let [page, setPage] = useState('home');
  const onNavBarClick = name => {
    if (name === 'github') window.open('https://github.com/photomz/cinco_minutos');
    else setPage(name);
  };
  return (
    <div>
      <NavBar onClick={onNavBarClick} active={page} content={navContent} />
      <Home currentPage={page} />
      <Browse currentPage={page} />
      <Collections currentPage={page} />
      <Settings currentPage={page} />
      <About currentPage={page} />
    </div>
  );
};

export default App;
