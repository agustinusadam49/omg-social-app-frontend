import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import EventContents from "../../components/event-contents/EventContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import "./Events.scss";

export default function Events() {
  const dispatch = useDispatch();
  const access_token = accessToken();

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="event-page-container">
      <Leftbar />
      <EventContents />
      <Rightbar />
    </div>
  );
};