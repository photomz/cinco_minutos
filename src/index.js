/* global module */
import React from 'react';
import { render } from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.css';

const renderApp = () => {
  render(<App />, document.getElementById('root'));
};

renderApp();

if (module.hot) module.hot.accept(renderApp);
