import React, { useState, useEffect } from "react";
import ReplyCommentInput from "../reply-comment-input/ReplyCommentInput";
import ReplyItems from "../reply-items/ReplyItems";
import { useSelector, useDispatch } from "react-redux";
import { rangeDay } from "../../utils/rangeDay";
import { getAllRepliesDataByCommentId } from "../../apiCalls/commentsApiFetch";
import { setIsAddNewReplyComment } from "../../redux/slices/commentsSlice";
import { Link } from "react-router-dom";
import "./UserCommentItems.scss";

const UserCommentItems = ({
  commentData,
  postIdFromFeed,
  userPostIdFromFeed,
  index,
  lastIndex,
}) => {
  const dispatch = useDispatch();

  const addNewReply = useSelector((state) => state.comments.isAddNewReplyComment);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const [isViewReply, setIsViewReply] = useState(false);
  const [isOpenReplyBox, setIsOpenReplyBox] = useState(false);
  const [thisReplies, setThisReplies] = useState([]);
  const [repliesLastIndex, setRepliesLastIndex] = useState(0);

  const comment_id = commentData.id;

  const viewReplyToggleHandler = (isView) => {
    setIsViewReply(isView);
    if (isView === true) {
      dispatch(setIsAddNewReplyComment({ successAddNewReplyComment: true }));
    }
  };

  const openAddReplyBoxToggleHandler = (isOpenReplyBoxValue) => {
    setIsOpenReplyBox(isOpenReplyBoxValue);
  };

  const checkForReplyOwner = () => {
    const isUserOwnThisReply = thisReplies.filter((reply) => reply.UserId === userPostIdFromFeed);
    if (isUserOwnThisReply.length)
      return ` from ${isUserOwnThisReply[0].User.userName} ${
        thisReplies.length > 1 ? " and others" : ""
      }`;
    return "";
  };

  useEffect(() => {
    const getDataRepliesByCommentId = (idOfComment) => {
      getAllRepliesDataByCommentId(idOfComment)
        .then((repliesByCommentId) => {
          const repliesByCommentIdTotal = repliesByCommentId.data.totalReplyCommentsByCommentId;
          if (repliesByCommentIdTotal > 0) {
            const repliesByCommentIdDataArray = repliesByCommentId.data.replyCommentsByCommentId;
            setThisReplies(repliesByCommentIdDataArray);
            setRepliesLastIndex(repliesByCommentIdTotal - 1);
            dispatch(setIsAddNewReplyComment({ successAddNewReplyComment: false }));
          } else {
            setThisReplies([]);
            setRepliesLastIndex(0);
            dispatch(setIsAddNewReplyComment({ successAddNewReplyComment: false }));
          }
        })
        .catch((error) => {
          console.log("Error getAllRepliesDataByCommentId", error);
        });
    };

    getDataRepliesByCommentId(comment_id);
  }, [comment_id, addNewReply, isOpenReplyBox, dispatch]);

  return (
    <div className="user-comment-items">
      <div className="user-comments-wrapper">
        <Link to={`/profile/${commentData.User.userName}/user-id/${commentData.UserId}`}>
          <img
            src={commentData.User.Profile.avatarUrl}
            alt="user-avatar-comments-item"
            className="user-comments-avatar"
          />
        </Link>

        <div className="user-comments-content">
          <div className="user-name">
            {commentData.User.userName}
            {commentData.UserId === currentUserIdFromSlice ? (
              <span className="post-owner-tag">anda</span>
            ) : commentData.UserId === userPostIdFromFeed ? (
              <span className="post-owner-tag">pemilik postingan</span>
            ) : (
              ""
            )}{" "}
            <span className="comment-created-at">
              {rangeDay(commentData.createdAt)}
            </span>
          </div>

          <div className="user-comment-text">{commentData.commentContent}</div>

          <div className="comments-bottom-section-wrapper-container">
            <div
              className="comments-reply-button"
              onClick={() => openAddReplyBoxToggleHandler(!isOpenReplyBox)}>
              Reply
            </div>

            {thisReplies && thisReplies.length > 0 && (
              <div
                className="view-comments-reply-button"
                onClick={() => viewReplyToggleHandler(!isViewReply)}>
                {isViewReply ? "Hide " : "View "} {thisReplies.length}{" "}
                {thisReplies.length < 2 ? "reply" : "replies"}{" "}
                {checkForReplyOwner()}
              </div>
            )}
          </div>


          {isOpenReplyBox && (
            <ReplyCommentInput
              commentId={commentData.id}
              postId={postIdFromFeed}
              setIsViewReply={setIsViewReply}
              setIsOpenReplyBox={setIsOpenReplyBox}
            />
          )}


          {/* Panggil component ReplyItem */}
          {isViewReply &&
            thisReplies &&
            thisReplies.map((reply, index) => (
              <ReplyItems
                key={reply.id}
                dataReply={reply}
                lastIndex={repliesLastIndex}
                index={index}
                userPostIdFromFeed={userPostIdFromFeed}
              />
            ))}
        </div>
      </div>

      {index !== lastIndex && <hr className="user-comment-content-line" />}
    </div>
  );
};

export default UserCommentItems;
