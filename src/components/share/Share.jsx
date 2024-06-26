import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
  useReducer,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { createNewPosting } from "../../apiCalls/postsApiFetch";
import {
  setIsAddPosting,
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
import { useUploadImagePostingHooks } from "./useUploadImagePostingHooks";

import "./Share.scss";
import { useShareLoadItems } from "./useShareLoadItems";
import { useShareCommonHooks } from "./useShareCommonHooks";

const CAPTION_REQUIRED_MESSAGE = "Minimal Caption harus terisi!";
const CLOUDINARY_KEY = process.env.REACT_APP_CLOUDINARY_FORM_DATA_KEY;

const Share = ({ userNameFromParam }) => {
  const dispatch = useDispatch();
  const toast = useToast();
  const intervalToClosePostLoadModal = 4000;

  const [shareState, mutate] = useReducer(shareReducer, INITIAL_SHARE_STATE);

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const openLoadDataModalSlice = useSelector(
    ({ posts }) => posts.openLoadDataModal
  );

  const [finishPostingStatus, setFinishPostingStatus] = useState(false);
  const [caption, setCaption] = useState("");
  const [fileImagePosting, setFileImagePosting] = useState(null);
  const [activeStatus, setActiveStatus] = useState("PUBLIC");

  const previewImagePostingRef = useRef(null);

  const userNameFromParamUrl = userNameFromParam;
  const displayPlaceHolderUsername = userNameFromParamUrl
    ? userNameFromParamUrl
    : currentUserNameFromSlice;

  const {
    handleSetCaptionOnParent,
    addFileImagePosting,
    cancelImagePreviewHandler,
    runPostPendingThenStopIt,
    runImagePendingThenLoading,
  } = useShareCommonHooks({
    setCaption,
    setFileImagePosting,
    onCancelImagePreviewHandler: () => {
      previewImagePostingRef.current.value = null;
      setFileImagePosting(null);
    },
    onRunPostPendingThenStopIt: () => {
      mutate({ type: shareActionType.RUN_POST_PENDING });
      setTimeout(() => {
        mutate({ type: shareActionType.STOP_POST_PENDING });
      }, 2000);
    },
    onRunImagePendingThenLoading: () => {
      mutate({ type: shareActionType.RUN_IMAGE_PENDING });
      setTimeout(() => {
        mutate({ type: shareActionType.RUN_IMAGE_LOADING });
      }, 1500);
    },
  });

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
    [dispatch, runPostPendingThenStopIt]
  );

  const { uploadProgress, executeUploadImage, appendKeyValues } =
    useUploadImagePostingHooks({
      onSuccess: ({ response, newPostBody }) => {
        const newPostingPayload = { ...newPostBody };
        previewImagePostingRef.current.value = null;
        newPostingPayload.postImageUrl = response.data.secure_url;
        mutate({ type: shareActionType.STOP_IMAGE_LOADING_WHEN_SUCCESS });
        hitCreateNewPostApi(newPostingPayload);
      },
      onError: ({ error }) => {
        previewImagePostingRef.current.value = null;
        setFileImagePosting(null);
        console.error("upload image failed", error);
        mutate({ type: shareActionType.STOP_IMAGE_LOADING });
      },
    });

  const doPosting = useCallback(async () => {
    if (!caption) return toast.error(CAPTION_REQUIRED_MESSAGE);

    setFinishPostingStatus(false);

    dispatch(setOpenLoadDataModal({ payload: true }));

    toast.closeError();

    const newPostBody = {
      postCaption: caption,
      senderName: currentUserNameFromSlice,
      status: activeStatus,
    };

    if (fileImagePosting) {
      await runImagePendingThenLoading();
      mutate({ type: shareActionType.RUN_POST_PENDING });
      const formData = appendKeyValues({
        file: fileImagePosting,
        upload_preset: CLOUDINARY_KEY,
      });
      executeUploadImage({ formData, newPostBody });
    } else {
      mutate({ type: shareActionType.STOP_IMAGE_PENDING });
      hitCreateNewPostApi(newPostBody);
    }
  }, [
    caption,
    toast,
    currentUserNameFromSlice,
    activeStatus,
    fileImagePosting,
    dispatch,
    runImagePendingThenLoading,
    appendKeyValues,
    executeUploadImage,
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

  useAutomaticCloseMessageToast({
    status: finishPostingStatus,
    setStatus: setFinishPostingStatus,
    interval: 8000,
  });

  useShareLoadItems({
    inputCaption: caption,
    inputFileImage: fileImagePosting,
    inputShareState: shareState,
    title: {
      _1: "Upload Caption",
      _2: "Upload Image",
    },
  });

  useEffect(() => {
    setFinishPostingStatus(false);
  }, [fileImagePosting, caption]);

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
