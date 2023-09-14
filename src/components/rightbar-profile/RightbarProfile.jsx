import React, { useState, useEffect, Fragment, useReducer } from "react";
import EditProfileModal from "../edit-profile-modal/EditProfileModal";
import GlobalButton from "../button/GlobalButton";
import { formatBirthDate } from "../../utils/formatDate";
import { userInfoLogin, getAllUsersRegistered } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { getUserById } from "../../apiCalls/registerAndLoginApiFetch";
import {
  addNewFollower,
  deleteFollowById,
} from "../../apiCalls/followsApiFetch";
import { createNewNotification } from "../../apiCalls/notificationsApiFetch";
import RightbarInfoSection from "./rightbar-info-section/RightbarInfoSection";
import RightbarInfoTitle from "./rightbar-info-title/RightbarInfoTitle";
import RightbarInfoItem from "./rightbar-info-item/RightbarInfoItem";
import RightbarFollowingSection from "./rightbar-following-section/RightbarFollowingSection";

import "./RightbarProfile.scss";

const INITIAL_FOLLOW_STATE = {
  loading: false,
};

const actionType = {
  FOLLOW_OR_UNFOLLOW: "FOLLOW_OR_UNFOLLOW",
  FINISH_FOLLOW_OR_UNFOLLOW: "FINISH_FOLLOW_OR_UNFOLLOW",
};

const followReducer = (state, action) => {
  switch (action.type) {
    case "FOLLOW_OR_UNFOLLOW": {
      return {
        ...state,
        loading: true,
      };
    }
    case "FINISH_FOLLOW_OR_UNFOLLOW": {
      return {
        ...state,
        loading: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};

export default function RightbarProfile({ userId }) {
  const [followState, mutate] = useReducer(followReducer, INITIAL_FOLLOW_STATE);
  const dispatch = useDispatch();
  const user_id = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserData = useSelector((state) => state.user.currentUsers);
  const currentUserFollower = currentUserData.followers;
  const currentUserFollowing = currentUserData.following;
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);

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
  const [myFollower, setMyFollower] = useState([]);

  useEffect(() => {
    if (currentUserFollower && allUsersRegisterd) {
      const userFollowerMap = new Map();
      for (let i = 0; i < currentUserFollower.length; i++) {
        userFollowerMap.set(
          `${currentUserFollower[i].UserId}`,
          currentUserFollower[i].UserId
        );
      }

      const userFollowerThisCurrentUser = allUsersRegisterd.filter((user) =>
        userFollowerMap.has(`${user.id}`)
      );

      setMyFollower(userFollowerThisCurrentUser);
    }

    return () => {
      setMyFollower([]);
    };
  }, [currentUserFollower, allUsersRegisterd]);

  const getCurrentUserFollowedBy = () => {
    let result = [];
    if (userFollowing && userFollowing.length) {
      result = userFollowing.filter(
        (user) => user.ProfileId === currentUserIdFromSlice
      );
    }

    if (result.length) {
      return (
        <span className="user-following-info">{"He/She is following you"}</span>
      );
    }
  };

  const getFollowingStatus = () => {
    if (userFollower.length) {
      return (
        <span className="user-following-info">{`You are following Him/Her`}</span>
      );
    }
  };

  const followHandler = () => {
    const followDataId = userFollower.length ? userFollower[0].id : 0;
    if (userFollower.length) {
      hitApiDeleteFollowById(followDataId);
    } else {
      hitApiAddNewFollower();
    }
  };

  const hitCreateNewNotification = (idOfThisFollowData, inputStatusFollow) => {
    const payloadDataAddFollow = {
      senderName: currentUserNameFromSlice,
      statusFollow: inputStatusFollow,
      receiver_id: user_id,
      source_id: idOfThisFollowData,
    };

    createNewNotification(payloadDataAddFollow)
      .then(() => {})
      .catch((error) => {
        console.log("error createNewNotification:", error.response);
      });
  };

  const hitApiDeleteFollowById = (idOfThisFollowData) => {
    mutate({ type: actionType.FOLLOW_OR_UNFOLLOW });
    deleteFollowById(idOfThisFollowData)
      .then((deleteFollowerByIdResult) => {
        if (deleteFollowerByIdResult.data.success) {
          setEditSnap(true);
          hitCreateNewNotification(idOfThisFollowData, "un-follow");
        }
        mutate({ type: actionType.FINISH_FOLLOW_OR_UNFOLLOW });
      })
      .catch((error) => {
        const errorMessageDeleteFollowerById = error.response;
        console.log(
          "errorMessageDeleteFollowerById",
          errorMessageDeleteFollowerById
        );

        mutate({ type: actionType.FINISH_FOLLOW_OR_UNFOLLOW });
      });
  };

  const hitApiAddNewFollower = () => {
    const profileId = userProfile.id;
    const payloadDataAddFollow = {
      ProfileId: profileId,
    };
    mutate({ type: actionType.FOLLOW_OR_UNFOLLOW });
    addNewFollower(payloadDataAddFollow)
      .then((newFollowerResult) => {
        const sourceId = newFollowerResult.data.newFollow.id;
        if (newFollowerResult.data.success) {
          setEditSnap(true);
          hitCreateNewNotification(sourceId, "mem-follow");
        }

        mutate({ type: actionType.FINISH_FOLLOW_OR_UNFOLLOW });
      })
      .catch((error) => {
        mutate({ type: actionType.FINISH_FOLLOW_OR_UNFOLLOW });
        const errorAddNewFollower = error.response;
        console.log("errorAddNewFollower", errorAddNewFollower);
      });
  };

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

  const displayFollowButton = () => {
    if (followState.loading || editSnap) {
      return (
        <Fragment>
          <div className="follow-button loading">Loading ...</div>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <div
          className={`follow-button ${
            userFollower.length ? "active" : "not-active"
          }`}
          onClick={() => followHandler()}
        >
          {userFollower.length ? "Unfollow" : "Follow"}
        </div>
      </Fragment>
    );
  };

  const profileRightbar = (userProfileDataLogin, userDataMain) => {
    const infoItems = [
      {
        primaryLabel: "Fullname",
        secondaryLabel: null,
        mainValue: userDataMain.userFullname ? userDataMain.userFullname : "-",
      },
      {
        primaryLabel: "User Name",
        secondaryLabel: null,
        mainValue: userDataMain.userName ? userDataMain.userName : "-",
      },
      {
        primaryLabel: "Email",
        secondaryLabel: null,
        mainValue: userDataMain.userEmail ? userDataMain.userEmail : "-",
      },
      {
        primaryLabel: "Biodata",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.biodata
          ? userProfileDataLogin.biodata
          : "-",
      },
      {
        primaryLabel: "Address",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.address
          ? userProfileDataLogin.address
          : "-",
      },
      {
        primaryLabel: "Birth Date",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.birthDate
          ? formatBirthDate(userProfileDataLogin.birthDate)
          : "-",
      },
      {
        primaryLabel: "Status",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.status
          ? userProfileDataLogin.status
          : "-",
      },
      {
        primaryLabel: "Quotes",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.quotes
          ? userProfileDataLogin.quotes
          : "-",
      },
      {
        primaryLabel: "PhoneNumber",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.phoneNumber
          ? userProfileDataLogin.phoneNumber
          : "-",
      },
      {
        primaryLabel: "City",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.currentCity
          ? userProfileDataLogin.currentCity
          : "-",
      },
      {
        primaryLabel: "Nationality",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.nationality
          ? userProfileDataLogin.nationality
          : "-",
      },
      {
        primaryLabel: "Relationship",
        secondaryLabel: null,
        mainValue: userProfileDataLogin.relationship
          ? userProfileDataLogin.relationship
          : "-",
      },
    ];

    return (
      <Fragment>
        {currentUserIdFromSlice !== user_id && displayFollowButton()}

        <RightbarInfoSection>
          <RightbarInfoTitle>User Information</RightbarInfoTitle>

          {infoItems.map((infoItem, idx) => (
            <RightbarInfoItem
              key={idx}
              leftLabel={infoItem.primaryLabel}
              rightLabel={infoItem.secondaryLabel}
              infoValue={infoItem.mainValue}
            />
          ))}

          {currentUserIdFromSlice !== user_id && (
            <Fragment>
              <RightbarInfoItem
                leftLabel="Follower"
                rightLabel={getFollowingStatus()}
                infoValue={
                  userFollowerTotal.length ? userFollowerTotal.length : "-"
                }
              />

              <RightbarInfoItem
                leftLabel="Following"
                rightLabel={getCurrentUserFollowedBy()}
                infoValue={userFollowing.length ? userFollowing.length : "-"}
              />
            </Fragment>
          )}

          {currentUserIdFromSlice === user_id && (
            <Fragment>
              <RightbarInfoItem
                leftLabel="Follower"
                infoValue={
                  currentUserFollower ? currentUserFollower.length : "-"
                }
              />

              <RightbarInfoItem
                leftLabel="Following"
                infoValue={
                  currentUserFollowing ? currentUserFollowing.length : "-"
                }
              />
            </Fragment>
          )}

          {currentUserIdFromSlice === user_id && (
            <Fragment>
              <GlobalButton
                buttonLabel={"Edit Your Avatar and Cover Url"}
                classStyleName={"edit-profile-button"}
                onClick={() => openModalEditAvatarAndCoverUrl(true)}
              />

              <GlobalButton
                buttonLabel={"Edit Your Profile"}
                classStyleName={"edit-profile-button"}
                onClick={() => openModalEditProfile(true)}
              />
            </Fragment>
          )}
        </RightbarInfoSection>

        {!!userFollowerTotal.length && currentUserIdFromSlice !== user_id && (
          <RightbarFollowingSection
            title={`${userDataMain.userName}'s Followers`}
            followers={userFollowerTotal.map((user) => ({
              id: user.User.id,
              username: user.User.userName,
              avatarUrl: user.User.Profile.avatarUrl,
            }))}
          />
        )}

        {!!myFollower.length && currentUserIdFromSlice === user_id && (
          <RightbarFollowingSection
            title="Your Followers"
            followers={myFollower.map((user) => ({
              id: user.id,
              username: user.userName,
              avatarUrl: user.Profile.avatarUrl,
            }))}
          />
        )}
      </Fragment>
    );
  };

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
        {userProfile &&
          mainUserData &&
          profileRightbar(userProfile, mainUserData)}
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
