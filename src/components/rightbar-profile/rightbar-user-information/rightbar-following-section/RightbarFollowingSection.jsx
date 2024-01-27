import React from "react";
import { Link } from "react-router-dom";

import "./RightbarFollowingSection.scss";

export default function RightbarFollowingSection({ title, followers }) {
  return (
    <div className="rightbar-followings-wrapper">
      <h4 className="rightbar-title-user-follower">{title}</h4>

      <div className="rightbar-followings">
        {followers.map((user, index) => (
          <Link
            to={`/profile/${user.username}/user-id/${user.id}`}
            style={{ textDecoration: "none", color: "black" }}
            key={index}
            className="rightbar-following"
          >
            <div className="rightbar-following-img-wrapper">
              <img
                src={user.avatarUrl}
                alt="following-user"
                className="rightbar-following-img"
              />
            </div>
            <div className="rightbar-following-name">{user.username}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
