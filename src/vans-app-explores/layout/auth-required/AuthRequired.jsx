import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { isAuth } from "../../van-utils/isAuth";

export default function AuthRequired() {
  const isUserAuth = isAuth();
  if (!isUserAuth) return <Navigate to="/login" />;
  return <Outlet />;
}
