import React, {
  Fragment,
  useEffect,
  useState,
  useMemo,
  useReducer,
} from "react";
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

import "./PostNotifContents.scss";

export default function PostNotifContents() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();

  const postNotifFromSlice = useSelector(
    (state) => state.notifications.postNotif
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const [staticFilteredData, setStaticFilteredData] = useState(postNotifFromSlice);
  const [notifPostsDataObj, setNotifPostsDataObj] = useState({});
  const [activePageIndex, setActivePageIndex] = useState("page1");
  const [notifArrByActivePage, setNotifArrByActivePage] = useState([]);

  const notReadYetPostNotifications = useMemo(() => {
    const result = postNotifFromSlice.filter((notif) => notif.isRead === false);
    return result;
  }, [postNotifFromSlice]);

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

  const displayPostNotifData = () => {
    if (staticFilteredData.length) {
      return (
        <Fragment>
          {notifArrByActivePage?.map((notifPostItem) => (
            <NotificationCard
              key={notifPostItem.id}
              notifications={notifPostItem}
            />
          ))}
        </Fragment>
      );
    }

    return <EmptyStateNotification type={"posts"} />;
  };

  const displayButtonMarkAllNotif = () => {
    if (!loadingState.status) {
      if (postNotifFromSlice.length) {
        return (
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
          />
        );
      }
    } else {
      return (
        <div className="post-notif-mark-all-button active">
          <RoundedLoader baseColor="gray" secondaryColor="white" />
        </div>
      );
    }
  };

  const displayPagination = () => {
    if (postNotifFromSlice.length) {
      return (
        <PaginationNotif
          pagePathName={"/post-notifications"}
          notifDataSlices={postNotifFromSlice}
          notifDataObj={notifPostsDataObj}
          activePageIndex={activePageIndex}
          setActivePageIndex={setActivePageIndex}
          setNotifDataObj={setNotifPostsDataObj}
        />
      );
    }
  };

  const totalAllIsRead = useMemo(() => {
    const newDataReadStatusIsRead = postNotifFromSlice
      .filter((item) => !item.isRead)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return newDataReadStatusIsRead.length;
  }, [postNotifFromSlice]);

  useEffect(() => {
    const newArr = notifPostsDataObj[activePageIndex];
    setNotifArrByActivePage(newArr);
  }, [notifPostsDataObj, activePageIndex]);

  useEffect(() => {
    const staticSortedData = postNotifFromSlice
      .filter((item) => item)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    setStaticFilteredData(staticSortedData);
  }, [postNotifFromSlice]);

  useEffect(() => {
    getNotificationsBelongsToLoggedUser(dispatch);
  }, [dispatch]);

  return (
    <div className="post-notif-contents">
      <div className="post-notif-title">Post Notifications</div>
      <div className="post-notif-card-wrapper">
        <div className="post-notif-card-inner-wrapper">
          {displayPostNotifData()}
        </div>
        {displayButtonMarkAllNotif()}
      </div>
      {displayPagination()}
    </div>
  );
}
