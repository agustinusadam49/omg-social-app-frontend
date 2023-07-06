import React, { useMemo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { rangeDay } from "../../utils/rangeDay";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../../redux/slices/notificationSlice";
import { notifImageUrl } from "../../utils/notifUrl";
import {
  updateNotificationStatusRead,
  deleteNotificationAndNotifContentById,
} from "../../apiCalls/notificationsApiFetch";
import { useScreenWidth } from "../../utils/screenWidth";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import "./NotificationCard.scss";

export default function NotificationCard({ notifications }) {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const isDesktop = useScreenWidth("lg");
  const isMobile = useScreenWidth("mb");
  const dispatch = useDispatch();

  const { type } = notifications;
  const { description, createdAt } = notifications.NotifContent;

  const notifType = type.toLowerCase();
  const notifDescription = description;
  const notifDate = createdAt;

  const followerNotifSlice = useSelector(
    (state) => state.notifications.followerNotif
  );
  const postNotifSlice = useSelector((state) => state.notifications.postNotif);
  const messageNotifSlice = useSelector(
    (state) => state.notifications.messageNotif
  );

  const notificationObj = {
    follows: {
      data: followerNotifSlice,
      iconImageUrl: notifImageUrl.FOLLOW,
      function: (followNotifByIdModified) => {
        dispatch(
          setFollowerNotif({ followerNotifData: followNotifByIdModified })
        );
      },
    },
    messages: {
      data: messageNotifSlice,
      iconImageUrl: notifImageUrl.MESSAGE,
      function: (messageNotifByIdModified) => {
        dispatch(
          setMessageNotif({ messageNotifData: messageNotifByIdModified })
        );
      },
    },
    posts: {
      data: postNotifSlice,
      iconImageUrl: notifImageUrl.POST,
      function: (postNotifByIdModified) => {
        dispatch(setPostNotif({ postNotifData: postNotifByIdModified }));
      },
    },
  };

  const getDataNotifById = (idNotif, notifType) => {
    const result = notificationObj[notifType].data.find(
      (notif) => notif.id === idNotif
    );
    return result;
  };

  const changeToRead = (notifId, typeNotif) => {
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const notifById = getDataNotifById(notifId, typeNotif);
    const payloadToUpdate = {
      type: notifById.type,
      notifImageUrl: notifById.notifImageUrl,
    };
    updateNotificationStatusRead(notifById.id, payloadToUpdate)
      .then((updatedResponse) => {
        const response = updatedResponse.data;
        if (response.success === true) {
          const readStatusModifiedData = notificationObj[typeNotif].data.reduce(
            (newArr, notif) => {
              let newObj = notif;
              if (notif.id === notifId) {
                newObj = { ...notif, isRead: true };
              }
              newArr.push(newObj);
              return newArr;
            },
            []
          );
          notificationObj[typeNotif].function(readStatusModifiedData);

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

  const deleteNotificationById = (notifId, typeNotif) => {
    mutate({ type: actionType.RUN_LOADING_DELETE });
    deleteNotificationAndNotifContentById(notifId)
      .then((deletedNotifResponse) => {
        const response = deletedNotifResponse.data;
        if (response.success === true) {
          const notifDataWithoutSelectedId = notificationObj[typeNotif].data
            .filter((item) => item.id !== notifId)
            .map((notif) => ({
              ...notif,
            }));

          notificationObj[typeNotif].function(notifDataWithoutSelectedId);
          mutate({ type: actionType.STOP_LOADING_DELETE });
        }
      })
      .catch((error) => {
        const errorMessageFromApi =
          error?.response?.data?.err?.errorMessage ||
          "failed delete notification by id!";
        console.log(errorMessageFromApi);
        mutate({ type: actionType.STOP_LOADING_DELETE });
      });
  };

  const getPathLink = useMemo(() => {
    const senderName = notifications.NotifContent.sender_name;
    const senderId = notifications.NotifContent.sender_id;
    return `/profile/${senderName}/user-id/${senderId}`;
  }, [notifications]);

  return (
    <div className="notif-card">
      <Link to={getPathLink} style={{ textDecoration: "none" }}>
        <img
          src={notificationObj[notifType].iconImageUrl}
          alt="notif-img-icn"
          className="notif-image-icon"
        />
      </Link>

      <div className="notif-info">
        <Link
          to={getPathLink}
          style={{ textDecoration: "none" }}
          className="notif-info-description"
        >
          {notifDescription}
        </Link>
        <div className="notif-info-created-at">{rangeDay(notifDate)}</div>

        {isMobile && (
          <div className="notif-action-buttons-position-for-mobile-screen">
            {!loadingState.status && (
              <>
                {!notifications.isRead ? (
                  <div
                    className="notif-action-circle-button"
                    onClick={() => changeToRead(notifications.id, notifType)}
                  />
                ) : (
                  <div className="notif-has-read">sudah dibaca</div>
                )}
              </>
            )}

            {loadingState.status && (
              <RoundedLoader
                baseColor="rgb(251, 226, 226)"
                secondaryColor="rgb(95, 157, 95)"
              />
            )}

            {!loadingState.delete ? (
              <div className="notif-action-delete-button-mbl-screen-wrapper">
                <img
                  src={notifImageUrl.DELETE}
                  alt="notif-img-delete-button"
                  className="notif-action-delete-button-mbl-screen"
                  onClick={() =>
                    deleteNotificationById(notifications.id, notifType)
                  }
                />
              </div>
            ) : (
              <RoundedLoader
                baseColor="rgb(251, 226, 226)"
                secondaryColor="red"
              />
            )}
          </div>
        )}
      </div>

      {isDesktop && (
        <div className="notif-action-buttons">
          {!loadingState.status && (
            <>
              {!notifications.isRead ? (
                <div
                  className="notif-action-circle-button"
                  onClick={() => changeToRead(notifications.id, notifType)}
                />
              ) : (
                <div className="notif-has-read">sudah dibaca</div>
              )}
            </>
          )}

          {loadingState.status && (
            <RoundedLoader
              baseColor="rgb(251, 226, 226)"
              secondaryColor="rgb(95, 157, 95)"
            />
          )}

          {!loadingState.delete ? (
            <img
              src={notifImageUrl.DELETE}
              alt="notif-img-delete-button"
              className="notif-action-delete-button"
              onClick={() =>
                deleteNotificationById(notifications.id, notifType)
              }
            />
          ) : (
            <RoundedLoader
              baseColor="rgb(251, 226, 226)"
              secondaryColor="red"
            />
          )}
        </div>
      )}
    </div>
  );
}
