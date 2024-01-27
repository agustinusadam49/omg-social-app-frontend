import React, { useMemo } from "react";

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
        <div className="post-middle-text">{caption}</div>
      ) : (
        ""
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
