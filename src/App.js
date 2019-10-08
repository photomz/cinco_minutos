/* eslint-disable react/prop-types */
/* eslint-disable no-console */
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { Segment } from 'semantic-ui-react';

import NavBar from './components/NavBar';
import Home from './pages/Home';
import Routes from './routes';

import { createBrowserHistory } from 'history';
import './index.css';

// const toggleWidth = 250 + 90 * (navContent.filter(el => !!el.route).length + 1);
// const expandedHeight =
//   'calc(54px + ' + (22 / 6) * (navContent.filter(el => !!el.route).length + 1) + 'em)';
// const history = createBrowserHistory();

// const App = () => {
//   let [width, setWidth] = useState(window.innerWidth);
//   let [expandedNavBar, setExpansionNavBar] = useState(false);
//   const onNavBarClick = name => {
//     if (name === 'github') {
//       window.open(ROUTES.GitHub);
//     } else if (typeof name !== 'string') {
//       setExpansionNavBar(!expandedNavBar);
//     } else {

//       setExpansionNavBar(false);
//     }
//   };
//   useEffect(() => {
//     const handleResize = () => setWidth(window.innerWidth);
//     window.addEventListener('resize', handleResize);
//   }, [width]);
//   useEffect(
//     () => document.documentElement.style.setProperty('--expanded-height', expandedHeight),
//     [],
//   );
//   return (
//     <Routes></Routes>
//   );
// };

const App = () => <Routes>hi</Routes>;

export default App;
