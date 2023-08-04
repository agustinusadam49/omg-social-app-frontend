import React from "react";
import { RouterProvider } from "react-router-dom";
import { explorationRouter } from "./vans-app-explores/router/index.js";

import "./AppVansExplore.scss";

export default function App() {
  return <RouterProvider router={explorationRouter} />;
}
