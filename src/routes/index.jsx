import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

import data from './data';

const Routes = ({ children }) => (
  <Router>
    {children}
    <Switch>
      {data.map(({ key, ...propsMap }) => (
        <Route key={key} {...propsMap} />
      ))}
      <Route path="*" render={() => <Redirect to="/" />} />
    </Switch>
  </Router>
);

Routes.propTypes = {
  children: PropTypes.node,
};

export default Routes;
