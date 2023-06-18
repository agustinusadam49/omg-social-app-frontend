import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import PostNotifContents from "../../components/post-notif-contents/PostNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import "./PostNotifications.scss";

export default function PostNotifications() {
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="post-notifications-page-container">
      <Leftbar />
      <PostNotifContents />
      <Rightbar />
    </div>
  );
}
