import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNewReplyCommentData } from "../../apiCalls/commentsApiFetch";
import { setIsAddNewReplyComment } from "../../redux/slices/commentsSlice";
import { Link } from "react-router-dom";
import "./ReplyCommentInput.scss";

const ReplyCommentInput = ({ commentId, postId, setIsViewReply, setIsOpenReplyBox }) => {
  const thisPostId = postId;
  const thisCommentId = commentId;
  const dispatch = useDispatch();
  const currentUserAvatarFromSlice = useSelector((state) => state.user.userAvatarPicture);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const [replyCommentMessage, setReplyCommentMessage] = useState("");

  const replyCommentWithEnter = (event) => {
    if (event.key === "Enter" && replyCommentMessage !== "") {
      sendReplyComment();
    }
  };

  const sendReplyComment = () => {
    const newCommentPayloadBody = {
      PostId: thisPostId,
      CommentId: thisCommentId,
      replyMessage: replyCommentMessage,
    };
    addNewReplyCommentData(newCommentPayloadBody)
      .then((newCommentData) => {
        if (newCommentData.data.success) {
          setReplyCommentMessage("");
          dispatch(
            setIsAddNewReplyComment({ successAddNewReplyComment: true })
          );
          setIsViewReply(true);
          setIsOpenReplyBox(false);
        }
      })
      .catch((error) => {
        const failedReplyCommentMessage = error.response;
        console.log("failedReplyCommentMessage:", failedReplyCommentMessage);
      });
  };

  return (
    <div className="reply-comment-input">
      <div
        className="reply-comment-input-wrapper"
        onKeyPress={replyCommentWithEnter}
      >
        <Link
          to={`/profile/${currentUserNameFromSlice}/user-id/${currentUserIdFromSlice}`}
          className="reply-comments-current-user-avatar-wrapper">
          <img
            src={currentUserAvatarFromSlice}
            alt="user-avatar"
            className="reply-comments-current-user-avatar"
          />
        </Link>

        <input
          placeholder="Reply this comment ..."
          className="reply-comments-input-tag"
          type="text"
          value={replyCommentMessage}
          onChange={(e) => setReplyCommentMessage(e.target.value)}
        />

        <button
          className={
            replyCommentMessage !== ""
              ? "reply-comments-button-send"
              : "reply-comments-button-send-disabled"
          }
          disabled={!replyCommentMessage}
          onClick={sendReplyComment}
        >
          Reply
        </button>
      </div>

      {/* Line */}
      <hr className="reply-comments-bottom-line" />
    </div>
  );
};

export default ReplyCommentInput;
