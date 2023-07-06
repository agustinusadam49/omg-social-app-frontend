import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import Leftbar from "../../../components/leftbar/Leftbar";
import Rightbar from "../../../components/rightbar/Rightbar";
import { userInfoLogin } from "../../../redux/apiCalls";
import { useScreenWidth } from "../../../utils/screenWidth";

import "./NotificationPages.scss";

export default function NotificationPages() {
  const dispatch = useDispatch();
  const isDesktop = useScreenWidth("lg");

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="notification-pages">
      {isDesktop && <Leftbar />}
      <Outlet />
      {isDesktop && <Rightbar />}
    </div>
  );
}
