import React, { useMemo, useEffect, useState } from "react";
import { userInfoLogin } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";

import OptionStatusWrapper from "./option-status-wrapper/OptionStatusWrapper";
import OptionStatusItem from "./option-status-item/OptionStatusItem";
import OptionStatusName from "./option-status-name/OptionStatusName";
import OptionStatusDescription from "./option-status-description/OptionStatusDescription";
import {
  STATUS_OPTIONS_DESCRIPTION_ENUM,
  STATUS_OPTIONS_ENUM,
} from "./constant";

import { getStatus } from "./utils";

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
        name: STATUS_OPTIONS_ENUM.PUBLIC,
        description: STATUS_OPTIONS_DESCRIPTION_ENUM.PUBLIC,
      },
      {
        name: STATUS_OPTIONS_ENUM.PRIVATE,
        description: STATUS_OPTIONS_DESCRIPTION_ENUM.PRIVATE,
      },
    ];

    let followersOnlyStatus = {
      name: STATUS_OPTIONS_ENUM.FOLLOWERS_ONLY,
      description: STATUS_OPTIONS_DESCRIPTION_ENUM.FOLLOWERS_ONLY,
    };

    if (currentUserLoginFollowers.length) {
      statusOptions.push(followersOnlyStatus);
    }

    return statusOptions;
  }, [currentUserLoginFollowers]);

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
            <OptionStatusName statusName={getStatus(name, STATUS_OPTIONS_ENUM)} />
            <OptionStatusDescription statusDescription={description} />
          </OptionStatusItem>
        );
      })}
    </OptionStatusWrapper>
  );
}
