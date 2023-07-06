import React, { useState, useEffect, Fragment, useReducer } from "react";
import { Link } from "react-router-dom";
import Online from "../online/Online";
import EditProfileModal from "../edit-profile-modal/EditProfileModal";
import BirthdayEvent from "../birthday-event/BirthdayEvent";
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
import { hbdChecker } from "../../utils/birthdayChecker";
import "./Rightbar.scss";

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

export default function Rightbar({ profile, userId }) {
  const [followState, mutate] = useReducer(followReducer, INITIAL_FOLLOW_STATE);
  const dispatch = useDispatch();
  const user_id = parseInt(userId);

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserData = useSelector((state) => state.user.currentUsers);
  const currentUserFollower = currentUserData.followers;
  const currentUserFollowing = currentUserData.following;
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);
  const userSnapRegisteredStatus = useSelector(
    (state) => state.user.snapUserLogout
  );

  const [usersOnlineWithoutCurrentUser, setUsersOnlineWithoutCurrentUser] =
    useState([]);
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
  const [usersBirthday, setUsersBirthday] = useState([]);
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

  const displayBirthdayEvent = () => {
    if (usersBirthday && usersBirthday.length) {
      return (
        <BirthdayEvent
          usersBirthday={usersBirthday}
          currentUserIdFromSlice={currentUserIdFromSlice}
        />
      );
    }
  };

  useEffect(() => {
    if (allUsersRegisterd) {
      setUsersOnlineWithoutCurrentUser(
        allUsersRegisterd.filter(
          (user) =>
            user.id !== currentUserIdFromSlice && user.userOnlineStatus === true
        )
      );
    }
  }, [allUsersRegisterd, currentUserIdFromSlice]);

  useEffect(() => {
    if (allUsersRegisterd) {
      const filteredUserTodayBirthday = allUsersRegisterd.filter((user) =>
        hbdChecker(user.Profile.birthDate)
      );
      setUsersBirthday(filteredUserTodayBirthday);
    }
  }, [allUsersRegisterd]);

  useEffect(() => {
    getAllUsersRegistered(dispatch);
  }, [userSnapRegisteredStatus, dispatch]);

  const homeRightbar = () => {
    return (
      <Fragment>
        {displayBirthdayEvent()}

        <img src="/assets/ad.png" alt="advertisement" className="rightbar-ad" />
        <h4 className="rightbar-title">Online Users</h4>

        {usersOnlineWithoutCurrentUser.length < 1 && (
          <div className="empty-state-user-online">
            Belum ada user yang online saat ini
          </div>
        )}

        {!!usersOnlineWithoutCurrentUser.length && (
          <ul className="rightbar-friend-list">
            {usersOnlineWithoutCurrentUser.map((user) => (
              <Online key={user.id} user={user} />
            ))}
          </ul>
        )}
      </Fragment>
    );
  };

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
    return (
      <Fragment>
        {currentUserIdFromSlice !== user_id && displayFollowButton()}

        <div className="rightbar-info">
          <h4 className="rightbar-title">User Information</h4>
          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Fullname:</span>
            <span className="rightbar-info-value">
              {userDataMain.userFullname ? userDataMain.userFullname : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">User Name:</span>
            <span className="rightbar-info-value">
              {userDataMain.userName ? userDataMain.userName : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Email:</span>
            <span className="rightbar-info-value">
              {userDataMain.userEmail ? userDataMain.userEmail : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Biodata:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.biodata
                ? userProfileDataLogin.biodata
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Address:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.address
                ? userProfileDataLogin.address
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Birth Date:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.birthDate
                ? formatBirthDate(userProfileDataLogin.birthDate)
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Status:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.status ? userProfileDataLogin.status : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Quotes:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.quotes ? userProfileDataLogin.quotes : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">PhoneNumber:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.phoneNumber
                ? userProfileDataLogin.phoneNumber
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">City:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.currentCity
                ? userProfileDataLogin.currentCity
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Nationality:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.nationality
                ? userProfileDataLogin.nationality
                : "-"}
            </span>
          </div>

          <div className="rightbar-info-item">
            <span className="rightbar-info-key">Relationship:</span>
            <span className="rightbar-info-value">
              {userProfileDataLogin.relationship
                ? userProfileDataLogin.relationship
                : "-"}
            </span>
          </div>

          {currentUserIdFromSlice !== user_id && (
            <div className="rightbar-info-item">
              <span className="rightbar-info-key">
                Follower: {getFollowingStatus()}
              </span>
              <span className="rightbar-info-value">
                {userFollowerTotal.length ? userFollowerTotal.length : "-"}
              </span>
            </div>
          )}

          {currentUserIdFromSlice !== user_id && (
            <div className="rightbar-info-item">
              <span className="rightbar-info-key">
                Following:
                {getCurrentUserFollowedBy()}
              </span>
              <span className="rightbar-info-value">
                {userFollowing.length ? userFollowing.length : "-"}
              </span>
            </div>
          )}

          {currentUserIdFromSlice === user_id && (
            <div className="rightbar-info-item">
              <span className="rightbar-info-key">Follower:</span>
              <span className="rightbar-info-value">
                {currentUserFollower ? currentUserFollower.length : "-"}
              </span>
            </div>
          )}

          {currentUserIdFromSlice === user_id && (
            <div className="rightbar-info-item">
              <span className="rightbar-info-key">Following:</span>
              <span className="rightbar-info-value">
                {currentUserFollowing ? currentUserFollowing.length : "-"}
              </span>
            </div>
          )}

          {currentUserIdFromSlice === user_id && (
            <GlobalButton
              buttonLabel={"Edit Your Avatar and Cover Url"}
              classStyleName={"edit-profile-button"}
              onClick={() => openModalEditAvatarAndCoverUrl(true)}
            />
          )}

          {currentUserIdFromSlice === user_id && (
            <GlobalButton
              buttonLabel={"Edit Your Profile"}
              classStyleName={"edit-profile-button"}
              onClick={() => openModalEditProfile(true)}
            />
          )}
        </div>

        {!!userFollowerTotal.length && currentUserIdFromSlice !== user_id && (
          <div className="rightbar-followings-wrapper">
            <h4 className="rightbar-title-user-follower">
              {`${userDataMain.userName}'s`} Followers
            </h4>

            <div className="rightbar-followings">
              {userFollowerTotal.map((user, index) => (
                <Link
                  to={`/profile/${user.User.userName}/user-id/${user.User.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                  key={index}
                  className="rightbar-following"
                >
                  <div className="rightbar-following-img-wrapper">
                    <img
                      src={user.User.Profile.avatarUrl}
                      alt="following-user"
                      className="rightbar-following-img"
                    />
                  </div>
                  <div className="rightbar-following-name">
                    {user.User.userName}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {!!myFollower.length && currentUserIdFromSlice === user_id && (
          <div className="rightbar-followings-wrapper">
            <h4 className="rightbar-title-user-follower">Your Followers</h4>

            <div className="rightbar-followings">
              {myFollower.map((user, index) => (
                <Link
                  to={`/profile/${user.userName}/user-id/${user.id}`}
                  style={{ textDecoration: "none", color: "black" }}
                  key={index}
                  className="rightbar-following"
                >
                  <div className="rightbar-following-img-wrapper">
                    <img
                      src={user.Profile.avatarUrl}
                      alt="following-user"
                      className="rightbar-following-img"
                    />
                  </div>
                  <div className="rightbar-following-name">{user.userName}</div>
                </Link>
              ))}
            </div>
          </div>
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

    if (profile) {
      if (user_id === currentUserIdFromSlice) {
        userInfoLogin(dispatch);
        setEditSnap(false);
      } else {
        hitApiUserById(user_id);
      }
    }
  }, [user_id, currentUserIdFromSlice, editSnap, profile, dispatch]);

  return (
    <div className="rightbar">
      <div className={`rightbar-wrapper ${profile ? "profile" : ""}`}>
        {profile && userProfile && mainUserData
          ? profileRightbar(userProfile, mainUserData)
          : homeRightbar()}
      </div>

      {profile && isModalEditProfileOpen && (
        <EditProfileModal
          userProfileData={userProfile}
          closeModalEditProfile={closeModalEditProfile}
          doSnapForEditProfile={doSnapForEditProfile}
          modalActive={"edit-profile"}
        />
      )}

      {profile && isModalEditAvatarAndCoverUrlOpen && (
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
