import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doUserLogout } from "../../redux/apiCalls";
import "./ProfileBox.scss";

export default function ProfileBox() {
  const dispatch = useDispatch();
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserAvatarFromSlice = useSelector((state) => state.user.userAvatarPicture);
  const currentUserEmail = useSelector((state) => state.user.currentUsers.userEmail);

  const doLogout = () => {
    doUserLogout(currentUserIdFromSlice, dispatch);
  };

  return (
    <div className="profile-box">
      <div className="profile-box-inner-wrapper">
        <Link
          to={`/profile/${currentUserNameFromSlice}/user-id/${currentUserIdFromSlice}`}
          style={{ textDecoration: "none", color: "black" }}
          className="profile-box-image-and-email-container"
        >
          <img
            src={currentUserAvatarFromSlice}
            alt="user-profile"
            className="profile-box-profile-image-avatar"
          />
          <div className="profile-box-email-and-username-container">
            <div className="profile-box-user-email">{currentUserEmail}</div>
            <div className="profile-box-username">
              {currentUserNameFromSlice}
            </div>
          </div>
        </Link>
      </div>

      <div className="profile-box-logout-inner-wrapper">
        <div className="profile-box-logout-button" onClick={doLogout}>
          Logout
        </div>
      </div>
    </div>
  );
}
