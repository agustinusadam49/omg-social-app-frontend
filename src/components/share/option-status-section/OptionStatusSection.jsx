import React, { useMemo, useEffect, useState } from "react";
import { userInfoLogin } from "../../../redux/apiCalls";
import { accessToken } from "../../../utils/getLocalStorage";
import { useSelector, useDispatch } from "react-redux";

import "./OptionStatusSection.scss";

export default function OptionStatusSection({ setActiveStatus, activeStatus }) {
  const dispatch = useDispatch();
  const access_token = accessToken();

  const currentUserData = useSelector((state) => state.user.currentUsers);
  const currentUserFollower = currentUserData.followers;
  const [currentUserLoginFollowers, setCurrentUserLoginFollowers] = useState(
    []
  );

  const shareOptionStatus = useMemo(() => {
    let statusOptions = [
      {
        name: "PUBLIC",
        description: "Semua orang dapat melihat postingan mu.",
      },
      {
        name: "PRIVATE",
        description: "Hanya kamu yang dapat melihat postingan ini.",
      },
    ];

    let followersOnlyStatus = {
      name: "FOLLOWERS_ONLY",
      description:
        "Hanya kamu dan followers mu yang dapat melihat postingan ini.",
    };

    if (currentUserLoginFollowers.length) {
      statusOptions.push(followersOnlyStatus);
    }

    return statusOptions;
  }, [currentUserLoginFollowers]);

  const getStatus = (statusFromResponse) => {
    const POST_STATUS_ENUM = {
      PUBLIC: "Public",
      PRIVATE: "Private",
      FOLLOWERS_ONLY: "Followers Only",
    };

    return POST_STATUS_ENUM[statusFromResponse];
  };

  const toggleActiveStatus = (status) => {
    if (status === activeStatus) return;
    setActiveStatus(status);
  };

  useEffect(() => {
    if (currentUserFollower) {
      const followers = currentUserFollower.map((follower) => follower) || [];
      setCurrentUserLoginFollowers(followers);
    }
  }, [currentUserFollower]);

  useEffect(() => {
    userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="option-status-section">
      {shareOptionStatus.map((status, index) => (
        <div
          key={index}
          className={`share-status-option-item ${
            activeStatus === status.name ? "active" : ""
          }`}
          onClick={() => toggleActiveStatus(status.name)}
        >
          <div className="share-status-name">{getStatus(status.name)}</div>
          <div className="share-status-description">{status.description}</div>
        </div>
      ))}
    </div>
  );
}
