import React, { useState } from 'react';

import NavBar from '../components/NavBar';
import ROUTES from '../global/routes';

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
  { name: 'home', icon: 'home', route: ROUTES.Home },
  { name: 'translate', icon: 'language', route: ROUTES.Translate },
  { name: 'browse', icon: 'book', route: ROUTES.Browse },
  { name: 'collections', icon: 'archive', route: ROUTES.Collections },
  { name: 'settings', icon: 'settings', route: ROUTES.Settings },
  { name: 'about', icon: 'code', route: ROUTES.About },
  { name: 'github', icon: 'github' },
];
const NavBarLayout = () => {
  let [page, setPage] = useState('home');
  let [expandedNavBar, setExpansionNavBar] = useState(false);
  const onNavBarClick = name => {
    if (name === 'github') {
      window.open(ROUTES.GitHub);
    } else {
      setPage(name);
      setExpansionNavBar(false);
    }
  };
  const onToggleNavBar = () => setExpansionNavBar(!expandedNavBar);
  return (
    <NavBar
      onNavClick={onNavBarClick}
      onToggle={onToggleNavBar}
      active={page}
      expanded={expandedNavBar}
      content={navContent}
    />
  );
};

export default NavBarLayout;
