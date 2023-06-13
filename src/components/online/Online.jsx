import React from "react";
import { Link } from "react-router-dom";
import "./Online.scss";

export default function Online({ user }) {
  return (
    <Link
      to={`/profile/${user.userName}/user-id/${user.id}`}
      style={{ textDecoration: "none", color: "black" }}>
      <li className="rightbar-friend">
        <div className="rightbar-profile-img-container">
          <img
            src={`${user.Profile.avatarUrl}`}
            alt="profile-friends"
            className="rightbar-profile-img"
          />
          <span className="rightbar-online-badge"></span>
        </div>
        <span className="rightbar-username">{user.userName}</span>
      </li>
    </Link>
  );
}
