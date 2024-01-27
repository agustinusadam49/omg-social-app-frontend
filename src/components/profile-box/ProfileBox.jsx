import React, { useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { userLogout } from "../../apiCalls/registerAndLoginApiFetch";
import {
  INITIAL_LOADING_STATE,
  loadingReducer,
  actionType,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import {
  setIsAuthUser,
  setIsUserProfileMobileOpen,
} from "../../redux/slices/userSlice";

import "./ProfileBox.scss";

export default function ProfileBox({ classStyleAddOn }) {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const requestBodyForUpdateOnlineStatus = { userOnlineStatus: false };
    userLogout(currentUserIdFromSlice, requestBodyForUpdateOnlineStatus)
      .then((userLoginStatusResult) => {
        if (userLoginStatusResult.data.success) {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          dispatch(
            setIsUserProfileMobileOpen({ isUserProfileMobileOpen: false })
          );
          dispatch(setIsAuthUser({ isAuth: false }));
          localStorage.clear();
          navigate("/login");
        }
      })
      .catch((error) => {
        console.log(error?.response?.data?.err?.errorMessage);
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
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
