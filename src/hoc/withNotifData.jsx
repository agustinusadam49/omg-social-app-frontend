import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getNotificationsBelongsToLoggedUser } from "../redux/apiCalls";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../redux/slices/notificationSlice";
import {useScreenWidth} from "../utils/screenWidth"

export default function withNotifData(OriginalComponent) {
  return () => {
    const dispatch = useDispatch();
    const isDesktop = useScreenWidth("lg");

    const followerNotifFromSlice = useSelector((state) => state.notifications.followerNotif);
    const postNotifFromSlice = useSelector((state) => state.notifications.postNotif);
    const messageNotifFromSlice = useSelector((state) => state.notifications.messageNotif);
    const isThereMessageNotif = useSelector((state) => state.user.isGetMessageNotif)

    const followerNotifFiltered = useMemo(() => followerNotifFromSlice.filter((item) => !item.isRead), [followerNotifFromSlice]);
    const postNotifFiltered = useMemo(() => postNotifFromSlice.filter((item) => !item.isRead), [postNotifFromSlice]);
    const messageNotifFiltered = useMemo(() => messageNotifFromSlice.filter((item) => !item.isRead), [messageNotifFromSlice]);

    useEffect(() => {
      if (isDesktop) {
        getNotificationsBelongsToLoggedUser(dispatch);
      }

      return () => {
        dispatch(setFollowerNotif({ followerNotifData: [] }));
        dispatch(setMessageNotif({ messageNotifData: [] }));
        dispatch(setPostNotif({ postNotifData: [] }));
      };
    }, [isThereMessageNotif, isDesktop, dispatch]);

    return (
      <OriginalComponent
        followerNotifFromSlice={followerNotifFiltered}
        postNotifFromSlice={postNotifFiltered}
        messageNotifFromSlice={messageNotifFiltered}
      />
    );
  };
}
