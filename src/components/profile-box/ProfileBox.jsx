import React, { useReducer } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { doUserLogout } from "../../redux/apiCalls";
import {
  INITIAL_LOADING_STATE,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import "./ProfileBox.scss";

export default function ProfileBox({ classStyleAddOn }) {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const currentUserEmail = useSelector(
    (state) => state.user.currentUsers.userEmail
  );

  const addClassStyleAddOn = () => {
    return !!classStyleAddOn.length ? classStyleAddOn.join(" ") : "";
  };

  const doLogout = () => {
    doUserLogout(currentUserIdFromSlice, mutate, dispatch);
  };

  return (
    <div className={`profile-box ${addClassStyleAddOn()}`}>
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
        {!loadingState.status ? (
          <div className="profile-box-logout-button" onClick={doLogout}>
            Logout
          </div>
        ) : (
          <div className="profile-box-logout-button">
            <RoundedLoader
              size={14}
              baseColor="rgb(251, 226, 226)"
              secondaryColor="white"
            />
          </div>
        )}
      </div>
    </div>
  );
}
