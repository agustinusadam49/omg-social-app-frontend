import React, { useState, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addNewReplyCommentData } from "../../apiCalls/commentsApiFetch";
import { setIsAddNewReplyComment } from "../../redux/slices/commentsSlice";
import { Link } from "react-router-dom";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import "./ReplyCommentInput.scss";

const ReplyCommentInput = ({
  commentId,
  postId,
  setIsViewReply,
  setIsOpenReplyBox,
}) => {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const thisPostId = postId;
  const thisCommentId = commentId;
  const dispatch = useDispatch();
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const [replyCommentMessage, setReplyCommentMessage] = useState("");

  const replyCommentWithEnter = (event) => {
    if (event.key === "Enter" && replyCommentMessage !== "") {
      sendReplyComment();
    }
  };

  const sendReplyComment = () => {
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const newCommentPayloadBody = {
      PostId: thisPostId,
      CommentId: thisCommentId,
      replyMessage: replyCommentMessage,
    };
    addNewReplyCommentData(newCommentPayloadBody)
      .then((newCommentData) => {
        if (newCommentData.data.success) {
          setReplyCommentMessage("");
          mutate({ type: actionType.STOP_LOADING_STATUS });
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
        mutate({ type: actionType.STOP_LOADING_STATUS });
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
          className="reply-comments-current-user-avatar-wrapper"
        >
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

        {!loadingState.status ? (
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
        ) : (
          <button className="reply-comments-button-send">
            <RoundedLoader
              size={15}
              baseColor="rgb(251, 226, 226)"
              secondaryColor="green"
            />
          </button>
        )}
      </div>

      {/* Line */}
      <hr className="reply-comments-bottom-line" />
    </div>
  );
};

export default ReplyCommentInput;
