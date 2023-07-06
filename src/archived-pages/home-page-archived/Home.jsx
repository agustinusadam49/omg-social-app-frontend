import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import "./Home.scss";

export default function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <div className="home-container">
      <Leftbar />
      <Feed />
      <Rightbar />
    </div>
  );
};