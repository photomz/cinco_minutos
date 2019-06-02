/* global module */
import React from "react";
import { render } from "react-dom";
import App from "./App";

const renderApp = () => {
  const root = document.getElementById("root");
  render(<App />, root);
};

renderApp();

if (module.hot) module.hot.accept(renderApp);
