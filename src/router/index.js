// No Need Auth Pages Import
import LoginPage from "../pages/login/Login";
import RegisterPage from "../pages/register/Register";

// Need Auth Pages Import

// Non profile pages
import Feed from "../components/feed/Feed"
import EventContents from "../components/event-contents/EventContents";
import PostNotifContents from "../components/post-notif-contents/PostNotifContents";
import FollowerNotifContents from "../components/follower-notif-contents/FollowerNotifContents";
import MessageNotifContents from "../components/message-notif-contents/MessageNotifContents";
import SearchPageContents from "../components/search-page-contents/SearchPageContents";

// profile pages
import Profile from "../pages/profile/Profile";

export const needAuthpages = {
  home: {
    path: "/",
    pageComponent: () => {
      return <Feed />;
    },
  },
  events: {
    path: "events",
    pageComponent: () => {
      return <EventContents />;
    },
  },
  postnotif: {
    path: "post-notifications",
    pageComponent: () => {
      return <PostNotifContents />;
    },
  },
  followernotif: {
    path: "follower-notifications",
    pageComponent: () => {
      return <FollowerNotifContents />;
    },
  },
  messagenotif: {
    path: "message-notifications",
    pageComponent: () => {
      return <MessageNotifContents />;
    },
  },
  search: {
    path: "search",
    pageComponent: () => {
      return <SearchPageContents />;
    },
  },
  profile: {
    path: "profile/:username/user-id/:userId",
    pageComponent: () => {
      return <Profile />;
    },
  },
};

export const notNeedAuthpages = {
  login: {
    path: "/login",
    pageComponent: () => {
      return <LoginPage />;
    },
  },
  register: {
    path: "/register",
    pageComponent: () => {
      return <RegisterPage />;
    },
  },
};
