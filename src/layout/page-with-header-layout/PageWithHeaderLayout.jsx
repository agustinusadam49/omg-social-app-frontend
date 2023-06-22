import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "../../components/navbar-header/Topbar";
import MobileBottomNavigation from "../../components/mobile-bottom-navigation/MobileBottomNavigation";
import UserSuggestionModal from "../../components/user-suggestion-modal/UserSuggestionModal";
import UserOnlineInfoModal from "../../components/user-online-info-modal/UserOnlineInfoModal";
import ProfileModalMobile from "../../components/profile-modal-mobile/ProfileModalMobile";
import { useScreenWidth } from "../../utils/screenWidth";
import { useSelector } from "react-redux";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  const isMobile = useScreenWidth("mb");

  const isUserSuggestionModalOpen = useSelector((state) => state.user.isUserSuggestionModalOpen);
  const isUserOnlineModalOpen = useSelector((state) => state.user.isUserOnlineModalOpen);
  const isProfileMobileModalOpen = useSelector((state) => state.user.isUserProfileMobileOpen);

  return (
    <div className="page-with-header-layout">
      <Topbar />
      <Outlet />
      {isMobile && isUserOnlineModalOpen && <UserOnlineInfoModal />}
      {isMobile && isUserSuggestionModalOpen && <UserSuggestionModal />}
      {isMobile && isProfileMobileModalOpen && <ProfileModalMobile />}
      {isMobile && <MobileBottomNavigation />}
    </div>
  );
}
