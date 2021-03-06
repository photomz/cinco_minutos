import React from 'react';
import { render } from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.css';

const renderApp = () => {
  render(<App />, document.getElementById('root'));
};
if ('serviceWorker' in navigator && !navigator.serviceWorker.controller) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});
}
renderApp();

if (module.hot) module.hot.accept(renderApp);
