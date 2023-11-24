import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useCallback,
  useMemo,
} from "react";
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
import OptionStatus from "../option-status/OptionStatus";
import { useAutomaticCloseMessageToast } from "../../utils/automaticCloseMessageToast";
import RoundedLoader from "../rounded-loader/RoundedLoader";
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

  const [uploadPostPending, setUploadPostPending] = useState(false);
  const [uploadPostLoading, setUploadPostLoading] = useState(false);
  const [isUploadPostSuccess, setIsUploadPostSuccess] = useState(false);

  const [uploadImagePending, setUploadImagePending] = useState(false);
  const [uploadImageLoading, setUploadImageLoading] = useState(false);
  const [isUploadImageSuccess, setIsUploadImageSuccess] = useState(false);

  const [openLoadDataItems, setOpenLoadDataItems] = useState(false);

  const loadItems = useMemo(() => {
    return [
      {
        name: "Upload Posting",
        pendingStatus: uploadPostPending,
        loadingStatus: uploadPostLoading,
        successStatus: isUploadPostSuccess,
        isSkip: !!caption,
      },
      {
        name: "Upload Image",
        pendingStatus: uploadImagePending,
        loadingStatus: uploadImageLoading,
        successStatus: isUploadImageSuccess,
        isSkip: !!fileImagePosting,
      },
    ];
  }, [
    uploadPostPending,
    uploadPostLoading,
    isUploadPostSuccess,
    caption,
    uploadImagePending,
    uploadImageLoading,
    isUploadImageSuccess,
    fileImagePosting,
  ]);

  const [loadItemsState, setLoadItemsState] = useState(loadItems);

  useEffect(() => {
    const filteredLoadItems = loadItems
      .filter((item) => item.isSkip)
      .sort((a, b) => b.loadingStatus - a.loadingStatus);
    setLoadItemsState(filteredLoadItems);
  }, [loadItems]);

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
      setUploadPostLoading(true);
      setUploadPostPending(false);
      createNewPosting(payloadBodyObj)
        .then((postingResult) => {
          if (postingResult.data.success) {
            setUploadPostLoading(false);
            setIsUploadPostSuccess(true);
            setCaption("");
            setFileImagePosting(null);
            dispatch(setIsAddPosting({ isSuccessPosting: true }));
            setFinishPostingStatus(true);
            setActiveStatus("PUBLIC");
            setOpenLoadDataItems(false);
          }
        })
        .catch((error) => {
          setUploadPostLoading(false);
          const errorMessageFromServer = error.response.data.errorMessage;
          console.error("errorMessageFromServer", errorMessageFromServer);
          setOpenLoadDataItems(false);
        });
    },
    [dispatch]
  );

  const doPosting = useCallback(() => {
    setOpenLoadDataItems(true);
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
      setUploadImageLoading(true);
      setUploadPostPending(true);
      setUploadImagePending(false);
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
            newPostBody.postImageUrl = response.data.secure_url;
            setUploadImageLoading(false);
            setIsUploadImageSuccess(true);
            hitCreateNewPostApi(newPostBody);
            setUploadProgress(0);
          }
        })
        .catch((error) => {
          setUploadImageLoading(false);
          console.error("upload image failed", error);
          setUploadProgress(0);
        });
    } else {
      setUploadImagePending(false);
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

  useEffect(() => {
    if (!openLoadDataItems) {
      setIsUploadPostSuccess(false);
      setIsUploadImageSuccess(false);
    }
  }, [openLoadDataItems]);

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

        {openLoadDataItems && (
          <div className="status-upload-and-post">
            {loadItemsState.map((item, idx) => (
              <div className="wording-status-wrapper" key={idx}>
                {item.pendingStatus && <div>Waiting</div>}
                {item.loadingStatus && (
                  <RoundedLoader
                    baseColor="gray"
                    secondaryColor="white"
                    size={15}
                  />
                )}
                {item.successStatus && <div>Success</div>}
                <div>{item.name}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Share);
