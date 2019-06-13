/* eslint-disable react/prop-types */
import React from 'react';
import Home from './Home.js';
import Browse from './Browse.js';
import Collections from './Collections.js';
import Settings from './Settings.js';
import About from './About.js';

// eslint-disable-next-line react/display-name
const PageHoc = (Component, page) => ({ current, ...props }) =>
  page === current ? <Component {...props} /> : '';
PageHoc.displayName = 'PageContent';

const HomePage = PageHoc(Home, 'home');
const BrowsePage = PageHoc(Browse, 'browse');
const CollectionsPage = PageHoc(Collections, 'collections');
const SettingsPage = PageHoc(Settings, 'settings');
const AboutPage = PageHoc(About, 'about');

export { HomePage, BrowsePage, CollectionsPage, SettingsPage, AboutPage, PageHoc };
