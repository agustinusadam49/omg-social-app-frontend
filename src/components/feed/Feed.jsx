import React from "react";
import HomePosts from "../../components/home-posts/HomePosts";
import ProfilePosts from "../../components/profile-posts/ProfilePosts";

import "./Feed.scss";

export default function Feed({ profile, userId, username }) {
  const userNameFromParam = username;
  const paramUserId = parseInt(userId);

  return (
    <div className="feed">
      <div className="feed-wrapper">
        {profile ? (
          <ProfilePosts
            paramUserId={paramUserId}
            userNameFromParam={userNameFromParam}
          />
        ) : (
          <HomePosts />
        )}
      </div>
    </div>
  );
}
