import React from "react";
import "./EmptyStatePosts.scss";

const EmptyStatePosts = ({ params }) => {
  const { username, location } = params;
  const firstWording = "Belum ada Public Post";
  const isHomePageLocation = location === "home-page";
  const isMyProfilePageLocation = location === "profile-page-user-loggedin";
  const tellUserToMakePost = `${
    isMyProfilePageLocation ? "Buat" : isHomePageLocation ? "buat" : ""
  } postingan anda dan click 'share'.`;
  const posibilityFollowWording = `Silahkan follow ${
    isHomePageLocation ? "users" : username
  } untuk kemungkinan melihat postingan dengan status Followers Only.`;
  const additionalHomePageWording = `${posibilityFollowWording} Atau ${tellUserToMakePost}`;
  const homePageWording = `Anda dan user lainnya belum mem-publish postingan. ${additionalHomePageWording}`;
  const profilePageUserLoggedinWording = tellUserToMakePost;
  const profilePageOtherUserWording = `${username} belum membuat postingan. ${posibilityFollowWording}`;

  return (
    <div className="empty-state-posts-parrent">
      <div className="first-wording">{firstWording}</div>
      <div className="second-wording">
        {isHomePageLocation
          ? homePageWording
          : isMyProfilePageLocation
          ? profilePageUserLoggedinWording
          : profilePageOtherUserWording}
      </div>
    </div>
  );
};

export default EmptyStatePosts;
