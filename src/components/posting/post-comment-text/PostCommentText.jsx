import React from "react";

import "./PostCommentText.scss";

export default function PostCommentText({
  isCommentLoading,
  currentCommentTotal,
  ...otherProps
}) {
  return (
    <span className="post-comment-text" {...otherProps}>
      {isCommentLoading ? "Loading ..." : `${currentCommentTotal} comments`}
    </span>
  );
}
