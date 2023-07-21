import React, { useState, useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useNavigate } from "react-router-dom";
import { setIsUserProfileMobileOpen } from "../../redux/slices/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { setSearchPostsTerms } from "../../redux/slices/postsSlice";
import ProfileBox from "../profile-box/ProfileBox";
import { useScreenWidth } from "../../utils/screenWidth";
import withNotifData from "../../hoc/withNotifData";
import "./Topbar.scss";

function Topbar({
  followerNotifFromSlice,
  postNotifFromSlice,
  messageNotifFromSlice,
}) {
  const isDesktop = useScreenWidth("lg");
  const isMobile = useScreenWidth("mb");

  const notificationsPath = {
    follower: "/follower-notifications",
    message: "/message-notifications",
    post: "/post-notifications",
  };

  const dispatch = useDispatch();

  let navigate = useNavigate();

  const { pathname } = useLocation();

  const currentPathName = useMemo(() => {
    const path = pathname;
    return path;
  }, [pathname]);

  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );

  const totalFollowerNotif = useMemo(
    () => followerNotifFromSlice.length,
    [followerNotifFromSlice]
  );

  const totalMessageNotif = useMemo(
    () => messageNotifFromSlice.length,
    [messageNotifFromSlice]
  );

  const totalPostNotif = useMemo(
    () => postNotifFromSlice.length,
    [postNotifFromSlice]
  );

  const [searchTerms, setSearchTerms] = useState("");

  const handleSearchOnChange = (value) => {
    const targetValue = value;
    setSearchTerms(targetValue);
    dispatch(setSearchPostsTerms({ getSearchTermsForPosts: targetValue }));
  };

  const goToSearchPage = useCallback(() => {
    if (!searchTerms) return;
    navigate({
      pathname: "/search",
      search: `?query=${searchTerms}`,
    });
  }, [searchTerms, navigate]);

  const goToSearchPageByEnter = (event) => {
    if (event.key === "Enter") {
      goToSearchPage();
    }
  };

  const getActiveColor = (inputPathName) => {
    return inputPathName === currentPathName ? "#2c2891" : "#3571d9";
  };

  const checkActiveBadgeNotif = (notifType) => {
    const notifications = {
      follower: totalFollowerNotif,
      message: totalMessageNotif,
      post: totalPostNotif,
    }

    const isNotifData = notifications[notifType]

    if (isNotifData) {
      return <span className="topbar-icon-badge">{isNotifData}</span>;
    }
  }

  const openProfileMobileModal = (val) => {
    dispatch(setIsUserProfileMobileOpen({ isUserProfileMobileOpen: val }));
  };

  return (
    <div className="topbar-container">
      {/* Left Topbar */}
      <div className="topbar-left">
        <Link className="logo" to="/">
          {isDesktop ? "Omongin" : "Omg"}
        </Link>
      </div>

      {/* Middle Topbar */}
      <div className="topbar-middle">
        <div className="search-bar" onKeyPress={goToSearchPageByEnter}>
          <SearchIcon
            style={{ cursor: "pointer" }}
            className="search-icon"
            onClick={goToSearchPage}
          />
          <input
            className="search-input"
            id="search-input-terms"
            placeholder="Cari teman, postingan atau video"
            type="text"
            value={searchTerms}
            onChange={(e) => handleSearchOnChange(e.target.value)}
          ></input>
        </div>
      </div>

      {/* Right Topbar */}
      <div className="topbar-right">
        <div className="topbar-right-wrapper">
          {isDesktop && (
            <div className="topbar-icons">
              <Link
                to={notificationsPath.follower}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.follower),
                }}
                className="topbar-icon-item"
              >
                <PersonIcon className="topbar-notif-icon" />
                {checkActiveBadgeNotif("follower")}
              </Link>

              <Link
                to={notificationsPath.message}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.message),
                }}
                className="topbar-icon-item"
              >
                <ChatIcon className="topbar-notif-icon" />
                {checkActiveBadgeNotif("message")}
              </Link>

              <Link
                to={notificationsPath.post}
                style={{
                  textDecoration: "none",
                  color: getActiveColor(notificationsPath.post),
                }}
                className="topbar-icon-item"
              >
                <NotificationsIcon className="topbar-notif-icon" />
                {checkActiveBadgeNotif("post")}
              </Link>
            </div>
          )}

          <div className="image-profile-container">
            {isDesktop && (
              <div className="topbar-img-wrapper">
                <img
                  src={currentUserAvatarFromSlice}
                  alt="user-profile"
                  className="topbar-img"
                />
                <div className="profile-box-wrapper">
                  <ProfileBox classStyleAddOn={["desktop-screen-styling"]} />
                </div>
              </div>
            )}

            {isMobile && (
              <div
                className="topbar-img-wrapper"
                onClick={() => openProfileMobileModal(true)}
              >
                <img
                  src={currentUserAvatarFromSlice}
                  alt="user-profile"
                  className="topbar-img"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withNotifData(Topbar);
