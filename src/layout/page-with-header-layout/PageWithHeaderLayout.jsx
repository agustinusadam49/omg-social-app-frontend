import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Topbar from "../../components/navbar-header/Topbar";
import MobileBottomNavigation from "../../components/mobile-bottom-navigation/MobileBottomNavigation";
import UserSuggestionModal from "../../components/user-suggestion-modal/UserSuggestionModal";
import UserOnlineInfoModal from "../../components/user-online-info-modal/UserOnlineInfoModal";
import ProfileModalMobile from "../../components/profile-modal-mobile/ProfileModalMobile";
import PostModalEdit from "../../components/post-modal-edit/PostModalEdit";
import { useScreenWidth } from "../../utils/screenWidth";
import { useSelector } from "react-redux";
import { accessToken } from "../../utils/getLocalStorage";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  const isMobile = useScreenWidth("mb");
  const access_token = accessToken();
  const isLoggedIn = !!access_token;

  const isUserSuggestionModalOpen = useSelector((state) => state.user.isUserSuggestionModalOpen);
  const isUserOnlineModalOpen = useSelector((state) => state.user.isUserOnlineModalOpen);
  const isProfileMobileModalOpen = useSelector((state) => state.user.isUserProfileMobileOpen);
  const isModalPostEdit = useSelector((state) => state.posts.isPostModalEditOpen);

  if (isLoggedIn) {
    return (
      <div className="page-with-header-layout">
        <Topbar />
        <Outlet />
        {isModalPostEdit && <PostModalEdit />}
        {isMobile && isUserOnlineModalOpen && <UserOnlineInfoModal />}
        {isMobile && isUserSuggestionModalOpen && <UserSuggestionModal />}
        {isMobile && isProfileMobileModalOpen && <ProfileModalMobile />}
        {isMobile && <MobileBottomNavigation />}
      </div>
    );
  } else {
    return <Navigate to="/login" />;
  }
  // return (
  //   <div className="page-with-header-layout">
  //     <Topbar />
  //     <Outlet />
  //     {isModalPostEdit && <PostModalEdit />}
  //     {isMobile && isUserOnlineModalOpen && <UserOnlineInfoModal />}
  //     {isMobile && isUserSuggestionModalOpen && <UserSuggestionModal />}
  //     {isMobile && isProfileMobileModalOpen && <ProfileModalMobile />}
  //     {isMobile && <MobileBottomNavigation />}
  //   </div>
  // );
}
