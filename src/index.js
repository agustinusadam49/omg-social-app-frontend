import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AppVansExplore from "./AppVansExplore";
import { Provider } from "react-redux";

import store from "./redux/store";

const getAppToRun = (appName) => {
  const appStateDefault = {
    omgSocial: <App />,
    vansExplore: <AppVansExplore />,
  }

  return appStateDefault[appName]
}

ReactDOM.render(
  <Provider store={store}>
    {getAppToRun("vansExplore")}
  </Provider>,
  document.getElementById("root")
);
