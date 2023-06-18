import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Rightbar from "../../components/rightbar/Rightbar";
import EventContents from "../../components/event-contents/EventContents";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import "./Events.scss";

export default function Events() {
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="event-page-container">
      <Leftbar />
      <EventContents />
      <Rightbar />
    </div>
  );
};