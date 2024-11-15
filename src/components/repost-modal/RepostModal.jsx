import React, { useReducer, useState, useMemo, Fragment } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setIsRepostModalOpen,
  setPostItem,
  setIsAddPosting,
} from "../../redux/slices/postsSlice";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import GlobalButton from "../button/GlobalButton";
import RepostOptionStatus from "../option-status/RepostOptionStatus";
import { useSelector, useDispatch } from "react-redux";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import Post from "../posting/Post";
import { createNewRepost } from "../../apiCalls/postsApiFetch";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";

import "./RepostModal.scss";

const intervalToCloseRepostModal = 4000;

export default function RepostModal() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );
  const dispatch = useDispatch();

  const currentUserNameFromSlice = useSelector((state) => state.user.userName);
  const postItemFromSlice = useSelector((state) => state.posts.postItem);
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
  };

  const hitCreateNewRepostApi = (payloadBodyObj) => {
    mutate({ type: actionType.RUN_LOADING_STATUS });

    createNewRepost(payloadBodyObj)
      .then((postingResult) => {
        if (postingResult.data.success) {
          dispatch(setIsAddPosting({ isSuccessPosting: true }));

          setTimeout(() => {
            mutate({ type: actionType.STOP_LOADING_STATUS });
            closeRepostModalEdit(false);
          }, intervalToCloseRepostModal);
        }
      })
      .catch((error) => {
        console.error("errorMessageFromServer", error);
        setCaption("");
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
  };

  const doSaveRepost = () => {
    if (loadingState.status) return;

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
  };

  return (
    <div className="content-container repost-modal">
      <div className="repost-modal-wrapper">
        {/* Top Content of Modal */}
        <div className="repost-modal-top-content">
          <div className="repost-modal-top-content-title">Repost Modal</div>
          {!loadingState.status && (
            <CancelIcon
              className="repost-modal-close-button"
              onClick={() => closeRepostModalEdit(false)}
            />
          )}
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
            {!loadingState.status && (
              <GlobalButton
                buttonLabel={"Batal"}
                classStyleName={"repost-button cancel"}
                onClick={() => closeRepostModalEdit(false)}
              />
            )}

            <GlobalButton
              buttonLabel={
                loadingState.status
                  ? "Loading ..."
                  : getStatus(activeRepostType)
              }
              classStyleName={"repost-button save"}
              onClick={doSaveRepost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
