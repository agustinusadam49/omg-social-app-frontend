import React, {
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link, useLocation } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import HomeIcon from "@mui/icons-material/Home";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import PersonPinIcon from "@mui/icons-material/PersonPin";
import { useSelector, useDispatch } from "react-redux";
import { accessToken } from "../../utils/getLocalStorage";
import {
  getNotificationsBelongsToLoggedUser,
  getAllUsersRegistered,
} from "../../redux/apiCalls";
import {
  setFollowerNotif,
  setMessageNotif,
  setPostNotif,
} from "../../redux/slices/notificationSlice";
import {
  setIsUserSuggestionModalOpen,
  setIsUserOnlineModalOpen,
} from "../../redux/slices/userSlice";
import "./MobileBottomNavigation.scss";

export default function MobileBottomNavigation() {
  const access_token = accessToken();
  const dispatch = useDispatch();

  const notificationsPath = {
    home: "/",
    event: "/events",
    follower: "/follower-notifications",
    message: "/message-notifications",
    post: "/post-notifications",
  };

  const { pathname } = useLocation();

  const followerNotifFromSlice = useSelector((state) =>
    state.notifications.followerNotif.filter((item) => !item.isRead)
  );
  const postNotifFromSlice = useSelector((state) =>
    state.notifications.postNotif.filter((item) => !item.isRead)
  );
  const messageNotifFromSlice = useSelector((state) =>
    state.notifications.messageNotif.filter((item) => !item.isRead)
  );
  const userSnapRegisteredStatus = useSelector(
    (state) => state.user.snapUserLogout
  );
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const allUsersRegisterd = useSelector((state) => state.user.allUsers);

  const [usersOnlineWithoutCurrentUser, setUsersOnlineWithoutCurrentUser] = useState([]);

  const currentPathName = useMemo(() => {
    const path = pathname;
    return path;
  }, [pathname]);

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
  const totalUserOnline = useMemo(
    () => usersOnlineWithoutCurrentUser.length,
    [usersOnlineWithoutCurrentUser]
  );

  const getActiveColor = (inputPathName) => {
    return inputPathName === currentPathName ? "#2c2891" : "#3571d9";
  };

  const checkActiveBadgeFollowerNotif = () => {
    if (totalFollowerNotif) {
      return (
        <span className="mobile-bottom-icon-badge">{totalFollowerNotif}</span>
      );
    }
  };

  const checkActiveBadgeMessageNotif = () => {
    if (totalMessageNotif) {
      return (
        <span className="mobile-bottom-icon-badge">{totalMessageNotif}</span>
      );
    }
  };

  const checkActiveBadgeNotifications = () => {
    if (totalPostNotif) {
      return <span className="mobile-bottom-icon-badge">{totalPostNotif}</span>;
    }
  };

  const checkUserOnlineBadge = () => {
    if (totalUserOnline) {
      return <span className="mobile-bottom-icon-badge">{totalUserOnline}</span>;
    }
  };

  const toggleActiveSuggestionModal = (value) => {
    dispatch(setIsUserSuggestionModalOpen({ isSuggestionModalOpen: value }));
  };

  const toggleUserOnlineModal = (value) => {
    dispatch(setIsUserOnlineModalOpen({ isUserOnlineModalOpen: value }));
  };

  useEffect(() => {
    if (allUsersRegisterd) {
      setUsersOnlineWithoutCurrentUser(
        allUsersRegisterd.filter(
          (user) =>
            user.id !== currentUserIdFromSlice && user.userOnlineStatus === true
        )
      );
    }
  }, [allUsersRegisterd, currentUserIdFromSlice]);

  useEffect(() => {
    dispatch(setIsUserSuggestionModalOpen({ isSuggestionModalOpen: false }));
    dispatch(setIsUserOnlineModalOpen({ isUserOnlineModalOpen: false }));
  }, [pathname, dispatch]);

  useEffect(() => {
    if (access_token) {
      getNotificationsBelongsToLoggedUser(access_token, dispatch);
    }

    return () => {
      dispatch(setFollowerNotif({ followerNotifData: [] }));
      dispatch(setMessageNotif({ messageNotifData: [] }));
      dispatch(setPostNotif({ postNotifData: [] }));
    };
  }, [access_token, userSnapRegisteredStatus, dispatch]);

  useEffect(() => {
    if (access_token) getAllUsersRegistered(access_token, dispatch);
  }, [access_token, dispatch]);

  return (
    <div className="content-container mobile-bottom-navigation">
      <div className="mobile-bottom-wrapper">
        <div className="mobile-bottom-icons-section">
          <Link
            to={notificationsPath.follower}
            style={{
              textDecoration: "none",
              color: getActiveColor(notificationsPath.follower),
            }}
            className="mobile-bottom-icon-item"
          >
            <PersonIcon className="mobile-bottom-notif-icon" />
            {checkActiveBadgeFollowerNotif()}
          </Link>

          <Link
            to={notificationsPath.message}
            style={{
              textDecoration: "none",
              color: getActiveColor(notificationsPath.message),
            }}
            className="mobile-bottom-icon-item"
          >
            <ChatIcon className="mobile-bottom-notif-icon" />
            {checkActiveBadgeMessageNotif()}
          </Link>

          <Link
            to={notificationsPath.post}
            style={{
              textDecoration: "none",
              color: getActiveColor(notificationsPath.post),
            }}
            className="mobile-bottom-icon-item"
          >
            <NotificationsIcon className="mobile-bottom-notif-icon" />
            {checkActiveBadgeNotifications()}
          </Link>

          <Link
            to={notificationsPath.home}
            style={{
              textDecoration: "none",
              color: getActiveColor(notificationsPath.home),
            }}
            className="mobile-bottom-icon-item"
          >
            <HomeIcon className="mobile-bottom-home-icon-item" />
          </Link>

          <Link
            to={notificationsPath.event}
            style={{
              textDecoration: "none",
              color: getActiveColor(notificationsPath.event),
            }}
            className="mobile-bottom-icon-item"
          >
            <EventIcon className="mobile-bottom-home-icon-item" />
          </Link>

          <div
            style={{
              textDecoration: "none",
              color: "#3571d9",
            }}
            className="mobile-bottom-icon-item"
            onClick={() => toggleActiveSuggestionModal(true)}
          >
            <PeopleIcon className="mobile-bottom-home-icon-item" />
          </div>

          <div
            style={{
              textDecoration: "none",
              color: "#3571d9",
            }}
            className="mobile-bottom-icon-item"
            onClick={() => toggleUserOnlineModal(true)}
          >
            <PersonPinIcon className="mobile-bottom-home-icon-item" />
            {checkUserOnlineBadge()}
          </div>
        </div>
      </div>
    </div>
  );
}
