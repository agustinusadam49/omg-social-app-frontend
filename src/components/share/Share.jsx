import React, {
  useState,
  useEffect,
  memo,
  useMemo,
  useRef,
  useCallback,
} from "react";
import {
  createNewPosting,
  uploadImagePosting,
} from "../../apiCalls/postsApiFetch";
import { userInfoLogin } from "../../redux/apiCalls";
import { useSelector, useDispatch } from "react-redux";
import { setIsAddPosting } from "../../redux/slices/postsSlice";
import ShareTopSection from "./share-top-section/ShareTopSection";
import UploadProgessSection from "./upload-progress-section/UploadProgessSection";
import FinishPostingStatus from "./finish-posting-status/FinishPostingStatus";
import ErrorMessageCaption from "./error-message-caption/ErrorMessageCaption";
import SharePreviewImageSection from "./share-preview-image-section/SharePreviewImageSection";
import ShareBottomSection from "./share-bottom-section/ShareBottomSection";
import { useAutomaticCloseMessageToast } from "../../utils/automaticCloseMessageToast";
import { useToast } from "../../utils/useToast";
import { accessToken } from "../../utils/getLocalStorage";

import "./Share.scss";

const Share = ({ userNameFromParam }) => {
  const access_token = accessToken();
  const dispatch = useDispatch();
  const toast = useToast();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  const currentUserData = useSelector((state) => state.user.currentUsers);
  const currentUserFollower = currentUserData.followers;

  const [uploadProgress, setUploadProgress] = useState(0);
  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PUBLIC");
  const [currentUserLoginFollowers, setCurrentUserLoginFollowers] = useState([]);
  const previewImagePostingRef = useRef(null);

  const shareOptionStatus = useMemo(() => {
    let statusOptions = [
      {
        name: "PUBLIC",
        description: "Semua orang dapat melihat postingan mu.",
      },
      {
        name: "PRIVATE",
        description: "Hanya kamu yang dapat melihat postingan ini.",
      },
    ];

    let followersOnlyStatus = {
      name: "FOLLOWERS_ONLY",
      description:
        "Hanya kamu dan followers mu yang dapat melihat postingan ini.",
    };

    if (currentUserLoginFollowers.length) {
      statusOptions.push(followersOnlyStatus);
    }

    return statusOptions;
  }, [currentUserLoginFollowers]);

  const userNameFromParamUrl = userNameFromParam;
  const displayPlaceHolderUsername = userNameFromParamUrl
    ? userNameFromParamUrl
    : currentUserNameFromSlice;

  const getStatus = (statusFromResponse) => {
    const POST_STATUS_ENUM = {
      PUBLIC: "Public",
      PRIVATE: "Private",
      FOLLOWERS_ONLY: "Followers Only",
    };

    return POST_STATUS_ENUM[statusFromResponse];
  };

  const toggleActiveStatus = (status) => {
    if (status === activeStatus) return;
    setActiveStatus(status);
  };

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
    if (currentUserFollower) {
      const followers = currentUserFollower.map((follower) => follower) || [];
      setCurrentUserLoginFollowers(followers);
    }
  }, [currentUserFollower]);

  useEffect(() => {
    setFinishPostingStatus(false);
  }, [fileImagePosting, caption]);

  useAutomaticCloseMessageToast({
    status: finishPostingStatus,
    setStatus: setFinishPostingStatus,
    interval: 8000,
  });

  useEffect(() => {
    userInfoLogin(access_token, dispatch);
  }, [access_token, dispatch]);

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

        <div className="share-status-options-menu">
          {shareOptionStatus.map((status, index) => (
            <div
              key={index}
              className={`share-status-option-item ${
                activeStatus === status.name ? "active" : ""
              }`}
              onClick={() => toggleActiveStatus(status.name)}
            >
              <div className="share-status-name">{getStatus(status.name)}</div>
              <div className="share-status-description">
                {status.description}
              </div>
            </div>
          ))}
        </div>

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
