import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import shortid from 'shortid';

import ROUTES from '../global/routes';
import NavBarLayout from '../layouts/NavBarLayout';
import normalRoutesMap from './normalRoutes';

const Routes = () => {
  return (
    <Router>
      <Switch>
        {normalRoutesMap.map(({ path, component, exact }) => (
          <Route
            key={shortid.generate()}
            exact={!!exact}
            path={path}
            render={() => <NavBarLayout>{component}</NavBarLayout>}
          />
        ))}
        <Route path="/github" render={() => <Redirect to={ROUTES.GitHub} />} />
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

export default Routes;
