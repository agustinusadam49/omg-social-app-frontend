import React, { Fragment, useEffect, useState, useMemo } from "react";

import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { accessToken } from "../../utils/getLocalStorage";
import { setMessageNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";

import NotificationCard from "../notification-card/NotificationCard";
import PaginationNotif from "../pagination-notif/PaginationNotif";
import EmptyStateNotification from "../empty-state-notification/EmptyStateNotification";
import GlobalButton from "../button/GlobalButton";

import "./MessageNotifContents.scss";

export default function MessageNotifContents() {
  const access_token = accessToken();
  const dispatch = useDispatch();

  const messageNotifFromSlice = useSelector(
    (state) => state.notifications.messageNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const [staticFilteredData, setStaticFilteredData] = useState(messageNotifFromSlice);
  const [notifMessageDataObj, setNotifMessageDataObj] = useState({});
  const [activePageIndex, setActivePageIndex] = useState("page1");
  const [notifArrByActivePage, setNotifArrByActivePage] = useState([]);

  const notReadYetMessageNotifications = useMemo(() => {
    const result = messageNotifFromSlice.filter((notif) => notif.isRead === false);
    return result;
  }, [messageNotifFromSlice]);

  const changeButton = () => {
    if (!notReadYetMessageNotifications.length) return;

    const payloadUpdate = {
      type: "Messages",
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
          const changeAllIsReadStatus = messageNotifFromSlice
            .filter((item) => item)
            .map((messageNotifItem) => ({
              ...messageNotifItem,
              isRead: true,
            }));

          dispatch(setMessageNotif({ messageNotifData: changeAllIsReadStatus }));
        }
      })
      .catch((error) => {
        const errorMessageFromApi =
          error?.response?.data?.err?.errorMessage ||
          "failed edit notification status read by id!";
        console.log(errorMessageFromApi);
      });
  };

  const displayMessageNotifData = () => {
    if (staticFilteredData.length) {
      return (
        <Fragment>
          {notifArrByActivePage?.map((notifMessageItem) => (
            <NotificationCard
              key={notifMessageItem.id}
              notifications={notifMessageItem}
            />
          ))}
        </Fragment>
      );
    }

    return <EmptyStateNotification type={"messages"} />;
  };

  const displayButtonMarkAllNotif = () => {
    if (messageNotifFromSlice.length) {
      return (
        <GlobalButton
          classStyleName={`message-notif-mark-all-button ${
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
    if (messageNotifFromSlice.length) {
      return (
        <PaginationNotif
          pagePathName={"/message-notifications"}
          notifDataSlices={messageNotifFromSlice}
          notifDataObj={notifMessageDataObj}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setNotifDataObj={setNotifMessageDataObj}
        />
      );
    }
  };

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = messageNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [messageNotifFromSlice]);

  useEffect(() => {
    const newArr = notifMessageDataObj[activePageIndex];
    setNotifArrByActivePage(newArr);
  }, [notifMessageDataObj, activePageIndex]);

  useEffect(() => {
    const staticSortedData = messageNotifFromSlice
      .filter((item) => item)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setStaticFilteredData(staticSortedData);
  }, [messageNotifFromSlice]);

  useEffect(() => {
    if (access_token) {
      getNotificationsBelongsToLoggedUser(access_token, dispatch);
    }

    return () => {
      dispatch(setMessageNotif({ messageNotifData: [] }));
    };
  }, [access_token, dispatch]);

  return (
    <div className="message-notif-contents">
      <div className="message-notif-title">Message Notifications</div>
      <div className="message-notif-card-wrapper">
        <div className="message-notif-card-inner-wrapper">
          {displayMessageNotifData()}
        </div>
        {displayButtonMarkAllNotif()}
      </div>
      {displayPagination()}
    </div>
  );
}