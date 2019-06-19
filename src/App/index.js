/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import NavBar from './NavBar.js';
import Home from '../Home';
import Browse from '../Browse';
import Collections from '../Collections';
import Settings from '../Settings';
import About from '../About';
import ROUTES from '../static/routes.json';
import { createBrowserHistory } from 'history';
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
const history = createBrowserHistory();
const App = () => {
  let [page, setPage] = useState('home');
  let [width, setWidth] = useState(window.innerWidth);
  let [expandedNavBar, setExpansionNavBar] = useState(false);
  const onNavBarClick = name => {
    if (name === 'github') {
      window.open(ROUTES.GitHub);
    } else if (typeof name !== 'string') {
      document.querySelector('#navbar').classList.add('transitioning');
      const wasExpanded = expandedNavBar;
      if (width && width <= 768) setExpansionNavBar(true);
      setTimeout(() => {
        if (wasExpanded) {
          setExpansionNavBar(false);
        }
        document.querySelector('#navbar').classList.remove('transitioning');
      }, 400);
    } else {
      setPage(name);
      onNavBarClick(null);
    }
  };
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
  }, [width]);
  return (
    <Router>
      <NavBar
        onClick={onNavBarClick}
        active={page}
        content={navContent}
        expanded={expandedNavBar}
        width={width}
      />
      <Route
        exact
        path={ROUTES.Home}
        render={() => {
          setPage('home');
          return <Home />;
        }}
      />
      <Route
        path={ROUTES.Browse}
        render={() => {
          setPage('browse');
          return <Browse />;
        }}
      />
      <Route
        path={ROUTES.Collections}
        render={() => {
          setPage('collections');
          return <Collections />;
        }}
      />
      <Route
        path={ROUTES.Settings}
        render={() => {
          setPage('settings');
          return <Settings />;
        }}
      />
      <Route
        path={ROUTES.About}
        render={() => {
          setPage('about');
          return <About />;
        }}
      />
      <Route
        path={ROUTES.Conjugate}
        render={() => {
          setPage('home');
          return <Home />;
        }}
      />
      <Route
        path="/github"
        render={() => {
          window.location = ROUTES.GitHub;
          history.replace('/');
          setPage('github');
          return (
            <Segment raised padded style={{ margin: '25vh auto', width: '80vw', height: 'auto' }}>
              <h1 style={{ textAlign: 'center', fontSize: '5em' }}>Loading GitHub Page...</h1>
            </Segment>
          );
        }}
      />
    </Router>
  );
};

export default App;
