import React from "react";
import RoundedLoader from "../../rounded-loader/RoundedLoader";
import CommentIcon from '@mui/icons-material/Comment';

import "./PostCommentText.scss";

export default function PostCommentText({
  isCommentLoading,
  currentCommentTotal,
  ...otherProps
}) {
  return (
    <span className="post-comment-text" {...otherProps}>
      {isCommentLoading ? (
        <RoundedLoader
          baseColor="rgb(65,105,225)"
          secondaryColor="rgb(234, 84, 84)"
        />
      ) : (
        <div className="comment-and-counter-wrapper">
          <CommentIcon
            style={{ color: "rgb(65,105,225)" }}
            className="comment-icon"
          />

          <div>{currentCommentTotal}</div>
        </div>
      )}
    </span>
  );
}
