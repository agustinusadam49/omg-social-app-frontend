import React, { Fragment, useEffect, useMemo, useReducer } from "react";
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
import { mappedPageObjUtil } from "../../utils/mappedPageIntoObject";
import useQueryLocation from "../../custom-hooks/useQueryLocation";

import "./MessageNotifContents.scss";

export default function MessageNotifContents() {
  const query = useQueryLocation();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const messageNotifFromSlice = useSelector(
    (state) => state.notifications.messageNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const pageName = useMemo(() => query.get("pageName"), [query]);

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = messageNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [messageNotifFromSlice]);

  const staticFilteredData = useMemo(
    () =>
      messageNotifFromSlice
        .filter((item) => item)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [messageNotifFromSlice]
  );

  const notifMessageDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: messageNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [messageNotifFromSlice]
  );

  const notifArrByActivePage = notifMessageDataObj[pageName || "1"];

  const notReadYetMessageNotifications = useMemo(
    () => messageNotifFromSlice.filter((notif) => notif.isRead === false),
    [messageNotifFromSlice]
  );

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

          dispatch(setMessageNotif({ messageNotifData: changeAllIsReadStatus }));
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

        {!!messageNotifFromSlice.length && (
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
            loading={loadingState.status}
            isDisabled={loadingState.status}
            renderLabel={({ label, isLoading }) => {
              return !isLoading ? (
                <div>{label}</div>
              ) : (
                <RoundedLoader
                  baseColor="gray"
                  secondaryColor="white"
                  size={17}
                />
              );
            }}
          />
        )}
      </div>

      {!!messageNotifFromSlice.length && (
        <PaginationNotif
          pagePathName={"/message-notifications"}
          notifDataSlices={messageNotifFromSlice}
          notifDataObj={notifMessageDataObj}
        />
      )}
    </div>
  );
}
