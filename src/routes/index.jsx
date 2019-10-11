import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import nanoid from 'nanoid';
import PropTypes from 'prop-types';

import data from './data';

const Routes = ({ children }) => {
  return (
    <Router>
      {children}
      <Switch>
        {data.map(({ path, component, exact }) => (
          <Route key={nanoid()} exact={!!exact} path={path} component={component} />
        ))}
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

Routes.propTypes = {
  children: PropTypes.node,
};

export default Routes;
