/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import NavBar from './NavBar.js';
import Home from '../Home';
import Browse from '../Browse';
import Collections from '../Collections';
import Settings from '../Settings';
import About from '../About';
import ROUTES from '../static/routes.json';
import './index.css';

// eslint-disable-next-line react/display-name
// const PageHoc = (Component, page) => ({ current, ...props }) =>
//   page === current ? <Component {...props} /> : '';
// PageHoc.displayName = 'PageContent';

// const HomePage = PageHoc(Home, 'home');
// const BrowsePage = PageHoc(Browse, 'browse');
// const CollectionsPage = PageHoc(Collections, 'collections');
// const SettingsPage = PageHoc(Settings, 'settings');
// const AboutPage = PageHoc(About, 'about');

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
  { name: 'home', icon: 'home', route: ROUTES.Home },
  { name: 'browse', icon: 'book', route: ROUTES.Browse },
  { name: 'collections', icon: 'archive', route: ROUTES.Collections },
  { name: 'settings', icon: 'settings', route: ROUTES.Settings },
  { name: 'about', icon: 'code', route: ROUTES.About },
  { name: 'github', icon: 'github' },
];
const App = () => {
  let [page, setPage] = useState('home');
  let [width, setWidth] = useState(0);
  let [expandedNavBar, setExpansionNavBar] = useState(false);
  const onNavBarClick = name => {
    if (name === 'github') {
      window.open(ROUTES.GitHub);
    } else if (typeof name !== 'string') {
      setExpansionNavBar(!expandedNavBar);
    } else setPage(name);
  };
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return (
    <Router>
      <NavBar
        onClick={onNavBarClick}
        active={page}
        content={navContent}
        expanded={expandedNavBar}
        width={width}
      />
      <Route exact path={ROUTES.Home} component={Home} />
      <Route path={ROUTES.Browse} component={Browse} />
      <Route path={ROUTES.Collections} component={Collections} />
      <Route path={ROUTES.Settings} component={Settings} />
      <Route path={ROUTES.About} component={About} />
      <Route path={ROUTES.Conjugate} component={Home} />
    </Router>
  );
};

export default App;
