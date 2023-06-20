import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../../components/navbar-header/Topbar";
import MobileBottomNavigation from "../../components/mobile-bottom-navigation/MobileBottomNavigation";
import UserSuggestionModal from "../../components/user-suggestion-modal/UserSuggestionModal";
import UserOnlineInfoModal from "../../components/user-online-info-modal/UserOnlineInfoModal";
import ProfileModalMobile from "../../components/profile-modal-mobile/ProfileModalMobile";
import { useScreenWidth } from "../../utils/screenWidth";
import { getNotificationsBelongsToLoggedUser } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../../redux/slices/notificationSlice";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  const dispatch = useDispatch();
  const isMobile = useScreenWidth("mb");

  const isUserSuggestionModalOpen = useSelector(
    (state) => state.user.isUserSuggestionModalOpen
  );

  const isUserOnlineModalOpen = useSelector(
    (state) => state.user.isUserOnlineModalOpen
  );

  const isProfileMobileModalOpen = useSelector(
    (state) => state.user.isUserProfileMobileOpen
  );

  const followerNotifFromSlice = useSelector(
    (state) => state.notifications.followerNotif
  );
  const postNotifFromSlice = useSelector(
    (state) => state.notifications.postNotif
  );
  const messageNotifFromSlice = useSelector(
    (state) => state.notifications.messageNotif
  );

  const followerNotifFiltered = useMemo(
    () => followerNotifFromSlice.filter((item) => !item.isRead),
    [followerNotifFromSlice]
  );
  const postNotifFiltered = useMemo(
    () => postNotifFromSlice.filter((item) => !item.isRead),
    [postNotifFromSlice]
  );
  const messageNotifFiltered = useMemo(
    () => messageNotifFromSlice.filter((item) => !item.isRead),
    [messageNotifFromSlice]
  );

  useEffect(() => {
    getNotificationsBelongsToLoggedUser(dispatch);

    return () => {
      dispatch(setFollowerNotif({ followerNotifData: [] }));
      dispatch(setMessageNotif({ messageNotifData: [] }));
      dispatch(setPostNotif({ postNotifData: [] }));
    };
  }, [dispatch]);

  return (
    <div className="page-with-header-layout">
      <Topbar
        followerNotifFromSlice={followerNotifFiltered}
        postNotifFromSlice={postNotifFiltered}
        messageNotifFromSlice={messageNotifFiltered}
      />
      <Outlet />
      {isMobile && isUserOnlineModalOpen && <UserOnlineInfoModal />}
      {isMobile && isUserSuggestionModalOpen && <UserSuggestionModal />}
      {isMobile && isProfileMobileModalOpen && <ProfileModalMobile />}
      {isMobile && <MobileBottomNavigation />}
    </div>
  );
}
