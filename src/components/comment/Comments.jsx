import React, { useState, useEffect, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import UserCommentItems from "../user-comment-items/UserCommentItems";
import {
  getAllCommentsDataByPostId,
  createNewCommentData,
} from "../../apiCalls/commentsApiFetch";
import { setIsAddNewComment } from "../../redux/slices/commentsSlice";
import { Link } from "react-router-dom";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import RoundedLoader from "../rounded-loader/RoundedLoader";
import "./Comments.scss";

const Comments = ({ postId, postUserId }) => {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );
  const addNewComment = useSelector((state) => state.comments.isAddNewComment);
  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
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
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const newCommentPayloadBody = {
      postId: post_id,
      commentContent: comment,
    };
    createNewCommentData(newCommentPayloadBody)
      .then((newCommentData) => {
        if (newCommentData.data.success) {
          setComment("");
          dispatch(setIsAddNewComment({ successAddNewComment: true }));
          mutate({ type: actionType.STOP_LOADING_STATUS });
        }
      })
      .catch((error) => {
        const errorMessageEmptyCommentField = error.response.data.errorMessage;
        console.log(
          "error message when add new comment:",
          errorMessageEmptyCommentField
        );
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
  };

  useEffect(() => {
    const getDataCommentsByIdOfPost = (this_post_id) => {
      getAllCommentsDataByPostId(this_post_id)
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

    getDataCommentsByIdOfPost(post_id);

    return () => {
      setThisPostCommentData([]);
      setLastIndex(0);
      dispatch(setIsAddNewComment({ successAddNewComment: false }));
    };
  }, [post_id, addNewComment, dispatch]);

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

        {!loadingState.status ? (
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
        ) : (
          <button className="comments-button-send">
            <RoundedLoader
              size={14}
              baseColor="rgb(251, 226, 226)"
              secondaryColor="green"
            />
          </button>
        )}
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
