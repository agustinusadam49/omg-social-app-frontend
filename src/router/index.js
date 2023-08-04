import { createBrowserRouter } from "react-router-dom";

import PageWithHeaderLayout from "../layout/page-with-header-layout/PageWithHeaderLayout";
import NonProfilePages from "../layout/page-with-header-layout/non-profile-pages/NonProfilePages";
// import NotificationPages from "../layout/page-with-header-layout/notification-pages/NotificationPages";

import LoginPage from "../pages/login/Login";
import RegisterPage from "../pages/register/Register";
import ForgotPassword from "../pages/forgot-password/ForgotPassword";
import Profile from "../pages/profile/Profile";
import ErrorPage from "../pages/error-page/ErrorPage";

import Feed from "../components/feed/Feed";
import EventContents from "../components/event-contents/EventContents";
import PostNotifContents from "../components/post-notif-contents/PostNotifContents";
import FollowerNotifContents from "../components/follower-notif-contents/FollowerNotifContents";
import MessageNotifContents from "../components/message-notif-contents/MessageNotifContents";
import SearchPageContents from "../components/search-page-contents/SearchPageContents";

export const router = createBrowserRouter([
  {
    // path: "/",
    element: <PageWithHeaderLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <NonProfilePages />,
        children: [
          {
            index: true,
            element: <Feed />,
          },
          {
            path: "events",
            element: <EventContents />,
          },
          {
            path: "search",
            element: <SearchPageContents />,
          },
          {
            path: "post-notifications",
            element: <PostNotifContents />,
          },
          {
            path: "follower-notifications",
            element: <FollowerNotifContents />,
          },
          {
            path: "message-notifications",
            element: <MessageNotifContents />,
          },
        ],
      },
      {
        path: "profile/:username/user-id/:userId",
        element: <Profile />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
]);
