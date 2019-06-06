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

const navItems = ['home', 'browse', 'collections', 'settings', 'about'];
const navIcons = ['home', 'book', 'archive', 'settings', 'fork'];
const App = () => {
  let [page, setPage] = useState('home');
  const onNavBarClick = (e, { name }) => {
    setPage(name);
  };
  return (
    <div>
      <NavBar
        onClick={onNavBarClick}
        active={page}
        items={navItems}
        icons={navIcons}
        title="ℂ𝕚𝕟𝕔𝕠𝕄𝕚𝕟𝕦𝕥𝕠𝕤"
      />
      <Home currentPage={page} />
      <Browse currentPage={page} />
      <Collections currentPage={page} />
      <Settings currentPage={page} />
      <About currentPage={page} />
    </div>
  );
};

export default App;
