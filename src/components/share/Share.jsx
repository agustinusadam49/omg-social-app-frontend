import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
  useMemo,
  useReducer,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  createNewPosting,
  uploadImagePosting,
} from "../../apiCalls/postsApiFetch";
import {
  setIsAddPosting,
  setPostLoadItems,
  setOpenLoadDataModal,
} from "../../redux/slices/postsSlice";
import ShareTopSection from "./share-top-section/ShareTopSection";
import UploadProgessSection from "./upload-progress-section/UploadProgessSection";
import FinishPostingStatus from "./finish-posting-status/FinishPostingStatus";
import ErrorMessageCaption from "./error-message-caption/ErrorMessageCaption";
import SharePreviewImageSection from "./share-preview-image-section/SharePreviewImageSection";
import ShareBottomSection from "./share-bottom-section/ShareBottomSection";
import OptionStatus from "../option-status/OptionStatus";
import { useAutomaticCloseMessageToast } from "../../utils/automaticCloseMessageToast";
import { useToast } from "../../utils/useToast";
import {
  INITIAL_SHARE_STATE,
  shareActionType,
  shareReducer,
} from "./share-reducer";

import "./Share.scss";

const CAPTION_REQUIRED_MESSAGE = "Minimal Caption harus terisi!";

const Share = ({ userNameFromParam }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const intervalToClosePostLoadModal = 4000;

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PUBLIC");

  const [shareState, mutate] = useReducer(shareReducer, INITIAL_SHARE_STATE);

  const openLoadDataModalSlice = useSelector(
    ({ posts }) => posts.openLoadDataModal
  );

  const loadItems = useMemo(() => {
    return [
      {
        title: "Upload Caption",
        pendingStatus: shareState.uploadPostPending,
        loadingStatus: shareState.uploadPostLoading,
        successStatus: shareState.isUploadPostSuccess,
        isNotSkip: !!caption,
      },
      {
        title: "Upload Image",
        pendingStatus: shareState.uploadImagePending,
        loadingStatus: shareState.uploadImageLoading,
        successStatus: shareState.isUploadImageSuccess,
        isNotSkip: !!fileImagePosting,
      },
    ];
  }, [
    caption,
    fileImagePosting,
    shareState.uploadPostPending,
    shareState.uploadPostLoading,
    shareState.isUploadPostSuccess,
    shareState.uploadImagePending,
    shareState.uploadImageLoading,
    shareState.isUploadImageSuccess,
  ]);

  useEffect(() => {
    const filteredLoadItems = loadItems
      .filter((item) => item.isNotSkip)
      .sort((a, b) => b.loadingStatus - a.loadingStatus);
    dispatch(setPostLoadItems({ payload: filteredLoadItems }));
  }, [loadItems, dispatch]);

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

  const runPostPendingThenStopIt = async () => {
    mutate({ type: shareActionType.RUN_POST_PENDING });

    setTimeout(() => {
      mutate({ type: shareActionType.STOP_POST_PENDING });
    }, 2000);
  };

  const runImagePendingThenLoading = async () => {
    mutate({ type: shareActionType.RUN_IMAGE_PENDING });
    setTimeout(() => {
      mutate({ type: shareActionType.RUN_IMAGE_LOADING });
    }, 1500);
  };

  const hitCreateNewPostApi = useCallback(
    async (payloadBodyObj) => {
      await runPostPendingThenStopIt();
      mutate({ type: shareActionType.RUN_POST_LOADING });
      createNewPosting(payloadBodyObj)
        .then((postingResult) => {
          if (postingResult.data.success) {
            mutate({ type: shareActionType.STOP_POST_LOADING_WHEN_SUCCESS });
            previewImagePostingRef.current.value = null;
            dispatch(setIsAddPosting({ isSuccessPosting: true }));
            setFinishPostingStatus(true);
            setActiveStatus("PUBLIC");

            setTimeout(() => {
              dispatch(setOpenLoadDataModal({ payload: false }));
            }, intervalToClosePostLoadModal);
          }
        })
        .catch((error) => {
          previewImagePostingRef.current.value = null;
          setFileImagePosting(null);
          setCaption("");
          mutate({ type: shareActionType.STOP_POST_LOADING });
          const errorMessageFromServer = error.response.data.errorMessage;
          console.error("errorMessageFromServer", errorMessageFromServer);

          setTimeout(() => {
            dispatch(setOpenLoadDataModal({ payload: false }));
          }, intervalToClosePostLoadModal);
        });
    },
    [dispatch]
  );

  const doPosting = useCallback(async () => {
    if (!caption) return toast.error(CAPTION_REQUIRED_MESSAGE);

    setFinishPostingStatus(false);

    dispatch(setOpenLoadDataModal({ payload: true }));

    const CLOUDINARY_KEY = process.env.REACT_APP_CLOUDINARY_FORM_DATA_KEY;

    toast.closeError();

    const newPostBody = {
      postCaption: caption,
      senderName: currentUserNameFromSlice,
      status: activeStatus,
    };

    if (fileImagePosting) {
      await runImagePendingThenLoading();
      mutate({ type: shareActionType.RUN_POST_PENDING });
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
          const isSuccessGetUrl = !!response.data.secure_url;
          if (isSuccessGetUrl) {
            previewImagePostingRef.current.value = null;
            newPostBody.postImageUrl = response.data.secure_url;
            mutate({ type: shareActionType.STOP_IMAGE_LOADING_WHEN_SUCCESS });
            hitCreateNewPostApi(newPostBody);
            setUploadProgress(0);
          }
        })
        .catch((error) => {
          previewImagePostingRef.current.value = null;
          setFileImagePosting(null);
          mutate({ type: shareActionType.STOP_IMAGE_LOADING });
          setUploadProgress(0);
          console.error("upload image failed", error);
        });
    } else {
      mutate({ type: shareActionType.STOP_IMAGE_PENDING });
      hitCreateNewPostApi(newPostBody);
    }
  }, [
    caption,
    currentUserNameFromSlice,
    fileImagePosting,
    activeStatus,
    toast,
    hitCreateNewPostApi,
    dispatch,
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

  useEffect(() => {
    if (!openLoadDataModalSlice) {
      previewImagePostingRef.current.value = null;
      mutate({ type: shareActionType.STOP_POST_AND_IMAGE_SUCCESS });
      setFileImagePosting(null);
      setCaption("");
    }
  }, [openLoadDataModalSlice]);

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

        <OptionStatus
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
