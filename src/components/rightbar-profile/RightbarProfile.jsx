import React, { useState, useEffect } from "react";
import EditProfileModal from "../edit-profile-modal/EditProfileModal";
import { userInfoLogin, getAllUsersRegistered } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { getUserById } from "../../apiCalls/registerAndLoginApiFetch";

import RightbarUserInformation from "./rightbar-user-information/RightbarUserInformation";

import "./RightbarProfile.scss";

export default function RightbarProfile({ userId }) {
  const dispatch = useDispatch();
  const user_id = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserData = useSelector((state) => state.user.currentUsers);

  const [userProfile, setUserProfile] = useState(null);
  const [userFollower, setUserFollower] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [mainUserData, setMainUserData] = useState(null);
  const [isModalEditProfileOpen, setIsModalEditProfileOpen] = useState(false);
  const [
    isModalEditAvatarAndCoverUrlOpen,
    setIsModalEditAvatarAndCoverUrlOpen,
  ] = useState(false);
  const [editSnap, setEditSnap] = useState(false);
  const [userFollowerTotal, setUserFollowerTotal] = useState([]);

  const openModalEditProfile = (valueStatus) => {
    setIsModalEditProfileOpen(valueStatus);
  };

  const openModalEditAvatarAndCoverUrl = (valueStatus) => {
    setIsModalEditAvatarAndCoverUrlOpen(valueStatus);
  };

  const closeModalEditProfile = (valueStatus) => {
    setIsModalEditProfileOpen(valueStatus);
  };

  const closeModalEditAvatarAndCoverUrl = (valueStatus) => {
    setIsModalEditAvatarAndCoverUrlOpen(valueStatus);
  };

  const doSnapForEditProfile = (valueStatus) => {
    setEditSnap(valueStatus);
  };

  useEffect(() => {
    getAllUsersRegistered(dispatch);
  }, [dispatch]);

  useEffect(() => {
    if (currentUserIdFromSlice === user_id) {
      if (currentUserData) {
        setUserProfile(currentUserData.profile);
        setMainUserData(currentUserData);
      }
    }
  }, [currentUserData, userProfile, currentUserIdFromSlice, user_id]);

  useEffect(() => {
    const hitApiUserById = (idOfUserInParamUrl) => {
      getUserById(idOfUserInParamUrl)
        .then((userById) => {
          const user = userById.data.userByIdData;
          const follower = userById.data.userByIdFollower;
          const following = userById.data.userByIdFollowing;
          setUserProfile(user.Profile);
          setMainUserData(user);
          setUserFollower(
            follower.filter((item) => item.UserId === currentUserIdFromSlice)
          );
          setUserFollowerTotal(follower);
          setUserFollowing(following);
          setEditSnap(false);
        })
        .catch((error) => {
          console.log(
            "error of user by id in rightbar component:",
            error.response
          );
        });
    };

    if (user_id === currentUserIdFromSlice) {
      userInfoLogin(dispatch);
      setEditSnap(false);
    } else {
      hitApiUserById(user_id);
    }
  }, [user_id, currentUserIdFromSlice, editSnap, dispatch]);

  return (
    <div className="rightbar-profile">
      <div className="rightbar-profile-wrapper">
        {userProfile && mainUserData && (
          <RightbarUserInformation
            userProfileDataLogin={userProfile}
            userDataMain={mainUserData}
            user_id={user_id}
            userFollower={userFollower}
            userProfile={userProfile}
            userFollowerTotal={userFollowerTotal}
            userFollowing={userFollowing}
            editSnap={editSnap}
            setEditSnap={setEditSnap}
            openModalEditAvatarAndCoverUrl={openModalEditAvatarAndCoverUrl}
            openModalEditProfile={openModalEditProfile}
          />
        )}
      </div>

      {isModalEditProfileOpen && (
        <EditProfileModal
          userProfileData={userProfile}
          closeModalEditProfile={closeModalEditProfile}
          doSnapForEditProfile={doSnapForEditProfile}
          modalActive={"edit-profile"}
        />
      )}

      {isModalEditAvatarAndCoverUrlOpen && (
        <EditProfileModal
          userProfileData={userProfile}
          closeModalEditProfile={closeModalEditAvatarAndCoverUrl}
          doSnapForEditProfile={doSnapForEditProfile}
          modalActive={"edit-avatar-and-cover-url"}
        />
      )}
    </div>
  );
}
