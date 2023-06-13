import React from "react";
import { Link } from "react-router-dom";
import "./SearchUserItems.scss";

const SearchUserItems = ({ user }) => {
  return (
    <div className="search-items-user-card-container">
      <Link
        to={`/profile/${user.userName}/user-id/${user.id}`}
        style={{ textDecoration: "none", color: "black" }}>
        <div className="search-items-user-card-wrapper">
          <img
            src={`${user.Profile.avatarUrl}`}
            alt="user-pict"
            className="search-items-user-image"
          />
          <span className="search-items-user-username">{user.userName}</span>
        </div>
      </Link>
    </div>
  );
};

export default SearchUserItems;
