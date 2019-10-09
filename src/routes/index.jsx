import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import nanoid from 'nanoid';

import ROUTES from '../global/routes';
import NavBarLayout from '../layouts/NavBarLayout';
import normalRoutesMap from './normalRoutes';

const Routes = () => {
  return (
    <Router>
      <NavBarLayout />
      <Switch>
        {normalRoutesMap.map(({ path, component, exact }) => (
          <Route key={nanoid()} exact={!!exact} path={path} component={component} />
        ))}
        <Route path="/github" render={() => <Redirect to={ROUTES.GitHub} />} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

export default Routes;
