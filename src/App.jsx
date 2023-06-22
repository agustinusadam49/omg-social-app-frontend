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

  useCheckUserAuth({
    isUserLoggedin: isUserLoggedin,
    access_token: access_token,
    dispatch: dispatch,
  })

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
            <Route index element={needAuthpages["home"].pageComponent()} />
            <Route path={needAuthpages["events"].path} element={needAuthpages["events"].pageComponent()} />
            <Route path={needAuthpages["search"].path} element={needAuthpages["search"].pageComponent()} />
          </Route>

          <Route path="" element={<NotificationPages />}>
            <Route path={needAuthpages["postnotif"].path} element={needAuthpages["postnotif"].pageComponent()} />
            <Route path={needAuthpages["followernotif"].path} element={needAuthpages["followernotif"].pageComponent()} />
            <Route path={needAuthpages["messagenotif"].path} element={needAuthpages["messagenotif"].pageComponent()} />
          </Route>

          <Route path={needAuthpages["profile"].path} element={needAuthpages["profile"].pageComponent()} />
        </Route>

        <Route
          path={notNeedAuthpages["login"].path}
          element={
            access_token
              ? (<Navigate to="/" />)
              : (notNeedAuthpages["login"].pageComponent())
          }
        />

        <Route
          path={notNeedAuthpages["register"].path}
          element={
            access_token
              ? (<Navigate to="/" />)
              : (notNeedAuthpages["register"].pageComponent())
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
