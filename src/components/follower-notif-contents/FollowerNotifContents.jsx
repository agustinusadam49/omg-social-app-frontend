import React, { Fragment, useEffect, useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { setFollowerNotif } from "../../redux/slices/notificationSlice";
import { updateAllNotificationStatusNotRead } from "../../apiCalls/notificationsApiFetch";
import NotificationCard from "../notification-card/NotificationCard";
import PaginationNotif from "../pagination-notif/PaginationNotif";
import GlobalButton from "../button/GlobalButton";
import EmptyStateNotification from "../empty-state-notification/EmptyStateNotification";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import { mappedPageObjUtil } from "../../utils/mappedPageIntoObject";
import useQueryLocation from "../../custom-hooks/useQueryLocation";

import "./FollowerNotifContents.scss";

export default function FollowerNotifContents() {
  const query = useQueryLocation();

  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const followerNotifFromSlice = useSelector(
    (state) => state.notifications.followerNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const pageName = useMemo(() => query.get("pageName"), [query]);

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = followerNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [followerNotifFromSlice]);

  const staticFilteredData = useMemo(
    () =>
      followerNotifFromSlice
        .filter((item) => item)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [followerNotifFromSlice]
  );

  const notifFollowerDataObj = useMemo(
    () =>
      mappedPageObjUtil({
        notifData: followerNotifFromSlice,
        maxCardAppearedInOnePage: 3,
      }),
    [followerNotifFromSlice]
  );

  const notifArrByActivePage = notifFollowerDataObj[pageName || "1"];

  const notReadYetFollowerNotifications = useMemo(
    () => followerNotifFromSlice.filter((notif) => notif.isRead === false),
    [followerNotifFromSlice]
  );

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
    <div className="follower-notif-contents">
      <div className="follower-notif-title">Follow Notifications</div>
      <div className="follower-notif-card-wrapper">
        <div className="follower-notif-card-inner-wrapper">
          {!!staticFilteredData.length ? (
            <Fragment>
              {notifArrByActivePage?.map((notifFollowItem) => (
                <NotificationCard
                  key={notifFollowItem.id}
                  notifications={notifFollowItem}
                />
              ))}
            </Fragment>
          ) : (
            <EmptyStateNotification type={"follows"} />
          )}
        </div>

        {!!followerNotifFromSlice.length && (
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

      {!!followerNotifFromSlice.length && (
        <PaginationNotif
          pagePathName={"/follower-notifications"}
          notifDataSlices={followerNotifFromSlice}
          notifDataObj={notifFollowerDataObj}
        />
      )}
    </div>
  );
}
