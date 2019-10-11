import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import nanoid from 'nanoid';

import data from './data';
import NavBar from '../components/NavBar';

const Routes = () => {
  return (
    <Router>
      <NavBar />
      <Switch>
        {data.map(({ path, component, exact }) => (
          <Route key={nanoid()} exact={!!exact} path={path} component={component} />
        ))}
        <Route path="*" render={() => <Redirect to="/" />} />
      </Switch>
    </Router>
  );
};

export default Routes;
