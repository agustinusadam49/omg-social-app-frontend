import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import FollowerNotifContents from "../../components/follower-notif-contents/FollowerNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import "./FollowerNotifications.scss";

export default function FollowerNotifications() {
  const dispatch = useDispatch();
  const access_token = accessToken();

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="follower-notifications-page-container">
      <Leftbar />
      <FollowerNotifContents />
      <Rightbar />
    </div>
  );
};