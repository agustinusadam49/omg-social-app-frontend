import React from "react";
import { useSelector } from "react-redux";
import { rangeDay } from "../../utils/rangeDay";
import { Link } from "react-router-dom";
import "./ReplyItems.scss";

const ReplyItems = ({ dataReply, lastIndex, index, userPostIdFromFeed }) => {
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  return (
    <div className="user-reply-items">
      <div className="user-reply-wrapper">
        <Link to={`/profile/${dataReply.User.userName}/user-id/${dataReply.UserId}`}>
          <img
            src={dataReply.User.Profile.avatarUrl}
            alt="user-avatar-comments-item"
            className="user-reply-comments-avatar"
          />
        </Link>

        <div className="user-reply-comments-content">
          <div className="reply-user-name">
            {dataReply.User.userName}
            {dataReply.UserId === currentUserIdFromSlice ? (
              <span className="reply-post-owner-tag">anda</span>
            ) : dataReply.UserId === userPostIdFromFeed ? (
              <span className="reply-post-owner-tag">pemilik postingan</span>
            ) : (
              ""
            )}{" "}
            <span className="reply-comment-created-at">
              {rangeDay(dataReply.createdAt)}
            </span>
          </div>

          <div className="reply-user-comment-text">{dataReply.replyMessage}</div>

        </div>
      </div>

      {index !== lastIndex && <hr className="reply-user-comment-content-line" />}
    </div>
  );
};

export default ReplyItems;
