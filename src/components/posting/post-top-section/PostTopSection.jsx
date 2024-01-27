import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsPostModalEditOpen,
  setStatusPost,
  setPostItem,
} from "../../../redux/slices/postsSlice";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { rangeDay } from "../../../utils/rangeDay";

import "./PostTopSection.scss";

export default function PostTopSection({
  userName,
  userId,
  avatarUrl,
  createdDate,
  statusPost,
  postData,
}) {
  const dispatch = useDispatch();
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const getStatus = (statusFromResponse) => {
    const followersOnlyWording =
      userId === currentUserIdFromSlice
        ? "Me & My Followers Only"
        : "Her/His's Followers Only";
    const POST_STATUS_ENUM = {
      PUBLIC: "Public",
      PRIVATE: "Private",
      FOLLOWERS_ONLY: followersOnlyWording,
    };

    return POST_STATUS_ENUM[statusFromResponse];
  };

  const openModalEditPost = (val) => {
    if (currentUserIdFromSlice !== userId) return;
    dispatch(setIsPostModalEditOpen({ isPostModalEditOpen: val }));
    dispatch(setStatusPost({ statusPost: statusPost }));
    dispatch(setPostItem({ postItem: postData }));
  };
  return (
    <div className="post-top">
      <div className="post-top-left">
        <Link
          to={`/profile/${userName}/user-id/${userId}`}
          className="post-profile-img-link-wrapper"
        >
          <img
            src={avatarUrl}
            alt="user-pict-profile"
            className="post-profile-img"
          />
        </Link>

        <div className="post-top-left-username-and-date-wrapper">
          <Link
            to={`/profile/${userName}/user-id/${userId}`}
            style={{ textDecoration: "none", color: "black" }}
            className="post-username"
          >
            {userName}
          </Link>

          <div className="post-date-and-status-wrapper">
            <div className="post-date">{rangeDay(createdDate)}</div>
          </div>
        </div>
      </div>

      <div className="post-top-right">
        <div
          className={`post-status ${
            statusPost === "PUBLIC"
              ? "public"
              : statusPost === "PRIVATE"
              ? "private"
              : "followers-only"
          }`}
        >
          {getStatus(statusPost)}
        </div>
        <MoreVertIcon
          style={{ cursor: "pointer" }}
          onClick={() => openModalEditPost(true)}
        />
      </div>
    </div>
  );
}
