import React, { useState, useEffect, Fragment } from "react";
import Online from "../online/Online";
import BirthdayEvent from "../birthday-event/BirthdayEvent";
import { getAllUsersRegistered } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { hbdChecker } from "../../utils/birthdayChecker";
import "./Rightbar.scss";

export default function Rightbar() {
  const dispatch = useDispatch();

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);
  const userSnapRegisteredStatus = useSelector(
    (state) => state.user.snapUserLogout
  );

  const [usersOnlineWithoutCurrentUser, setUsersOnlineWithoutCurrentUser] = useState([]);
  const [usersBirthday, setUsersBirthday] = useState([]);

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

  return (
    <div className="rightbar">
      <div className="rightbar-wrapper">
        {homeRightbar()}
      </div>
    </div>
  );
}
