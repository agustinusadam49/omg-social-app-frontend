import React, { useEffect } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import "./Home.scss";

export default function Home() {
  const dispatch = useDispatch();
  const access_token = accessToken();

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="home-container">
      <Leftbar />
      <Feed />
      <Rightbar />
    </div>
  );
};