import React, { memo } from "react";
import { useSelector } from "react-redux";
import GlobalImage from "../../global-image/GlobalImage";
import "./ShareTopSection.scss";

const ShareTopSection = ({
  displayPlaceHolderUsername,
  caption,
  handleSetCaptionFromParent,
  doAddNewPostWithEnter,
}) => {
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );

  const handleEnterAddPost = (e) => {
    doAddNewPostWithEnter(e);
  };

  const currentUserIdFromSlice = useSelector((state) => state.user.userId);

  const pathForImageLink = `/profile/${displayPlaceHolderUsername}/user-id/${currentUserIdFromSlice}`;

  return (
    <div className="share-top" onKeyPress={(e) => handleEnterAddPost(e)}>
      <GlobalImage
        widthSize={50}
        heighSize={50}
        imageName={"share-user-pict"}
        imageSource={currentUserAvatarFromSlice}
        additionalClassName={[]}
        isRoundImg={true}
        pathLink={pathForImageLink}
      />

      <input
        placeholder={`Hai ${displayPlaceHolderUsername}, Apa yang ada dalam pikiranmu?`}
        className="share-input"
        value={caption}
        onChange={(e) => handleSetCaptionFromParent(e.target.value)}
      />
    </div>
  );
};

export default memo(ShareTopSection);
