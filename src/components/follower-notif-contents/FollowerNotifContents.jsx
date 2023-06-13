import React, { Fragment, useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import { setFollowerNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";

import NotificationCard from "../notification-card/NotificationCard";
import PaginationNotif from "../pagination-notif/PaginationNotif";
import GlobalButton from "../button/GlobalButton";
import EmptyStateNotification from "../empty-state-notification/EmptyStateNotification";

import "./FollowerNotifContents.scss";

export default function FollowerNotifContents() {
  const access_token = accessToken();
  const dispatch = useDispatch();

  const followerNotifFromSlice = useSelector(
    (state) => state.notifications.followerNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const [staticFilteredData, setStaticFilteredData] = useState(followerNotifFromSlice);
  const [notifFollowerDataObj, setNotifFollowerDataObj] = useState({});
  const [activePageIndex, setActivePageIndex] = useState("page1");
  const [notifArrByActivePage, setNotifArrByActivePage] = useState([]);

  const notReadYetFollowerNotifications = useMemo(() => {
    const result = followerNotifFromSlice.filter((notif) => notif.isRead === false);
    return result;
  }, [followerNotifFromSlice]);

  const changeButton = () => {
    if (!notReadYetFollowerNotifications.length) return;

    const payloadUpdate = {
      type: "Follows",
      isRead: true,
    };

    updateAllNotificationStatusNotRead(
      access_token,
      currentUserIdFromSlice,
      payloadUpdate
    )
      .then((updateResponse) => {
        const response = updateResponse.data;
        if (response.success === true) {
          const changeAllIsReadStatus = followerNotifFromSlice
            .filter((item) => item)
            .map((followerNotifItem) => ({
              ...followerNotifItem,
              isRead: true,
            }));

          dispatch(setFollowerNotif({ followerNotifData: changeAllIsReadStatus }));
        }
      })
      .catch((error) => {
        const errorMessageFromApi =
          error?.response?.data?.err?.errorMessage ||
          "failed edit notification status read by id!";
        console.log(errorMessageFromApi);
      });
  };

  const displayFollowerNotifData = () => {
    if (staticFilteredData.length) {
      return (
        <Fragment>
          {notifArrByActivePage?.map((notifFollowItem) => (
            <NotificationCard
              key={notifFollowItem.id}
              notifications={notifFollowItem}
            />
          ))}
        </Fragment>
      );
    }

    return <EmptyStateNotification type={"follows"} />;
  };

  const displayButtonMarkAllNotif = () => {
    if (followerNotifFromSlice.length) {
      return (
        <GlobalButton
          classStyleName={`follower-notif-mark-all-notif-button ${
            totalAllIsRead ? "active" : "not-active"
          }`}
          buttonLabel={
            totalAllIsRead
              ? "Tandai semua sebagai dibaca"
              : "Semua notif telah dibaca"
          }
          onClick={() => changeButton()}
        />
      );
    }
  };

  const displayPagination = () => {
    if (followerNotifFromSlice.length) {
      return (
        <PaginationNotif
          pagePathName={"/follower-notifications"}
          notifDataSlices={followerNotifFromSlice}
          notifDataObj={notifFollowerDataObj}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setNotifDataObj={setNotifFollowerDataObj}
        />
      );
    }
  };

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = followerNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [followerNotifFromSlice]);

  useEffect(() => {
    const newArr = notifFollowerDataObj[activePageIndex];
    setNotifArrByActivePage(newArr);
  }, [notifFollowerDataObj, activePageIndex]);

  useEffect(() => {
    const staticSortedData = followerNotifFromSlice
      .filter((item) => item)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setStaticFilteredData(staticSortedData);
  }, [followerNotifFromSlice]);

  useEffect(() => {
    if (access_token) {
      getNotificationsBelongsToLoggedUser(access_token, dispatch);
    }

    return () => {
      dispatch(setFollowerNotif({ followerNotifData: [] }));
    };
  }, [access_token, dispatch]);

  return (
    <div className="follower-notif-contents">
      <div className="follower-notif-title">Follow Notifications</div>
      <div className="follower-notif-card-wrapper">
        <div className="follower-notif-card-inner-wrapper">
          {displayFollowerNotifData()}
        </div>
        {displayButtonMarkAllNotif()}
      </div>
      {displayPagination()}
    </div>
  );
}