import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCommentItems from "../user-comment-items/UserCommentItems";
import {
  getAllCommentsDataByPostId,
  createNewCommentData,
} from "../../apiCalls/commentsApiFetch";
import { setIsAddNewComment } from "../../redux/slices/commentsSlice";
import { Link } from "react-router-dom";
import { accessToken } from "../../utils/getLocalStorage";
import "./Comments.scss";

const Comments = ({ postId, postUserId }) => {
  const dispatch = useDispatch();
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const addNewComment = useSelector((state) => state.comments.isAddNewComment);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const access_token = accessToken();
  const post_id = postId;
  const post_user_id = postUserId;

  const [thisPostCommentData, setThisPostCommentData] = useState([]);
  const [lastIndex, setLastIndex] = useState(0);
  const [comment, setComment] = useState("");

  const doCreateNewCommentWithEnter = (event) => {
    if (event.key === "Enter" && comment !== "") {
      sendNewComment();
    }
  };

  const sendNewComment = () => {
    const newCommentPayloadBody = {
      postId: post_id,
      commentContent: comment,
    };
    createNewCommentData(access_token, newCommentPayloadBody)
      .then((newCommentData) => {
        if (newCommentData.data.success) {
          setComment("");
          dispatch(setIsAddNewComment({ successAddNewComment: true }));
        }
      })
      .catch((error) => {
        const errorMessageEmptyCommentField = error.response.data.errorMessage;
        console.log(
          "error message when add new comment:",
          errorMessageEmptyCommentField
        );
      });
  };

  useEffect(() => {
    const getDataCommentsByIdOfPost = (user_token, this_post_id) => {
      getAllCommentsDataByPostId(user_token, this_post_id)
        .then((commentByPostId) => {
          const commentsByPostIdTotal =
            commentByPostId.data.totalCommentsByPostId;
          if (commentsByPostIdTotal > 0) {
            const commentsByPostIdDataArray =
              commentByPostId.data.commentsDataByPostId;
            setThisPostCommentData(commentsByPostIdDataArray);
            setLastIndex(commentsByPostIdTotal - 1);
            dispatch(setIsAddNewComment({ successAddNewComment: false }));
          } else {
            setThisPostCommentData([]);
            setLastIndex(0);
            dispatch(setIsAddNewComment({ successAddNewComment: false }));
          }
        })
        .catch((error) => {
          console.log(
            "Cannot get comment data by postId from Comments component",
            error
          );
        });
    };

    if (access_token) getDataCommentsByIdOfPost(access_token, post_id);
  }, [access_token, post_id, addNewComment, dispatch]);

  return (
    <div className="comments">
      <div
        className="comments-wrapper"
        onKeyPress={doCreateNewCommentWithEnter}
      >
        <Link
          to={`/profile/${currentUserNameFromSlice}/user-id/${currentUserIdFromSlice}`}
          className="comments-current-user-avatar-wrapper"
        >
          <img
            src={currentUserAvatarFromSlice}
            alt="user-avatar"
            className="comments-current-user-avatar"
          />
        </Link>

        <input
          placeholder="Comments ..."
          className="comments-input"
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          className={
            comment !== ""
              ? "comments-button-send"
              : "comments-button-send-disabled"
          }
          disabled={!comment}
          onClick={sendNewComment}
        >
          Send
        </button>
      </div>

      {/* Line */}
      <hr className="comments-bottom-line" />

      {thisPostCommentData &&
        thisPostCommentData.map((comment, index) => (
          <UserCommentItems
            key={comment.id}
            commentData={comment}
            postIdFromFeed={post_id}
            userPostIdFromFeed={post_user_id}
            index={index}
            lastIndex={lastIndex}
          />
        ))}

      {!thisPostCommentData.length && (
        <div className="empty-state-comment-items">
          Belum ada comments untuk postingan ini
        </div>
      )}
    </div>
  );
};

export default Comments;
