import React from 'react';
import { withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import ROUTES from './global/routes';
import Routes from './routes';
import { NavBar } from './components/Layout';
import toTitleCase from './helper/toTitleCase';

const invertedRoutes = _.invert(ROUTES); // Match component name by route pathname

const Helmets = withRouter(({ location: { pathname } }) => {
  const subpath = pathname.split('/')[2];
  // Puts slug (subpath) before component name (main path), if it exists
  // Example" /conjugate/comer becomes Conjugate Comer | CincoMinutos
  const slug = subpath ? toTitleCase(subpath) : '';
  const componentName = toTitleCase(invertedRoutes['/' + pathname.split('/')[1]] || 'Landing');
  return (
    <Helmet>
      <title>{`${componentName} ${slug} | CincoMinutos`}</title>
    </Helmet>
  );
});

const App = () => (
  <Routes>
    <Helmets />
    <NavBar />
  </Routes>
);
export default App;
