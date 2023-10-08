import React, { useState, useEffect } from "react";
import EditProfileModal from "../edit-profile-modal/EditProfileModal";
import EditAvatarModal from "../edit-avatar-modal/EditAvatarModal";
import { userInfoLogin, getAllUsersRegistered } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { getUserById } from "../../apiCalls/registerAndLoginApiFetch";

import RightbarUserInformation from "./rightbar-user-information/RightbarUserInformation";
import RightbarFollowingSection from "./rightbar-user-information/rightbar-following-section/RightbarFollowingSection";

import "./RightbarProfile.scss";

export default function RightbarProfile({ userId }) {
  const dispatch = useDispatch();
  const user_id = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserData = useSelector((state) => state.user.currentUsers);
  const currentUserFollower = currentUserData.followers;

  const [userProfile, setUserProfile] = useState(null);
  const [userFollower, setUserFollower] = useState([]);
  const [userFollowing, setUserFollowing] = useState([]);
  const [mainUserData, setMainUserData] = useState(null);
  const [editSnap, setEditSnap] = useState(false);
  const [userFollowerTotal, setUserFollowerTotal] = useState([]);
  const [myFollower, setMyFollower] = useState([]);
  const [isModalProfileOpen, setIsModalProfileOpen] = useState(false);
  const [isModalAvatarOpen, setIsModalAvatarOpen] = useState(false);

  const openModalEditProfile = (valueStatus) => {
    setIsModalProfileOpen(valueStatus);
  };

  const openModalEditAvatarAndCoverUrl = (valueStatus) => {
    setIsModalAvatarOpen(valueStatus);
  };

  const closeModalEditProfile = (valueStatus) => {
    setIsModalProfileOpen(valueStatus);
  };

  const closeModalEditAvatarAndCoverUrl = (valueStatus) => {
    setIsModalAvatarOpen(valueStatus);
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
    if (currentUserFollower) {
      setMyFollower(
        currentUserFollower.map((user) => ({
          id: user.id,
          username: user.userName,
          avatarUrl: user.Profile.avatarUrl,
        }))
      );
    }

    return () => {
      setMyFollower([]);
    };
  }, [currentUserFollower]);

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
          setUserFollowerTotal(
            follower.map((user) => ({
              id: user.User.id,
              username: user.User.userName,
              avatarUrl: user.User.Profile.avatarUrl,
            }))
          );
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

        {!!userFollowerTotal.length && currentUserIdFromSlice !== user_id && (
          <RightbarFollowingSection
            title={`${mainUserData.userName}'s Followers`}
            followers={userFollowerTotal}
          />
        )}

        {!!myFollower.length && currentUserIdFromSlice === user_id && (
          <RightbarFollowingSection
            title="Your Followers"
            followers={myFollower}
          />
        )}
      </div>

      {isModalAvatarOpen && (
        <EditAvatarModal
          userProfileData={userProfile}
          closeModalEditProfile={closeModalEditAvatarAndCoverUrl}
          doSnapForEditProfile={doSnapForEditProfile}
        />
      )}

      {isModalProfileOpen && (
        <EditProfileModal
          userProfileData={userProfile}
          closeModalEditProfile={closeModalEditProfile}
          doSnapForEditProfile={doSnapForEditProfile}
        />
      )}
    </div>
  );
}
