import React, { useState, useEffect, memo, useRef, useCallback } from "react";
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
import OptionStatusSection from "./option-status-section/OptionStatusSection";
import { useAutomaticCloseMessageToast } from "../../utils/automaticCloseMessageToast";
import { useToast } from "../../utils/useToast";

import "./Share.scss";

const Share = ({ userNameFromParam }) => {
  const dispatch = useDispatch();
  const toast = useToast();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PUBLIC");

  const previewImagePostingRef = useRef(null);

  const userNameFromParamUrl = userNameFromParam;
  const displayPlaceHolderUsername = userNameFromParamUrl
    ? userNameFromParamUrl
    : currentUserNameFromSlice;

  const handleSetCaptionOnParent = useCallback((val) => {
    setCaption(val);
  }, []);

  const addFileImagePosting = useCallback((file) => {
    setFileImagePosting(file);
  }, []);

  const cancelImagePreviewHandler = useCallback(() => {
    previewImagePostingRef.current.value = null;
    setFileImagePosting(null);
  }, []);

  const hitCreateNewPostApi = useCallback(
    (payloadBodyObj) => {
      createNewPosting(payloadBodyObj)
        .then((postingResult) => {
          if (postingResult.data.success) {
            setCaption("");
            setFileImagePosting(null);
            dispatch(setIsAddPosting({ isSuccessPosting: true }));
            setFinishPostingStatus(true);
            setActiveStatus("PUBLIC");
          }
        })
        .catch((error) => {
          const errorMessageFromServer = error.response.data.errorMessage;
          console.log("errorMessageFromServer", errorMessageFromServer);
        });
    },
    [dispatch]
  );

  const doPosting = useCallback(() => {
    const CLOUDINARY_KEY = process.env.REACT_APP_CLOUDINARY_FORM_DATA_KEY;

    setFinishPostingStatus(false);
    if (!caption) {
      toast.error("Minimal Caption harus terisi!");
      return;
    }

    toast.closeError();

    const newPostBody = {
      postCaption: caption,
      senderName: currentUserNameFromSlice,
      status: activeStatus,
    };

    if (fileImagePosting) {
      const formData = new FormData();
      formData.append("file", fileImagePosting);
      formData.append("upload_preset", CLOUDINARY_KEY);

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
  }, [
    caption,
    currentUserNameFromSlice,
    fileImagePosting,
    activeStatus,
    toast,
    hitCreateNewPostApi,
  ]);

  const doAddNewPostWithEnter = useCallback(
    (event) => {
      if (event.key === "Enter") {
        doPosting();
      }
    },
    [doPosting]
  );

  useEffect(() => {
    setFinishPostingStatus(false);
  }, [fileImagePosting, caption]);

  useAutomaticCloseMessageToast({
    status: finishPostingStatus,
    setStatus: setFinishPostingStatus,
    interval: 8000,
  });

  return (
    <div className="share">
      <div className="share-wrapper">
        <ShareTopSection
          displayPlaceHolderUsername={displayPlaceHolderUsername}
          caption={caption}
          handleSetCaptionFromParent={handleSetCaptionOnParent}
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

        {toast.isActiveError && (
          <ErrorMessageCaption
            errorMessage={toast.errorMessage}
            handleCancelErrorMessage={toast.closeError}
          />
        )}

        {fileImagePosting && (
          <SharePreviewImageSection
            fileImagePosting={fileImagePosting}
            cancelImagePreviewHandler={cancelImagePreviewHandler}
          />
        )}

        <OptionStatusSection
          setActiveStatus={setActiveStatus}
          activeStatus={activeStatus}
        />

        <ShareBottomSection
          setFileImagePosting={addFileImagePosting}
          doPosting={doPosting}
          inputRef={previewImagePostingRef}
          uploadProgress={uploadProgress}
        />
      </div>
    </div>
  );
};

export default memo(Share);
