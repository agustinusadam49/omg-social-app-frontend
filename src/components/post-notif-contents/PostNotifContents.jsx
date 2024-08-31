import React, { Fragment, useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setPostNotif } from "../../redux/slices/notificationSlice";
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

import "./PostNotifContents.scss";

export default function PostNotifContents() {
  const query = useQueryLocation();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const postNotifFromSlice = useSelector(
    (state) => state.notifications.postNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const pageName = useMemo(() => query.get("pageName"), [query]);

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = postNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [postNotifFromSlice]);

  const staticFilteredData = useMemo(
    () =>
      postNotifFromSlice
        .filter((item) => item)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [postNotifFromSlice]
  );

  const notifPostsDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: postNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [postNotifFromSlice]
  );

  const notifArrByActivePage = notifPostsDataObj[pageName || "1"];

  const notReadYetPostNotifications = useMemo(
    () => postNotifFromSlice.filter((notif) => notif.isRead === false),
    [postNotifFromSlice]
  );

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
    <div className="post-notif-contents">
      <div className="post-notif-title">Post Notifications</div>
      <div className="post-notif-card-wrapper">
        <div className="post-notif-card-inner-wrapper">
          {!!staticFilteredData.length ? (
            <Fragment>
              {notifArrByActivePage?.map((notifPostItem) => (
                <NotificationCard
                  key={notifPostItem.id}
                  notifications={notifPostItem}
                />
              ))}
            </Fragment>
          ) : (
            <EmptyStateNotification type={"posts"} />
          )}
        </div>

        {!!postNotifFromSlice.length && (
          <GlobalButton
            classStyleName={`post-notif-mark-all-button ${
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

      {!!postNotifFromSlice.length && (
        <PaginationNotif
          pagePathName={"/post-notifications"}
          notifDataSlices={postNotifFromSlice}
          notifDataObj={notifPostsDataObj}
        />
      )}
    </div>
  );
}
