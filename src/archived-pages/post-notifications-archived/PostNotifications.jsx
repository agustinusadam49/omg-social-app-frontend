import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import PostNotifContents from "../../components/post-notif-contents/PostNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import "./PostNotifications.scss";

export default function PostNotifications() {
  const dispatch = useDispatch();
  const access_token = accessToken();

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="post-notifications-page-container">
      <Leftbar />
      <PostNotifContents />
      <Rightbar />
    </div>
  );
};