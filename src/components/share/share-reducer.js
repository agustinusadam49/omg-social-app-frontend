export const INITIAL_SHARE_STATE = {
  uploadPostPending: false,
  uploadPostLoading: false,
  isUploadPostSuccess: false,
  uploadImagePending: false,
  uploadImageLoading: false,
  isUploadImageSuccess: false,
};

export const shareActionType = {
  RUN_POST_PENDING: "RUN_POST_PENDING",
  STOP_POST_PENDING: "STOP_POST_PENDING",
  RUN_POST_LOADING: "RUN_POST_LOADING",
  STOP_POST_LOADING: "STOP_POST_LOADING",
  STOP_POST_LOADING_WHEN_SUCCESS: "STOP_POST_LOADING_WHEN_SUCCESS",
  STOP_POST_AND_IMAGE_SUCCESS: "STOP_POST_AND_IMAGE_SUCCESS",
  STOP_IMAGE_LOADING_WHEN_SUCCESS: "STOP_IMAGE_LOADING_WHEN_SUCCESS",
  RUN_IMAGE_PENDING: "RUN_IMAGE_PENDING",
  STOP_IMAGE_PENDING: "STOP_IMAGE_PENDING",
  RUN_IMAGE_LOADING: "RUN_IMAGE_LOADING",
  STOP_IMAGE_LOADING: "STOP_IMAGE_LOADING",
};

export const shareReducer = (state, action) => {
  switch (action.type) {
    case shareActionType.RUN_POST_PENDING: {
      return {
        ...state,
        uploadPostPending: true,
        uploadPostLoading: false,
        isUploadPostSuccess: false,
      };
    }
    case shareActionType.STOP_POST_PENDING: {
      return {
        ...state,
        uploadPostPending: false,
      };
    }
    case shareActionType.RUN_POST_LOADING: {
      return {
        ...state,
        uploadPostLoading: true,
        uploadPostPending: false,
        isUploadPostSuccess: false,
      };
    }
    case shareActionType.STOP_POST_LOADING: {
      return {
        ...state,
        uploadPostLoading: false,
      };
    }
    case shareActionType.STOP_POST_LOADING_WHEN_SUCCESS: {
      return {
        ...state,
        uploadPostLoading: false,
        isUploadPostSuccess: true,
      };
    }
    case shareActionType.RUN_IMAGE_PENDING: {
      return {
        ...state,
        uploadImagePending: true,
        uploadImageLoading: false,
        isUploadImageSuccess: false,
      };
    }
    case shareActionType.RUN_IMAGE_LOADING: {
      return {
        ...state,
        uploadImageLoading: true,
        uploadImagePending: false,
        isUploadImageSuccess: false,
      };
    }
    case shareActionType.STOP_IMAGE_PENDING: {
      return {
        ...state,
        uploadImagePending: false,
      };
    }
    case shareActionType.STOP_IMAGE_LOADING_WHEN_SUCCESS: {
      return {
        ...state,
        uploadImageLoading: false,
        isUploadImageSuccess: true,
      };
    }
    case shareActionType.STOP_IMAGE_LOADING: {
      return {
        ...state,
        uploadImageLoading: false,
      };
    }
    case shareActionType.STOP_POST_AND_IMAGE_SUCCESS: {
      return {
        ...state,
        isUploadPostSuccess: false,
        isUploadImageSuccess: false,
      };
    }
    default: {
      throw Error("Unknown action: " + action.type);
    }
  }
};
