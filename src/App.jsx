import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/index";

import "./App.scss";

export default function App() {
  return <RouterProvider router={router} />;
}
