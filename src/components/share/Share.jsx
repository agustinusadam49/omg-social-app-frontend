import React, { useState, useEffect, memo } from "react";
import PermMediaIcon from "@mui/icons-material/PermMedia";
import LabelIcon from "@mui/icons-material/Label";
import RoomIcon from "@mui/icons-material/Room";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  createNewPosting,
  uploadImagePosting,
} from "../../apiCalls/postsApiFetch";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddPosting } from "../../redux/slices/postsSlice";
import { Link } from "react-router-dom";
import { accessToken } from "../../utils/getLocalStorage";
import GlobalButton from "../button/GlobalButton";
import "./Share.scss";

const Share = ({ userNameFromParam }) => {
  const dispatch = useDispatch();

  const user_access_token = accessToken();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const currentUserIdFromSlice = useSelector((state) => state.user.userId);
  const currentUserAvatarFromSlice = useSelector(
    (state) => state.user.userAvatarPicture
  );

  const [uploadProgress, setUploadProgress] = useState(0);
  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [errorMessageCaption, setErrorMessageCaption] = useState(false);
  const [errorMessageEmptyCaption, setErrorMessageEmptyCaption] = useState("");
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);

  const userNameFromParamUrl = userNameFromParam;
  const displayPlaceHolderUsername = userNameFromParamUrl
    ? userNameFromParamUrl
    : currentUserNameFromSlice;

  const doAddNewPostWithEnter = (event) => {
    if (event.key === "Enter") {
      doPosting();
    }
  };

  const cancelImagePreviewHandler = () => {
    setFileImagePosting(null);
  };

  const hitCreateNewPostApi = (payloadBodyObj) => {
    createNewPosting(user_access_token, payloadBodyObj)
      .then((postingResult) => {
        if (postingResult.data.success) {
          setCaption("");
          setFileImagePosting(null);
          dispatch(setIsAddPosting({ isSuccessPosting: true }));
          setFinishPostingStatus(true);
        }
      })
      .catch((error) => {
        const errorMessageFromServer = error.response.data.errorMessage;
        console.log("errorMessageFromServer", errorMessageFromServer);
      });
  };

  const doPosting = async () => {
    setFinishPostingStatus(false);
    if (!caption) {
      setErrorMessageCaption(true);
      setErrorMessageEmptyCaption("Silahkan masukan caption terlebih dahulu!");
      return;
    }
    const newPostBody = {
      postCaption: caption,
      senderName: currentUserNameFromSlice,
    };

    if (fileImagePosting) {
      const formData = new FormData();
      formData.append("file", fileImagePosting);
      formData.append("upload_preset", "g7pxfer7");

      uploadImagePosting(formData, {
        onUploadProgress: (progressEvent) => {
          setUploadProgress(
            Math.round((progressEvent.loaded / progressEvent.total) * 100)
          );
        },
      })
        .then((response) => {
          newPostBody.postImageUrl = response.data.secure_url;
          hitCreateNewPostApi(newPostBody);
          setUploadProgress(0);
        })
        .catch((error) => {
          console.log("upload image failed", error);
          setUploadProgress(0);
        });
    } else {
      hitCreateNewPostApi(newPostBody);
    }
  };

  useEffect(() => {
    setErrorMessageCaption(false);
  }, [caption]);

  useEffect(() => {
    setFinishPostingStatus(false);
  }, [fileImagePosting]);

  // Menghilangkan success message secara otomatis setelah 10 detik
  useEffect(() => {
    if (finishPostingStatus === true) {
      setTimeout(() => {
        setFinishPostingStatus(false);
      }, 10000);
    }
  }, [finishPostingStatus]);

  // Menghilangkan error message caption empty secara otomatis setelah 10 detik
  useEffect(() => {
    if (errorMessageCaption === true) {
      setTimeout(() => {
        setErrorMessageCaption(false);
      }, 10000);
    }
  }, [errorMessageCaption]);

  return (
    <div className="share">
      <div className="share-wrapper">
        {/* Share component top menu */}
        <div className="share-top" onKeyPress={doAddNewPostWithEnter}>
          <Link
            to={`/profile/${displayPlaceHolderUsername}/user-id/${currentUserIdFromSlice}`}
            className="share-profile-image-wrapper"
          >
            <img
              src={currentUserAvatarFromSlice}
              alt="share-user-pict"
              className="share-profile-img"
            />
          </Link>

          <input
            placeholder={`Hai ${displayPlaceHolderUsername}, Apa yang ada dalam pikiranmu?`}
            className="share-input"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {/* Line */}
        <hr className="share-hr" />

        {/* Upload Progress */}
        {uploadProgress > 0 && (
          <div className="uploading-progress-container">
            <div className="progress-upload-presentage">{uploadProgress} %</div>
            <div className="uploading-wording">Uploading Image</div>
          </div>
        )}

        {/* Success Posting Message */}
        {finishPostingStatus && (
          <div className="success-message-container">
            <div className="success-message-wording">SUCCESS POSTING!</div>

            <CancelIcon
              className="cancel-success-message"
              onClick={() => setFinishPostingStatus(false)}
            />
          </div>
        )}

        {/* Warning Wording to fill caption field is mandatory */}
        {/* Silahkan input caption terlebih dahulu! */}
        {errorMessageCaption && (
          <div className="error-message-caption">
            <div className="error-message-wording">
              {errorMessageEmptyCaption}
            </div>

            <CancelIcon
              className="cancel-error-message"
              onClick={() => setErrorMessageCaption(false)}
            />
          </div>
        )}

        {/* Preview Image before uploading */}
        {fileImagePosting && (
          <div className="preview-img-container">
            <img
              src={URL.createObjectURL(fileImagePosting)}
              alt="preview-img"
              className="preview-img"
            />

            <CancelIcon
              className="cancel-preview-img"
              onClick={cancelImagePreviewHandler}
            />
          </div>
        )}

        {/* Share component bottom menu */}
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
            onClick={doPosting}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Share);
