import React, { useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setPostNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import { mappedPageObjUtil } from "../../utils/mappedPageIntoObject";
import useQueryLocation from "../../custom-hooks/useQueryLocation";
import NotifContentsMain from "../notif-contents-main/NotifContentsMain";

export default function PostNotifContents() {
  const query = useQueryLocation();
  const pageName = useMemo(() => query.get("pageName"), [query]);

  const [loadingState, mutate] = useReducer(loadingReducer, INITIAL_LOADING_STATE);

  const dispatch = useDispatch();

  const postNotifFromSlice = useSelector((state) => state.notifications.postNotif);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const notReadYetPostNotifications = postNotifFromSlice.filter(
    (notif) => notif.isRead === false
  );

  const totalAllIsRead = postNotifFromSlice
    .filter((item) => !item.isRead)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const staticFilteredData = postNotifFromSlice
    .filter((item) => item)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const notifPostsDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: postNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [postNotifFromSlice]
  );

  const notifArrByActivePage = notifPostsDataObj[pageName || "1"];

  const changeButton = () => {
    if (loadingState.status) return;
    if (!notReadYetPostNotifications.length) return;
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const payloadUpdate = {
      type: "Posts",
      isRead: true,
    };
    updateAllNotificationStatusNotRead(currentUserIdFromSlice, payloadUpdate)
      .then((updateResponse) => {
        const response = updateResponse.data;
        if (response.success === true) {
          const changeAllIsReadStatus = postNotifFromSlice
            .filter((item) => item)
            .map((postNotifItem) => ({
              ...postNotifItem,
              isRead: true,
            }));

          dispatch(setPostNotif({ postNotifData: changeAllIsReadStatus }));
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
    <NotifContentsMain
      staticFilteredData={staticFilteredData}
      notifArrByActivePage={notifArrByActivePage}
      notifDataFromSlice={postNotifFromSlice}
      totalAllIsRead={totalAllIsRead.length}
      isNotifLoadingState={loadingState.status}
      notifDataObj={notifPostsDataObj}
      notifTitle={"Post Notifications"}
      pagePathName={"/post-notifications"}
      changeButton={changeButton}
    />
  );
}
