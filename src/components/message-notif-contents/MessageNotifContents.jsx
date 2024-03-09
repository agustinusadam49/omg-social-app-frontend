import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useReducer,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setMessageNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";
import NotificationCard from "../notification-card/NotificationCard";
import PaginationNotif from "../pagination-notif/PaginationNotif";
import EmptyStateNotification from "../empty-state-notification/EmptyStateNotification";
import GlobalButton from "../button/GlobalButton";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";

import "./MessageNotifContents.scss";

export default function MessageNotifContents() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();

  const messageNotifFromSlice = useSelector((state) => state.notifications.messageNotif);
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
    if (loadingState.status) return;
    if (!notReadYetMessageNotifications.length) return;
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const payloadUpdate = {
      type: "Messages",
      isRead: true,
    };
    updateAllNotificationStatusNotRead(currentUserIdFromSlice, payloadUpdate)
      .then((updateResponse) => {
        const response = updateResponse.data;
        if (response.success === true) {
          const changeAllIsReadStatus = messageNotifFromSlice
            .filter((item) => item)
            .map((messageNotifItem) => ({
              ...messageNotifItem,
              isRead: true,
            }));

          dispatch(
            setMessageNotif({ messageNotifData: changeAllIsReadStatus })
          );
          mutate({ type: actionType.STOP_LOADING_STATUS });
        }
      })
      .catch((error) => {
        const errorMessageFromApi =
          error?.response?.data?.err?.errorMessage ||
          "failed edit notification status read by id!";
        console.log(errorMessageFromApi);
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
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
    getNotificationsBelongsToLoggedUser(dispatch);
  }, [dispatch]);

  return (
    <div className="message-notif-contents">
      <div className="message-notif-title">Message Notifications</div>
      <div className="message-notif-card-wrapper">
        <div className="message-notif-card-inner-wrapper">
          {!!staticFilteredData.length ? (
            <Fragment>
              {notifArrByActivePage?.map((notifMessageItem) => (
                <NotificationCard
                  key={notifMessageItem.id}
                  notifications={notifMessageItem}
                />
              ))}
            </Fragment>
          ) : (
            <EmptyStateNotification type={"messages"} />
          )}
        </div>

        {!loadingState.status && !!messageNotifFromSlice.length ? (
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
        ) : (
          <div className="message-notif-mark-all-button active">
            <RoundedLoader baseColor="gray" secondaryColor="white" />
          </div>
        )}
      </div>

      {!!messageNotifFromSlice.length && (
        <PaginationNotif
          pagePathName={"/message-notifications"}
          notifDataSlices={messageNotifFromSlice}
          notifDataObj={notifMessageDataObj}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setNotifDataObj={setNotifMessageDataObj}
        />
      )}
    </div>
  );
}
