import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Leftbar from "../../../components/leftbar/Leftbar";
import Rightbar from "../../../components/rightbar/Rightbar";
import { userInfoLogin } from "../../../redux/apiCalls";
import { useScreenWidth } from "../../../custom-hooks/screenWidth";

import "./NonProfilePages.scss";

export default function NonProfilePages() {
  const dispatch = useDispatch();
  const isDesktop = useScreenWidth("lg");

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="non-profile-pages">
      {isDesktop && <Leftbar />}
      <Outlet />
      {isDesktop && <Rightbar />}
    </div>
  );
}
