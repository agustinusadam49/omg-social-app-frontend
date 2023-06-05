import React, { useEffect, useState } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSelector, useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { useParams } from "react-router-dom";
import { getUserById } from "../../apiCalls/registerAndLoginApiFetch";
import { accessToken } from "../../utils/getLocalStorage";
import { useScreenWidth } from "../../utils/screenWidth";
import "./Profile.scss";

export default function Profile() {
  const isDesktop = useScreenWidth("lg");
  const dispatch = useDispatch();

  const { userId, username } = useParams();

  const access_token = accessToken();

  const userIdFromParamUrl = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserProfilePicFromSlice = useSelector(
    (state) => state.user.userProfilePicture
  );
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const currentUserShortBioFromSlice = useSelector(
    (state) => state.user.userBiodata
  );

  const [userProfilePictureById, setUserProfilePictureById] = useState(null);
  const [userAvatarById, setUserAvatarById] = useState(null);
  const [userShortBioById, setUserShortBioById] = useState(null);

  const displayUserImageProfile =
    userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserProfilePicFromSlice
      : userProfilePictureById;

  const diplayUserImageAvatar =
    userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserAvatarFromSlice
      : userAvatarById;

  const displayUserShortBio =
    userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserShortBioFromSlice
      : userShortBioById;

  useEffect(() => {
    const hitApiUserById = (tokenOfCurrentUser, idOfUserInParamUrl) => {
      getUserById(tokenOfCurrentUser, idOfUserInParamUrl)
        .then((userById) => {
          const user = userById.data.userByIdData;
          setUserProfilePictureById(user.Profile.profileCoverUrl);
          setUserAvatarById(user.Profile.avatarUrl);
          setUserShortBioById(user.Profile.biodata);
        })
        .catch((error) => {
          console.error(
            "error of user by id in profile component:",
            error.response
          );
        });
    };

    if (access_token) hitApiUserById(access_token, userIdFromParamUrl);
  }, [access_token, userIdFromParamUrl, dispatch]);

  useEffect(() => {
    if (access_token) userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="profile">
      {isDesktop && <Leftbar />}
      <div className="profile-right">
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

        <div className="profile-right-bottom">
          {!isDesktop && (
            <Rightbar profile userId={userId} username={username} />
          )}

          <Feed profile userId={userId} username={username} />

          {isDesktop && (
            <Rightbar profile userId={userId} username={username} />
          )}
        </div>
      </div>
    </div>
  );
}
