import ReactDOM from "react-dom";
import App from "./App";
import AppVansExplore from "./AppVansExplore";
import AppVansExploreV2 from "./AppVansExploreV2"
import { Provider } from "react-redux";

import store from "./redux/store";

const getAppToRun = (appName) => {
  const appStateDefault = {
    omgSocial: <App />,
    vansExplore: <AppVansExplore />,
    vansExploreV2: <AppVansExploreV2 />,
  }

  return appStateDefault[appName]
}

ReactDOM.render(
  <Provider store={store}>
    {getAppToRun("omgSocial")}
  </Provider>,
  document.getElementById("root")
);
