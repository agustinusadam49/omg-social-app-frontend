import React, { useState, useEffect } from "react";
import { getAllUsersRegistered } from "../../redux/apiCalls";
import { hbdChecker } from "../../utils/birthdayChecker";
import { useSelector, useDispatch } from "react-redux";

import "./EventContents.scss";

const EventContents = () => {
  const dispatch = useDispatch();
  const isAd = true;

  const allUsersRegisterd = useSelector((state) => state.user.allUsers);

  const [usersBirthday, setUsersBirthday] = useState([]);

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
  }, [dispatch]);

  return (
    <div className="event-contents">
      <div className="event-contents-wrapper">
        <div className="event-contents-title">Events</div>
        <div className="event-contents-main">
          {/* Users Birthday sections */}
          {!!usersBirthday.length && (
            <div className="event-content-main-user-birthday-section">
              <div className="event-content-user-birthday-title">
                Daftar orang yang sedang berulang tahun hari ini
              </div>

              <div className="event-content-user-birthday-lists">
                {usersBirthday.map((user) => (
                  <div
                    key={user.id}
                    className="event-content-user-birthday-item"
                  >
                    <div className="event-content-user-image-wrapper">
                      <img
                        src={user.Profile.avatarUrl}
                        alt="user-avatar-img"
                        className="event-content-user-img"
                      />
                    </div>

                    <div className="event-content-username-wrapper">
                      <div className="event-content-username">
                        {user.userName}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ad Section */}
          {isAd && (
            <div className="event-content-main-ad-section">
              <div className="event-content-ad-image-wrapper">
                <img
                  src="/assets/ad.png"
                  alt="advertisement"
                  className="event-content-ad-image"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventContents;
