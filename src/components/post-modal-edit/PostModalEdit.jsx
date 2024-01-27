import React, { useState, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsPostModalEditOpen,
  setStatusPost,
  setPostItem,
  setIsAddPosting,
} from "../../redux/slices/postsSlice";
import OptionStatus from "../option-status/OptionStatus";
import CancelIcon from "@mui/icons-material/Cancel";
import GlobalButton from "../button/GlobalButton";
import { updatePostById } from "../../apiCalls/postsApiFetch";
import {
  INITIAL_LOADING_STATE,
  actionType,
  loadingReducer,
} from "../../utils/reducers/globalLoadingReducer";

import "./PostModalEdit.scss";

export default function PostModalEdit() {
  const [loadingState, mutate] = useReducer(
    loadingReducer,
    INITIAL_LOADING_STATE
  );

  const dispatch = useDispatch();

  const statusPost = useSelector((state) => state.posts.statusPost);
  const postItemFromSlice = useSelector((state) => state.posts.postItem);
  const [activeStatus, setActiveStatus] = useState(statusPost);

  const doSaveEditPost = () => {
    if (loadingState.status) return;
    mutate({ type: actionType.RUN_LOADING_STATUS });
    const postId = postItemFromSlice.id;
    const payload = {
      postCaption: postItemFromSlice.postCaption,
      postDislike: postItemFromSlice.postDislike,
      postImageUrl: postItemFromSlice.postImageUrl,
      postLike: postItemFromSlice.postLike,
      status: activeStatus,
    };
    hitApiEditPostStatus(postId, payload);
  };

  const hitApiEditPostStatus = (idOfPost, postPayload) => {
    mutate({ type: actionType.RUN_LOADING_STATUS });
    updatePostById(idOfPost, postPayload)
      .then((successResponse) => {
        const successEditStatusPost = successResponse.data.code;
        if (successEditStatusPost === 201) {
          mutate({ type: actionType.STOP_LOADING_STATUS });
          dispatch(setIsPostModalEditOpen({ isPostModalEditOpen: false }));
          dispatch(setIsAddPosting({ isSuccessPosting: true }));
        }
      })
      .catch((error) => {
        console.log("Failed edit post status by id message:", error);
        mutate({ type: actionType.STOP_LOADING_STATUS });
      });
  };

  const closePostModalEdit = (value) => {
    dispatch(setIsPostModalEditOpen({ isPostModalEditOpen: value }));
    dispatch(setStatusPost({ statusPost: "" }));
    dispatch(setPostItem({ postItem: null }));
  };

  return (
    <div className="content-container post-modal-edit">
      <div className="post-modal-edit-wrapper">
        {/* Top Content of Modal */}
        <div className="post-modal-top-content">
          <div className="post-modal-top-content-title">Post Modal Edit</div>
          <CancelIcon
            className="post-modal-close-button"
            onClick={() => closePostModalEdit(false)}
          />
        </div>

        {/* Bottom Content of Modal */}
        <div className="post-modal-bottom-content">
          <OptionStatus
            setActiveStatus={setActiveStatus}
            activeStatus={activeStatus}
          />

          <div className="button-post-edit-wrapper">
            <GlobalButton
              buttonLabel={"Batal"}
              classStyleName={"post-edit-button cancel"}
              onClick={() => closePostModalEdit(false)}
            />

            <GlobalButton
              buttonLabel={loadingState.status ? "Loading ..." : "Edit Status"}
              classStyleName={"post-edit-button save"}
              onClick={doSaveEditPost}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
