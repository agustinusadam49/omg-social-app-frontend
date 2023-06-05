import React from "react";
import { Link } from "react-router-dom";
import "./SearchPostItems.scss";
const SearchPostItems = ({ post }) => {
  return (
    <Link
    to={`/profile/${post.User.userName}/user-id/${post.User.id}`}
    style={{ textDecoration: "none", color: "black" }}>
    <div className="search-items-post-card-container">
      <div className="search-items-post-card-wrapper">
        <img
          src={`${post.User.Profile.avatarUrl}`}
          alt="user-post-pict"
          className="search-items-posts-user-image"
        />
        <div className="username-and-caption-wrapper">
          <div className="search-items-post-username">{post.User.userName}</div>
          <div className="post-user-caption">{post.postCaption}</div>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default SearchPostItems;
