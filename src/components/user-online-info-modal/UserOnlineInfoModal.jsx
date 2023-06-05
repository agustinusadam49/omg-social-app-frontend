import React, { useState, useEffect } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import { useDispatch, useSelector } from "react-redux";
import { setIsUserOnlineModalOpen } from "../../redux/slices/userSlice";
import { getAllUsersRegistered } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import { hbdChecker } from "../../utils/birthdayChecker";
import Online from "../online/Online";
import BirthdayEvent from "../birthday-event/BirthdayEvent";
import "./UserOnlineInfoModal.scss";

export default function UserOnlineInfoModal() {
  const access_token = accessToken();
  const dispatch = useDispatch();

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);

  const [usersOnlineWithoutCurrentUser, setUsersOnlineWithoutCurrentUser] =
    useState([]);
  const [usersBirthday, setUsersBirthday] = useState([]);

  const toggleUserOnlineModal = (value) => {
    dispatch(setIsUserOnlineModalOpen({ isUserOnlineModalOpen: value }));
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
    const usersWithoutCurrentUser = allUsersRegisterd.filter(
      (user) => user.id !== currentUserIdFromSlice
    );
    setUsersOnlineWithoutCurrentUser(usersWithoutCurrentUser);
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
    if (access_token) getAllUsersRegistered(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="content-container user-online-modal">
      <div className="user-online-modal-content-wrapper">
        {/* Top Content of Modal */}
        <div className="user-online-modal-top-content">
          <div className="user-online-modal-top-content-title">
            Users Online Info
          </div>
          <CancelIcon
            className="user-online-modal-close-button"
            onClick={() => toggleUserOnlineModal(false)}
          />
        </div>

        {/* Middle Content of Modal */}
        <div className="user-online-modal-middle-content">
          {displayBirthdayEvent()}
          <img
            src="/assets/ad.png"
            alt="advertisement"
            className="user-online-modal-middle-content-ad"
          />

          {usersOnlineWithoutCurrentUser.length < 1 && (
            <div className="user-online-modal-bottom-content-empty-state">
              Belum ada user yang online saat ini
            </div>
          )}
        </div>

        {/* Bottom Content of Modal */}
        {!!usersOnlineWithoutCurrentUser.length && (
          <div className="user-online-modal-bottom-content">
            <ul className="user-online-modal-bottom-content-friend-list">
              {usersOnlineWithoutCurrentUser.map((user) => (
                <Online key={user.id} user={user} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
