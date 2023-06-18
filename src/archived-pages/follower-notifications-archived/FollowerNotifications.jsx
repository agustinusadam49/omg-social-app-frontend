import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import FollowerNotifContents from "../../components/follower-notif-contents/FollowerNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import "./FollowerNotifications.scss";

export default function FollowerNotifications() {
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="follower-notifications-page-container">
      <Leftbar />
      <FollowerNotifContents />
      <Rightbar />
    </div>
  );
};