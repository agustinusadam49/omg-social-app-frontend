import React, { useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import Topbar from "../../components/navbar-header/Topbar";
import MobileBottomNavigation from "../../components/mobile-bottom-navigation/MobileBottomNavigation";
import UserSuggestionModal from "../../components/user-suggestion-modal/UserSuggestionModal";
import UserOnlineInfoModal from "../../components/user-online-info-modal/UserOnlineInfoModal";
import ProfileModalMobile from "../../components/profile-modal-mobile/ProfileModalMobile";
import PostModalEdit from "../../components/post-modal-edit/PostModalEdit";
import RepostModal from "../../components/repost-modal/RepostModal";
import PostLoadDataModal from "../../components/post-load-data-modal/PostLoadDataModal";
import { useScreenWidth } from "../../custom-hooks/screenWidth";
import { useSelector } from "react-redux";
import { accessToken } from "../../utils/getLocalStorage";

import "./PageWithHeaderLayout.scss";

export default function PageWithHeaderLayout() {
  const isMobile = useScreenWidth("mb");
  const access_token = accessToken();
  const isLoggedIn = !!access_token;
  const location = useLocation();

  const isUserSuggestionModalOpen = useSelector(
    (state) => state.user.isUserSuggestionModalOpen
  );
  const isUserOnlineModalOpen = useSelector(
    (state) => state.user.isUserOnlineModalOpen
  );
  const isProfileMobileModalOpen = useSelector(
    (state) => state.user.isUserProfileMobileOpen
  );
  const isModalPostEdit = useSelector(
    (state) => state.posts.isPostModalEditOpen
  );
  const isModalRepost = useSelector((state) => state.posts.isRepostModalOpen);
  const isPostLoadDataModal = useSelector(
    ({ posts }) => posts.openLoadDataModal
  );

  useEffect(() => {
    if (
      isModalPostEdit ||
      isModalRepost ||
      isUserOnlineModalOpen ||
      isUserSuggestionModalOpen ||
      isProfileMobileModalOpen ||
      isPostLoadDataModal
    ) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "scroll";
    }
  }, [
    isModalPostEdit,
    isModalRepost,
    isUserOnlineModalOpen,
    isUserSuggestionModalOpen,
    isProfileMobileModalOpen,
    isPostLoadDataModal,
  ]);

  if (isLoggedIn) {
    return (
      <div className="page-with-header-layout">
        <Topbar />
        <Outlet />
        {isModalPostEdit && <PostModalEdit />}
        {isModalRepost && <RepostModal />}
        {isPostLoadDataModal && <PostLoadDataModal />}
        {isMobile && isUserOnlineModalOpen && <UserOnlineInfoModal />}
        {isMobile && isUserSuggestionModalOpen && <UserSuggestionModal />}
        {isMobile && isProfileMobileModalOpen && <ProfileModalMobile />}
        {isMobile && <MobileBottomNavigation />}
      </div>
    );
  } else {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
}
