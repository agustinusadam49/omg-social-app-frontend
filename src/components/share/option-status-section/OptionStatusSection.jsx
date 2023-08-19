import React, { useMemo, useEffect, useState } from "react";
import { userInfoLogin } from "../../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";

import OptionStatusWrapper from "./option-status-wrapper/OptionStatusWrapper";
import OptionStatusItem from "./option-status-item/OptionStatusItem";
import OptionStatusName from "./option-status-name/OptionStatusName";
import OptionStatusDescription from "./option-status-description/OptionStatusDescription";

export default function OptionStatusSection({ setActiveStatus, activeStatus }) {
  const dispatch = useDispatch();

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
    userInfoLogin(dispatch);
  }, [dispatch]);

  return (
    <OptionStatusWrapper>
      {shareOptionStatus.map((status, index) => {
        const { name, description } = status;
        return (
          <OptionStatusItem
            key={index}
            isActive={activeStatus === name}
            onClick={() => toggleActiveStatus(name)}
          >
            <OptionStatusName statusName={getStatus(name)} />
            <OptionStatusDescription statusDescription={description} />
          </OptionStatusItem>
        );
      })}
    </OptionStatusWrapper>
  );
}
