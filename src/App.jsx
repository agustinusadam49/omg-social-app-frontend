import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { needAuthpages, notNeedAuthpages } from "./router/index";
import { useSelector, useDispatch } from "react-redux";
import { accessToken } from "./utils/getLocalStorage";
import PageWithHeaderLayout from "./layout/page-with-header-layout/PageWithHeaderLayout";
import NonProfilePages from "./layout/page-with-header-layout/non-profile-pages/NonProfilePages";
import NotificationPages from "./layout/page-with-header-layout/notification-pages/NotificationPages";
import { useCheckUserAuth } from "./utils/checkUserAuth";
import "./App.scss";

export default function App() {
  const dispatch = useDispatch();
  const access_token = accessToken();
  const isUserLoggedin = useSelector((state) => state.user.isUserAuthenticated);

  const getNonAuthComponent = (pageKeyName) => {
    return access_token
      ? <Navigate to="/" />
      : notNeedAuthpages[pageKeyName].pageComponent()
  }

  const getAuthComponent = (pageKeyName) => {
    return needAuthpages[pageKeyName].pageComponent()
  }

  const getPath = (pageKeyName, isAuthPage = false) => {
    if (isAuthPage) return needAuthpages[pageKeyName].path
    return notNeedAuthpages[pageKeyName].path
  }

  useCheckUserAuth({
    isUserLoggedin: isUserLoggedin,
    access_token: access_token,
    dispatch: dispatch,
  });

  const needAuthCheckToken = () => {
    if (access_token) {
      return <PageWithHeaderLayout />;
    } else {
      return <Navigate to="/login" />;
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={needAuthCheckToken()}>
          <Route path="" element={<NonProfilePages />}>
            <Route index element={getAuthComponent("home")} />
            <Route path={getPath("events", true)} element={getAuthComponent("events")} />
            <Route path={getPath("search", true)} element={getAuthComponent("search")} />
          </Route>

          <Route path="" element={<NotificationPages />}>
            <Route path={getPath("postnotif", true)} element={getAuthComponent("postnotif")} />
            <Route path={getPath("followernotif", true)} element={getAuthComponent("followernotif")} />
            <Route path={getPath("messagenotif", true)} element={getAuthComponent("messagenotif")} />
          </Route>

          <Route path={getPath("profile", true)} element={getAuthComponent("profile")} />
        </Route>

        <Route path={getPath("login")} element={getNonAuthComponent("login")} />
        <Route path={getPath("register")} element={getNonAuthComponent("register")} />
        <Route path={getPath("forgotPassword")} element={getNonAuthComponent("forgotPassword")} />
      </Routes>
    </BrowserRouter>
  );
}
