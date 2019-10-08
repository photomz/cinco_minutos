import React from 'react';
import ROUTES from '../global/routes';
import Home from '../pages/Home';
import Browse from '../pages/Browse';
import Collections from '../pages/Collections';
import Settings from '../pages/Settings';
import About from '../pages/About';
import Translate from '../pages/Translate';

// const normalRoutesMap = [
//   { name: 'ℭ𝔦𝔫𝔠𝔬𝔐𝔦𝔫.𝔲𝔱𝔬𝔰', icon: 'chess' },
//   { name: 'home', icon: 'home', route: ROUTES.Home, component: <Home /> },
//   { name: 'translate', icon: 'language', route: ROUTES.Translate, component: <Translate /> },
//   { name: 'browse', icon: 'book', route: ROUTES.Browse, component: <Browse /> },
//   { name: 'collections', icon: 'archive', route: ROUTES.Collections, component: <Collections /> },
//   { name: 'settings', icon: 'settings', route: ROUTES.Settings, component: <Settings /> },
//   { name: 'about', icon: 'code', route: ROUTES.About, component: <About /> },
//   { name: 'github', icon: 'github' },
// ];

const normalRoutesMap = [
  { path: ROUTES.Home, component: <Home />, exact: true },
  { path: ROUTES.Conjugate, component: <Home /> },
  { path: ROUTES.Translate, component: <Translate /> },
  { path: ROUTES.Browse, component: <Browse /> },
  { path: ROUTES.Collections, component: <Collections /> },
  { path: ROUTES.Settings, component: <Settings /> },
  { path: ROUTES.About, component: <About /> },
];

export default normalRoutesMap;
