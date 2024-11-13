import React, { useReducer, useState, useMemo, Fragment } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  setIsRepostModalOpen,
  setPostItem,
} from "../../redux/slices/postsSlice";
import { setIsClicked } from "../../redux/slices/buttonsSlice";
import GlobalButton from "../button/GlobalButton";
import RepostOptionStatus from "../option-status/RepostOptionStatus";
import { useSelector, useDispatch } from "react-redux";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";
import InputTextGlobal from "../../components/input-text-global/InputTextGlobal";
import { useFormValidation } from "../../custom-hooks/useFormValidation";
import Post from "../posting/Post";

import "./RepostModal.scss";

export default function RepostModal() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

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
    setActiveRepostType("REPOST");
  };

  const hitRepost = () => {
    console.log("hitRepost");
    mutate({ type: actionType.RUN_LOADING_STATUS });
    mutate({ type: actionType.STOP_LOADING_STATUS });
  };

  const hitRepostQuote = () => {
    console.log("hitRepostQuote");
    mutate({ type: actionType.RUN_LOADING_STATUS });
    mutate({ type: actionType.STOP_LOADING_STATUS });
  };

  const doSaveRepost = () => {
    if (loadingState.status) return;

    if (activeRepostType === "REPOST") {
      hitRepost();
    } else {
      dispatch(setIsClicked({ payload: true }));

      if (isValid) {
        hitRepostQuote();
      }
    }
  };

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
