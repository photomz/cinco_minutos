import React, { useState, useEffect } from 'react';

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

const toggleWidth = 250 + 90 * (navContent.filter(el => !!el.route).length + 1);
const expandedHeight =
  'calc(54px + ' + (22 / 6) * (navContent.filter(el => !!el.route).length + 1) + 'em)';
const NavBarLayout = () => {
  let [page, setPage] = useState('home');
  let [width, setWidth] = useState(window.innerWidth);
  let [expandedNavBar, setExpansionNavBar] = useState(false);
  const onNavBarClick = name => {
    if (name === 'github') {
      window.open(ROUTES.GitHub);
    } else if (typeof name !== 'string') {
      setExpansionNavBar(!expandedNavBar);
    } else {
      setPage(name);
      setExpansionNavBar(false);
    }
  };
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
  }, [width]);
  useEffect(
    () => document.documentElement.style.setProperty('--expanded-height', expandedHeight),
    [],
  );
  return (
    <NavBar
      onClick={onNavBarClick}
      active={page}
      expanded={expandedNavBar}
      width={width}
      toggleWidth={toggleWidth}
      content={navContent}
    />
  );
};

export default NavBarLayout;
