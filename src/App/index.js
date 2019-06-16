/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState } from 'react';

import NavBar from './NavBar.js';
import Home from '../Home';
import Browse from '../Browse';
import Collections from '../Collections';
import Settings from '../Settings';
import About from '../About';
import './index.css';

// eslint-disable-next-line react/display-name
const PageHoc = (Component, page) => ({ current, ...props }) =>
  page === current ? <Component {...props} /> : '';
PageHoc.displayName = 'PageContent';

const HomePage = PageHoc(Home, 'home');
const BrowsePage = PageHoc(Browse, 'browse');
const CollectionsPage = PageHoc(Collections, 'collections');
const SettingsPage = PageHoc(Settings, 'settings');
const AboutPage = PageHoc(About, 'about');

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
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
      <HomePage current={page} />
      <BrowsePage current={page} />
      <CollectionsPage current={page} />
      <SettingsPage current={page} />
      <AboutPage current={page} />
    </div>
  );
};

export default App;
