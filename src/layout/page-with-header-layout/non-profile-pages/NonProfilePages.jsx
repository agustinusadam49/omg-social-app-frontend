import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Leftbar from "../../../components/leftbar/Leftbar";
import Rightbar from "../../../components/rightbar/Rightbar";
import { userInfoLogin } from "../../../redux/apiCalls";
import { accessToken } from "../../../utils/getLocalStorage";
import { useScreenWidth } from "../../../utils/screenWidth";

import "./NonProfilePages.scss";

export default function NonProfilePages() {
  const dispatch = useDispatch();
  const access_token = accessToken();
  const isDesktop = useScreenWidth("lg");

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="non-profile-pages">
      {isDesktop && <Leftbar />}
      <Outlet />
      {isDesktop && <Rightbar />}
    </div>
  );
}
