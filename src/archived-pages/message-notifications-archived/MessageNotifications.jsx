import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import MessageNotifContents from "../../components/message-notif-contents/MessageNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import "./MessageNotifications.scss";

export default function MessageNotifications() {
  const dispatch = useDispatch();
  const access_token = accessToken();

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="message-notifications-page-container">
      <Leftbar />
      <MessageNotifContents />
      <Rightbar />
    </div>
  );
};