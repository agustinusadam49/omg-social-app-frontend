import React, { useState, useEffect, memo, useRef } from "react";
import {
  createNewPosting,
  uploadImagePosting,
} from "../../apiCalls/postsApiFetch";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddPosting } from "../../redux/slices/postsSlice";
import ShareTopSection from "./share-top-section/ShareTopSection";
import UploadProgessSection from "./upload-progress-section/UploadProgessSection";
import FinishPostingStatus from "./finish-posting-status/FinishPostingStatus";
import ErrorMessageCaption from "./error-message-caption/ErrorMessageCaption";
import SharePreviewImageSection from "./share-preview-image-section/SharePreviewImageSection";
import ShareBottomSection from "./share-bottom-section/ShareBottomSection";
import "./Share.scss";

const Share = ({ userNameFromParam }) => {
  const dispatch = useDispatch();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [errorMessageCaption, setErrorMessageCaption] = useState(false);
  const [errorMessageEmptyCaption, setErrorMessageEmptyCaption] = useState("");
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);
  const previewImagePostingRef = useRef(null)

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
    previewImagePostingRef.current.value = null
    setFileImagePosting(null);
  };

  const hitCreateNewPostApi = (payloadBodyObj) => {
    createNewPosting(payloadBodyObj)
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
    setFinishPostingStatus(false);
    setErrorMessageCaption(false);
  }, [fileImagePosting, caption]);

  // Menghilangkan success message secara otomatis setelah 10 detik
  useEffect(() => {
    const delayedDisappearedFinishStatus =
      finishPostingStatus === true &&
      setInterval(() => {
        setFinishPostingStatus(false);
      }, 10000);

    return () => {
      clearInterval(delayedDisappearedFinishStatus);
    };
  }, [finishPostingStatus]);

  // Menghilangkan error message caption empty secara otomatis setelah 10 detik
  useEffect(() => {
    const delayDisappearedErrorMessage =
      errorMessageCaption === true &&
      setInterval(() => {
        setErrorMessageCaption(false);
      }, 10000);

    return () => {
      clearInterval(delayDisappearedErrorMessage);
    };
  }, [errorMessageCaption]);

  return (
    <div className="share">
      <div className="share-wrapper">
        <ShareTopSection
          displayPlaceHolderUsername={displayPlaceHolderUsername}
          caption={caption}
          setCaption={setCaption}
          doAddNewPostWithEnter={doAddNewPostWithEnter}
        />

        <hr className="share-hr" />

        {uploadProgress > 0 && (
          <UploadProgessSection uploadProgress={uploadProgress} />
        )}

        {finishPostingStatus && (
          <FinishPostingStatus
            setFinishPostingStatus={setFinishPostingStatus}
          />
        )}

        {/* Warning Wording to fill caption field is mandatory */}
        {/* Silahkan input caption terlebih dahulu! */}
        {errorMessageCaption && (
          <ErrorMessageCaption
            errorMessageEmptyCaption={errorMessageEmptyCaption}
            setErrorMessageCaption={setErrorMessageCaption}
          />
        )}

        {fileImagePosting && (
          <SharePreviewImageSection
            fileImagePosting={fileImagePosting}
            cancelImagePreviewHandler={cancelImagePreviewHandler}
          />
        )}

        <ShareBottomSection
          setFileImagePosting={setFileImagePosting}
          doPosting={doPosting}
          inputRef={previewImagePostingRef}
        />
      </div>
    </div>
  );
};

export default memo(Share);
