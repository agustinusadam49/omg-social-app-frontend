import React, { useEffect, useState, useMemo } from "react";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useSelector, useDispatch } from "react-redux";
import { userInfoLogin } from "../../redux/apiCalls";
import { useParams } from "react-router-dom";
import { getUserById } from "../../apiCalls/registerAndLoginApiFetch";
import { useScreenWidth } from "../../utils/screenWidth";
import "./Profile.scss";

export default function Profile() {
  const isDesktop = useScreenWidth("lg");
  const dispatch = useDispatch();

  const { userId, username } = useParams();

  const userIdFromParamUrl = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserProfilePicFromSlice = useSelector((state) => state.user.userProfilePicture);
  const currentUserAvatarFromSlice = useSelector((state) => state.user.userAvatarPicture);
  const currentUserShortBioFromSlice = useSelector((state) => state.user.userBiodata);

  const [userProfilePictureById, setUserProfilePictureById] = useState(null);
  const [userAvatarById, setUserAvatarById] = useState(null);
  const [userShortBioById, setUserShortBioById] = useState(null);

  const displayUserImageProfile = useMemo(() => {
    return userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserProfilePicFromSlice
      : userProfilePictureById;
  }, [
    userIdFromParamUrl,
    currentUserIdFromSlice,
    currentUserProfilePicFromSlice,
    userProfilePictureById,
  ]);

  const diplayUserImageAvatar = useMemo(() => {
    return userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserAvatarFromSlice
      : userAvatarById;
  }, [
    userIdFromParamUrl,
    currentUserIdFromSlice,
    currentUserAvatarFromSlice,
    userAvatarById,
  ]);

  const displayUserShortBio = useMemo(() => {
    return userIdFromParamUrl === currentUserIdFromSlice
      ? currentUserShortBioFromSlice
      : userShortBioById;
  }, [
    userIdFromParamUrl,
    currentUserIdFromSlice,
    currentUserShortBioFromSlice,
    userShortBioById,
  ]);

  useEffect(() => {
    const hitApiUserById = (idOfUserInParamUrl) => {
      getUserById(idOfUserInParamUrl)
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

    hitApiUserById(userIdFromParamUrl);
  }, [userIdFromParamUrl, dispatch]);

  useEffect(() => {
    userInfoLogin(dispatch);
  }, [dispatch]);

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
