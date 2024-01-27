import React from "react";
import { displayUserWhoLikesThisPost } from "../../../utils/postLikes.js";

import "./PostLikeCounter.scss";

export default function PostLikeCounter({
  totalLikeCalculated,
  postedDataLikesMapped,
  currentUserIdSlice,
}) {
  return (
    <span className="post-like-counter">
      {totalLikeCalculated},{" "}
      {displayUserWhoLikesThisPost(postedDataLikesMapped, currentUserIdSlice)}
    </span>
  );
}
