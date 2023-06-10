import React, {memo} from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import GlobalButton from "../../button/GlobalButton";

import "./ShareBottomSection.scss";

const ShareBottomSection = ({
  setFileImagePosting,
  doPosting,
  inputRef,
}) => {
  const handleCreatePosting = () => {
    doPosting();
  };

  return (
    <div className="share-bottom">
      <div className="share-options-container">
        <label htmlFor="fileImagePosting" className="share-option">
          <PermMediaIcon htmlColor="tomato" className="share-icon" />
          <span className="share-option-text">Photo or Video</span>
          <input
            style={{ display: "none" }}
            type="file"
            id="fileImagePosting"
            accept=".png,.jpeg,.jpg"
            ref={inputRef}
            onChange={(e) => setFileImagePosting(e.target.files[0])}
          />
        </label>

        <div className="share-option">
          <LabelIcon htmlColor="blue" className="share-icon" />
          <span className="share-option-text">Tag</span>
        </div>

        <div className="share-option">
          <RoomIcon htmlColor="green" className="share-icon" />
          <span className="share-option-text">Location</span>
        </div>

        <div className="share-option">
          <EmojiEmotionsIcon htmlColor="goldenrod" className="share-icon" />
          <span className="share-option-text">Feelings</span>
        </div>
      </div>

      <GlobalButton
        buttonLabel={"Share"}
        classStyleName="share-button"
        onClick={handleCreatePosting}
      />
    </div>
  );
}

export default memo(ShareBottomSection)
