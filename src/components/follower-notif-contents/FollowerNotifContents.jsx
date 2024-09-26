import React, { useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setFollowerNotif } from "../../redux/slices/notificationSlice";
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

export default function FollowerNotifContents() {
  const query = useQueryLocation();
  const pageName = useMemo(() => query.get("pageName"), [query]);

  const [loadingState, mutate] = useReducer(loadingReducer, INITIAL_LOADING_STATE);

  const dispatch = useDispatch();

  const followerNotifFromSlice = useSelector((state) => state.notifications.followerNotif);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const notReadYetFollowerNotifications = followerNotifFromSlice.filter(
    (notif) => notif.isRead === false
  );

  const totalAllIsRead = followerNotifFromSlice
    .filter((item) => !item.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const staticFilteredData = followerNotifFromSlice
    .filter((item) => item)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const notifFollowerDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: followerNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [followerNotifFromSlice]
  );

  const notifArrByActivePage = notifFollowerDataObj[pageName || "1"];

  const changeButton = () => {
    if (loadingState.status) return;
    if (!notReadYetFollowerNotifications.length) return;
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const payloadUpdate = {
      type: "Follows",
      isRead: true,
    };
    updateAllNotificationStatusNotRead(currentUserIdFromSlice, payloadUpdate)
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
      notifDataFromSlice={followerNotifFromSlice}
      totalAllIsRead={totalAllIsRead.length}
      isNotifLoadingState={loadingState.status}
      notifDataObj={notifFollowerDataObj}
      pagePathName={"/follower-notifications"}
      notifTitle={"Follow Notifications"}
      changeButton={changeButton}
    >
      <NotifContentsMain />
    </NotifContextProvider>
  );
}
