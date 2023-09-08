import React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { accessToken } from "../../utils/getLocalStorage";

export default function PageWithoutHeaderLayout() {
  const location = useLocation();
  const from = location?.state?.from?.pathname || "/";
  const userToken = accessToken();
  const isLoggedIn = !!userToken;

  if (isLoggedIn) {
    return <Navigate to={from} replace={true} />;
  } else {
    return <Outlet />;
  }
}
