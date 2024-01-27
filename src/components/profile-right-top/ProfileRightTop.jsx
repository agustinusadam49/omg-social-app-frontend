import React from "react";

import "./ProfileRightTop.scss";

export default function ProfileRightTop({
  displayUserImageProfile,
  diplayUserImageAvatar,
  username,
  displayUserShortBio,
}) {
  return (
    <div className="profile-right-top">
      <div className="profile-cover">
        <img
          className="profile-cover-img"
          src={displayUserImageProfile}
          alt="profile-cover"
        />
        <img
          className="profile-user-avatar"
          src={diplayUserImageAvatar}
          alt="profile-avatar"
        />
      </div>

      <div className="profile-info">
        <h4 className="profile-info-name">{username}</h4>
        <div className="profile-info-desc">
          {displayUserShortBio || "Hey there netizen of Omongin App!!"}
        </div>
      </div>
    </div>
  );
}
