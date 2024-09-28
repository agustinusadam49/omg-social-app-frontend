import React, { useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setMessageNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import { mappedPageObjUtil } from "../../utils/mappedPageIntoObject";
import useQueryLocation from "../../custom-hooks/useQueryLocation";
import NotifContentsMain from "../notif-contents-main/NotifContentsMain";
import { NotifContextProvider } from "../../context/notifContext";

export default function MessageNotifContents() {
  const query = useQueryLocation();
  const pageName = useMemo(() => query.get("pageName"), [query]);

  const [loadingState, mutate] = useReducer(loadingReducer, INITIAL_LOADING_STATE);

  const dispatch = useDispatch();

  const messageNotifFromSlice = useSelector((state) => state.notifications.messageNotif);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const notReadYetMessageNotifications = messageNotifFromSlice.filter(
    (notif) => notif.isRead === false
  );

  const totalAllIsRead = messageNotifFromSlice
    .filter((item) => !item.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const staticFilteredData = messageNotifFromSlice
    .filter((item) => item)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const notifMessageDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: messageNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [messageNotifFromSlice]
  );

  const notifArrByActivePage = notifMessageDataObj[pageName || "1"];

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
    <NotifContextProvider
      staticFilteredData={staticFilteredData}
      notifArrByActivePage={notifArrByActivePage}
      notifDataFromSlice={messageNotifFromSlice}
      totalAllIsRead={totalAllIsRead.length}
      isNotifLoadingState={loadingState.status}
      notifDataObj={notifMessageDataObj}
      notifTitle={"Message Notifications"}
      pagePathName={"/message-notifications"}
      emptyStateType="messages"
      changeButton={changeButton}
    >
      <NotifContentsMain />
    </NotifContextProvider>
  );
}
