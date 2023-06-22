import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../redux/apiCalls";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../redux/slices/notificationSlice";

export default function withNotifData(OriginalComponent) {
  return () => {
    const dispatch = useDispatch();

    const followerNotifFromSlice = useSelector((state) => state.notifications.followerNotif);
    const postNotifFromSlice = useSelector((state) => state.notifications.postNotif);
    const messageNotifFromSlice = useSelector((state) => state.notifications.messageNotif);
    const userSnapRegisteredStatus = useSelector((state) => state.user.snapUserLogout);

    const followerNotifFiltered = useMemo(() => followerNotifFromSlice.filter((item) => !item.isRead), [followerNotifFromSlice]);
    const postNotifFiltered = useMemo(() => postNotifFromSlice.filter((item) => !item.isRead), [postNotifFromSlice]);
    const messageNotifFiltered = useMemo(() => messageNotifFromSlice.filter((item) => !item.isRead), [messageNotifFromSlice]);

    useEffect(() => {
      getNotificationsBelongsToLoggedUser(dispatch);

      return () => {
        dispatch(setFollowerNotif({ followerNotifData: [] }));
        dispatch(setMessageNotif({ messageNotifData: [] }));
        dispatch(setPostNotif({ postNotifData: [] }));
      };
    }, [userSnapRegisteredStatus, dispatch]);

    return (
      <OriginalComponent
        followerNotifFromSlice={followerNotifFiltered}
        postNotifFromSlice={postNotifFiltered}
        messageNotifFromSlice={messageNotifFiltered}
      />
    );
  };
}
