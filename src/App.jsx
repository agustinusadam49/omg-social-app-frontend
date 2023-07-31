import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { needAuthpages, notNeedAuthpages } from "./router/index";
import PageWithHeaderLayout from "./layout/page-with-header-layout/PageWithHeaderLayout";
import NonProfilePages from "./layout/page-with-header-layout/non-profile-pages/NonProfilePages";
import NotificationPages from "./layout/page-with-header-layout/notification-pages/NotificationPages";
import ErrorPage from "./pages/error-page/ErrorPage";
import "./App.scss";

const getNonAuthComponent = (pageKeyName) => {
  return notNeedAuthpages[pageKeyName].pageComponent();
};

const getAuthComponent = (pageKeyName) => {
  return needAuthpages[pageKeyName].pageComponent();
};

const getPath = (pageKeyName, isAuthPage = false) => {
  if (isAuthPage) return needAuthpages[pageKeyName].path;
  return notNeedAuthpages[pageKeyName].path;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <PageWithHeaderLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <NonProfilePages />,
        children: [
          {
            index: true,
            element: getAuthComponent("home"),
          },
          {
            path: getPath("events", true),
            element: getAuthComponent("events"),
          },
          {
            path: getPath("search", true),
            element: getAuthComponent("search"),
          },
        ],
      },
      {
        path: "",
        element: <NotificationPages />,
        children: [
          {
            path: getPath("postnotif", true),
            element: getAuthComponent("postnotif"),
          },
          {
            path: getPath("followernotif", true),
            element: getAuthComponent("followernotif"),
          },
          {
            path: getPath("messagenotif", true),
            element: getAuthComponent("messagenotif"),
          },
        ],
      },
      {
        path: getPath("profile", true),
        element: getAuthComponent("profile"),
      },
    ],
  },
  {
    path: getPath("login"),
    element: getNonAuthComponent("login"),
  },
  {
    path: getPath("register"),
    element: getNonAuthComponent("register"),
  },
  {
    path: getPath("forgotPassword"),
    element: getNonAuthComponent("forgotPassword"),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
