import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import MessageNotifContents from "../../components/message-notif-contents/MessageNotifContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import "./MessageNotifications.scss";

export default function MessageNotifications() {
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="message-notifications-page-container">
      <Leftbar />
      <MessageNotifContents />
      <Rightbar />
    </div>
  );
}
