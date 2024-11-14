import React, {
  useReducer,
  useState,
  useMemo,
  Fragment,
  useCallback,
  useEffect,
} from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setIsRepostModalOpen,
  setPostItem,
  setIsAddPosting,
  setOpenLoadDataModal,
} from "../../redux/slices/postsSlice";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import GlobalButton from "../button/GlobalButton";
import RepostOptionStatus from "../option-status/RepostOptionStatus";
import { useSelector, useDispatch } from "react-redux";
import {
  INITIAL_SHARE_STATE,
  shareActionType,
  shareReducer,
} from "../share/share-reducer";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import Post from "../posting/Post";
import { useShareCommonHooks } from "../share/useShareCommonHooks";
import { useShareLoadItems } from "../share/useShareLoadItems";
import { createNewRepost } from "../../apiCalls/postsApiFetch";

import "./RepostModal.scss";

export default function RepostModal() {
  const intervalToClosePostLoadModal = 4000;
  const [shareState, mutate] = useReducer(shareReducer, INITIAL_SHARE_STATE);

  const dispatch = useDispatch();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const postItemFromSlice = useSelector((state) => state.posts.postItem);
  const openLoadDataModalSlice = useSelector(
    ({ posts }) => posts.openLoadDataModal
  );
  const [activeRepostType, setActiveRepostType] = useState("REPOST");
  const [caption, setCaption] = useState("");

  const registrationRulesSchema = useMemo(
    () => ({
      caption: {
        currentValue: caption,
        isRequired: true,
      },
    }),
    [caption]
  );

  const { isValid, handleInputErrorMessage } = useFormValidation({
    rulesSchema: registrationRulesSchema,
  });

  const getStatus = (repostTypeEnum) => {
    return repostTypeEnum
      .split("_")
      .map((status) => status[0] + status.substring(1).toLowerCase())
      .join(" ");
  };

  const closeRepostModalEdit = (value) => {
    dispatch(setIsRepostModalOpen({ isRepostModalOpen: value }));
    dispatch(setPostItem({ postItem: null }));
    setActiveRepostType("REPOST");
  };

  const { runPostPendingThenStopIt } = useShareCommonHooks({
    onRunPostPendingThenStopIt: () => {
      mutate({ type: shareActionType.RUN_POST_PENDING });
      setTimeout(() => {
        mutate({ type: shareActionType.STOP_POST_PENDING });
      }, 2000);
    },
  });

  const hitCreateNewRepostApi = useCallback(
    async (payloadBodyObj) => {
      await runPostPendingThenStopIt();
      mutate({ type: shareActionType.RUN_POST_LOADING });
      createNewRepost(payloadBodyObj)
        .then((postingResult) => {
          if (postingResult.data.success) {
            mutate({ type: shareActionType.STOP_POST_LOADING_WHEN_SUCCESS });
            dispatch(setIsAddPosting({ isSuccessPosting: true }));
            dispatch(setIsRepostModalOpen({ isRepostModalOpen: false }));
            dispatch(setPostItem({ postItem: null }));
            setActiveRepostType("REPOST");

            setTimeout(() => {
              dispatch(setOpenLoadDataModal({ payload: false }));
            }, intervalToClosePostLoadModal);
          }
        })
        .catch((error) => {
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

  const doSaveRepost = useCallback(async () => {
    dispatch(setOpenLoadDataModal({ payload: true }));

    const repostPayload = {
      postCaption: caption,
      postStatus: activeRepostType,
      sourcePostId: postItemFromSlice.id,
      senderName: currentUserNameFromSlice,
    };

    if (activeRepostType === "REPOST") {
      hitCreateNewRepostApi(repostPayload);
    } else {
      dispatch(setIsClicked({ payload: true }));

      if (isValid) {
        hitCreateNewRepostApi(repostPayload);
      }
    }
  }, [
    activeRepostType,
    caption,
    currentUserNameFromSlice,
    dispatch,
    hitCreateNewRepostApi,
    isValid,
    postItemFromSlice.id,
  ]);

  useShareLoadItems({
    inputCaption: caption || "reposted",
    inputFileImage: null,
    inputShareState: shareState,
    title: {
      _1: "Upload Caption",
      _2: "Upload Image",
    },
  });

  useEffect(() => {
    if (!openLoadDataModalSlice) {
      mutate({ type: shareActionType.STOP_POST_AND_IMAGE_SUCCESS });
      setCaption("");
    }
  }, [openLoadDataModalSlice]);

  return (
    <div className="content-container repost-modal">
      <div className="repost-modal-wrapper">
        {/* Top Content of Modal */}
        <div className="repost-modal-top-content">
          <div className="repost-modal-top-content-title">Repost Modal</div>
          <CancelIcon
            className="repost-modal-close-button"
            onClick={() => closeRepostModalEdit(false)}
          />
        </div>

        {/* Bottom Content of Modal */}
        <div className="repost-modal-bottom-content">
          <RepostOptionStatus
            setActiveRepostType={setActiveRepostType}
            activeRepostType={activeRepostType}
          />

          {activeRepostType === "REPOST_QUOTE" && (
            <Fragment>
              <InputTextGlobal
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                inputPlaceholder="Caption here ..."
                inputErrorMessage={handleInputErrorMessage("caption")}
              />

              <Post
                postedData={
                  postItemFromSlice.postStatus === "ORIGINAL_POST"
                    ? postItemFromSlice
                    : postItemFromSlice.repost
                }
                isRepost={true}
              />
            </Fragment>
          )}

          <div className="button-repost-wrapper">
            <GlobalButton
              buttonLabel={"Batal"}
              classStyleName={"repost-button cancel"}
              onClick={() => closeRepostModalEdit(false)}
            />

            <GlobalButton
              buttonLabel={getStatus(activeRepostType)}
              classStyleName={"repost-button save"}
              onClick={doSaveRepost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
