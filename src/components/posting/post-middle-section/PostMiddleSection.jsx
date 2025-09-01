import React, { useMemo } from "react";
import Post from "../Post";

import "./PostMiddleSection.scss";

export default function PostMiddleSection({ caption, postImage, dataPost }) {
  const isVideo = useMemo(() => {
    const urlFile = dataPost?.postImageUrl || "";
    const startIndex = urlFile.length - 1 - 3;
    const lastIndex = urlFile.length;
    const fileFormat = urlFile.substring(startIndex, lastIndex);
    return fileFormat === ".mp4";
  }, [dataPost]);

  return (
    <div className="post-middle">
      {dataPost?.postCaption ? (
        <div className="post-middle-text">
          {dataPost.postStatus === "REPOST" ? dataPost.User.userName : ""}{" "}
          {caption}
        </div>
      ) : (
        ""
      )}

      {dataPost.repost &&
        (dataPost?.postStatus === "REPOST_QUOTE" ||
          dataPost?.postStatus === "REPOST") && (
          <Post postedData={dataPost.repost} isRepost={true} />
        )}

      {dataPost?.postImageUrl && !isVideo ? (
        <img src={postImage} alt="user-post-pict" className="post-img" />
      ) : (
        ""
      )}

      {isVideo && <video src={postImage} controls className="post-img"></video>}
    </div>
  );
}
