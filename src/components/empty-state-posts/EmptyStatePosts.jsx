import React from "react";
import "./EmptyStatePosts.scss";

const EmptyStatePosts = ({ params }) => {
  const { username, location } = params;

  return (
    <div className="empty-state-posts-parrent">
      <div className="first-wording">Belum ada postingan</div>
      <div className="second-wording">
        {location === "home-page"
          ? "Anda dan user lainnya belum membuat postingan."
          : location === "profile-page-user-loggedin"
          ? "Silahkan buat postingan anda dan click 'share'."
          : `${username} belum membuat postingan.`}
      </div>
    </div>
  );
};

export default EmptyStatePosts;
