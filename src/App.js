/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';
import NavBar from './components/NavBar.jsx';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Collections from './pages/Collections';
import Settings from './pages/Settings';
import About from './pages/About';
import Translate from './pages/Translate';
import ROUTES from './assets/routes.json';
import { createBrowserHistory } from 'history';
import './index.css';

const navContent = [
  { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫𝔲𝔱𝔬𝔰', icon: 'chess' },
  { name: 'home', icon: 'home', route: ROUTES.Home, JSX: <Home /> },
  { name: 'translate', icon: 'language', route: ROUTES.Translate, JSX: <Translate /> },
  { name: 'browse', icon: 'book', route: ROUTES.Browse, JSX: <Browse /> },
  { name: 'collections', icon: 'archive', route: ROUTES.Collections, JSX: <Collections /> },
  { name: 'settings', icon: 'settings', route: ROUTES.Settings, JSX: <Settings /> },
  { name: 'about', icon: 'code', route: ROUTES.About, JSX: <About /> },
  { name: 'github', icon: 'github' },
];
const toggleWidth = 250 + 90 * (navContent.filter(el => !!el.route).length + 1);
const expandedHeight =
  'calc(54px + ' + (22 / 6) * (navContent.filter(el => !!el.route).length + 1) + 'em)';
const history = createBrowserHistory();
const App = () => {
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
    <Router>
      <NavBar
        onClick={onNavBarClick}
        active={page}
        content={navContent}
        expanded={expandedNavBar}
        width={width}
        toggleWidth={toggleWidth}
      />
      <Switch>
        {navContent
          .filter(el => !!el.JSX)
          .map(el => (
            <Route
              exact={el.name === 'home'}
              path={el.route}
              render={() => {
                setPage(el.name);
                window.scrollTo(0, 0);
                return el.JSX;
              }}
            />
          ))}
        <Route
          path={ROUTES.Conjugate}
          render={() => {
            setPage('home');
            window.scrollTo(0, 0);
            return <Home />;
          }}
        />
        <Route
          path="/github"
          render={() => {
            window.location = ROUTES.GitHub;
            history.replace('/');
            setPage('github');
            window.scrollTo(0, 0);
            return (
              <Segment raised padded style={{ margin: '25vh auto', width: '80vw', height: 'auto' }}>
                <h1 style={{ textAlign: 'center', fontSize: '5em' }}>Loading GitHub Page...</h1>
              </Segment>
            );
          }}
        />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

export default App;
